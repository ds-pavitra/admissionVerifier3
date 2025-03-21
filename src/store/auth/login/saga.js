import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

// Login Redux States
import { CHECK_LOGIN, LOGOUT_USER } from './actionTypes';
import { apiError, loginUserSuccessful, logoutUserSuccess } from './actions';

// AUTH related methods
// import { postLogin } from '../../../helpers/fackBackend_Helper';
import { apiBaseUrl, apiRequestAsync } from "../../../common/data/userData";

const loginUrl = `${apiBaseUrl}/login`;

//If user is login then dispatch redux action's are directly from here.
function* loginUser({ payload: { user, history } }) {
    try {
        const response = yield call(loginWithEmailPasswordAsync, user.email, user.password);
        
        if (response.status === 200) {
            localStorage.setItem("authUser", JSON.stringify(response));
            yield put(loginUserSuccessful(response));
            history('/dashboard'); // Redirect on success
        } else {
            yield put(apiError(response.message || "Login failed. Please try again."));
        }
    } catch (error) {
        let errorMessage = "Something went wrong. Please try again.";
        
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        yield put(apiError(errorMessage)); // Dispatch a readable error message
    }
}


const loginWithEmailPasswordAsync = (email, password) => {
    return apiRequestAsync('POST', loginUrl, { email, password });
};


function* logoutUser({ payload: { history } }) {
    try {
        localStorage.removeItem("authUser");
        logoutUserSuccess()
        history('/login');
    } catch (error) {
        yield put(apiError(error));
    }
}

export function* watchUserLogin() {
    yield takeEvery(CHECK_LOGIN, loginUser);
}

export function* watchUserLogout() {
    yield takeEvery(LOGOUT_USER, logoutUser);
}

function* loginSaga() {
    yield all([
        fork(watchUserLogin),
        fork(watchUserLogout),
    ]);
}

export default loginSaga;