import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

//Account Redux states
import { REGISTER_USER } from './actionTypes';
import { registerUserSuccessful, registerUserFailed } from './actions';

//AUTH related methods
// import { postRegister } from '../../../helpers/fackBackend_Helper';
import { apiBaseUrl, apiRequestAsync } from "../../../common/data/userData";

const registerUrl = `${apiBaseUrl}/register`;

// Is user register successfull then direct plot user in redux.
// function* registerUser({ payload: { user } }) {
//     try {
//         if(process.env.REACT_APP_DEFAULTAUTH === "firebase"){
//             const response = yield call(fireBaseBackend.registerUser, user.email, user.password);
//             yield put(registerUserSuccessful(response));
//         }
//         else{
//             const response = yield call(postRegister, '/post-register', user);
//             yield put(registerUserSuccessful(response));
//         }
//     } catch (error) {
//         yield put(registerUserFailed(error));
//     }
// }

function* registerUser({ payload: { user, history } }) {
    try {
        const response = yield call(registerAsync, user);
        
        if (response.status === 200) {
            localStorage.setItem("authUser", JSON.stringify(response));
            yield put(registerUserSuccessful(response));
            history('/login') // Redirect on success
        } else {
            yield put(registerUserFailed(response.message || "Registration failed. Please try again."));
        }
    } catch (error) {
        let errorMessage = "Something went wrong. Please try again.";
        
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        yield put(registerUserFailed(errorMessage)); // Dispatch a readable error message
    }
}


const registerAsync = (user) => {
    return apiRequestAsync('POST', registerUrl, user );
};



export function* watchUserRegister() {
    yield takeEvery(REGISTER_USER, registerUser)
}

function* accountSaga() {
    yield all([fork(watchUserRegister)]);
}

export default accountSaga;