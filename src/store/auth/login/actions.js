import { CHECK_LOGIN, LOGIN_USER_SUCCESSFUL, API_ERROR,LOGOUT_USER, LOGOUT_USER_SUCCESS,  VERIFY_EMAIL, VERIFY_EMAIL_SUCCESS, VERIFY_EMAIL_FAILURE, UPDATE_PASSWORD, UPDATE_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAILURE } from './actionTypes';

export const checkLogin = (user, history) => {
    return {
        type: CHECK_LOGIN,
        payload: { user, history }
    }
}

export const loginUserSuccessful = (user) => {
    return {
        type: LOGIN_USER_SUCCESSFUL,
        payload: user
    }
}

export const apiError = (error) => {
    return {
        type: API_ERROR,
        payload: error
    }
}

export const logoutUser = (history) => {
    return {
        type: LOGOUT_USER,
        payload: { history }
    }
}

export const logoutUserSuccess = () => {
    return {
        type: LOGOUT_USER_SUCCESS,
        payload: {}
    }
}


export const verifyEmail = (email, callback) => {
    return {
        type: VERIFY_EMAIL,
        payload: { email, callback }
    };
};

export const verifyEmailSuccess = () => {
    return {
        type: VERIFY_EMAIL_SUCCESS,
    };
};

export const verifyEmailFailure = (error) => {
    return {
        type: VERIFY_EMAIL_FAILURE,
        payload: error
    };
};


export const updatePassword = (passwordData, callback) => {
    return {
        type: UPDATE_PASSWORD,
        payload: { passwordData, callback }
    };
};

export const updatePasswordSuccess = () => {
    return {
        type: UPDATE_PASSWORD_SUCCESS,
    };
};

export const updatePasswordFailure = (error) => {
    return {
        type: UPDATE_PASSWORD_FAILURE,
        payload: error
    };
};