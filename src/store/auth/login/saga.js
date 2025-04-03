import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

// Login Redux States
import { CHECK_LOGIN, LOGOUT_USER, VERIFY_EMAIL, UPDATE_PASSWORD } from './actionTypes';
import { apiError, loginUserSuccessful, logoutUserSuccess, verifyEmailSuccess, verifyEmailFailure, updatePasswordSuccess, updatePasswordFailure } from './actions';

import { apiBaseUrl, apiRequestAsync } from "../../../common/data/userData";

const loginUrl = `${apiBaseUrl}/login`;
const verifyEmailUrl = `${apiBaseUrl}/email/check`;
const updatePasswordUrl = `${apiBaseUrl}/password/update`;

// Verify Email Saga
function* verifyEmail({ payload: { email, callback } }) {
    try {
        const response = yield call(apiRequestAsync, 'POST', verifyEmailUrl, { email });

        if (response.status === 200) {
            if (response.result.user_status === 0) {
                // If user_status is 0, show the new password form
                yield put(verifyEmailSuccess());
                callback('new_password');
            } else if (response.result.user_status === 1) {
                // If user_status is 1, show the password input for login
                yield put(verifyEmailSuccess());
                callback('login');
            } else {
                // Handle other cases if needed
                callback('error');
            }
        } else {
            yield put(verifyEmailFailure(response.message || "Email verification failed."));
            callback('error');
        }
    } catch (error) {
        yield put(verifyEmailFailure(error.message || "Error verifying email."));
        callback('error');
    }
}

// Update Password Saga
function* updatePassword({ payload: { passwordData, callback } }) {
    try {

        const response = yield call(apiRequestAsync, 'POST', updatePasswordUrl, passwordData);
        if (response.status === 200) {
            yield put(updatePasswordSuccess());
            callback(true); // ✅ Successful update
        } else {
            yield put(updatePasswordFailure(response.message || "Password update failed."));
            callback(false); // ❌ Failure case
        }
    } catch (error) {
        yield put(updatePasswordFailure(error.message || "Error updating password."));
        callback(false); // ❌ Error case
    }
}


// Login User Saga
function* loginUser({ payload: { user, history } }) {
    try {
        const response = yield call(apiRequestAsync, 'POST', loginUrl, { email: user.email, password: user.password });

        if (response.status === 200) {
            localStorage.setItem("authUser", JSON.stringify(response));
            yield put(loginUserSuccessful(response));
            history('/dashboard');
        } else {
            yield put(apiError(response.message || "Login failed."));
        }
    } catch (error) {
        yield put(apiError(error.message || "Error during login."));
    }
}

// Logout User Saga
function* logoutUser({ payload: { history } }) {
    try {
        localStorage.removeItem("authUser");
        yield put(logoutUserSuccess());
        history('/login');
    } catch (error) {
        yield put(apiError(error.message || "Logout failed."));
    }
}

// Watchers
export function* watchVerifyEmail() {
    yield takeEvery(VERIFY_EMAIL, verifyEmail);
}

export function* watchUserLogin() {
    yield takeEvery(CHECK_LOGIN, loginUser);
}

export function* watchUserLogout() {
    yield takeEvery(LOGOUT_USER, logoutUser);
}

export function* watchUpdatePassword() {
    yield takeEvery(UPDATE_PASSWORD, updatePassword);
}

// Root Saga
function* loginSaga() {
    yield all([
        fork(watchVerifyEmail),
        fork(watchUserLogin),
        fork(watchUserLogout),
        fork(watchUpdatePassword),
    ]);
}

export default loginSaga;
