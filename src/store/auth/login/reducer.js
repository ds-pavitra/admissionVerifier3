import {
    CHECK_LOGIN, LOGIN_USER_SUCCESSFUL, API_ERROR, LOGOUT_USER, LOGOUT_USER_SUCCESS, VERIFY_EMAIL, VERIFY_EMAIL_SUCCESS, VERIFY_EMAIL_FAILURE, UPDATE_PASSWORD,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAILURE
} from './actionTypes';

const initialState = {
    loginError: null,
    message: null,
    loading: false,
    emailVerified: false,
    passwordUpdated: false,
};

const login = (state = initialState, action) => {
    switch (action.type) {
        case VERIFY_EMAIL:
            return {
                ...state,
                loading: true,
                emailVerified: false
            };
        case VERIFY_EMAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                emailVerified: true
            };
        case VERIFY_EMAIL_FAILURE:
            return {
                ...state,
                loading: false,
                emailVerified: false,
                loginError: action.payload
            };
        case UPDATE_PASSWORD:
            return { ...state, loading: true, passwordUpdated: false, updatePasswordError: null };
        case UPDATE_PASSWORD_SUCCESS:
            return { ...state, loading: false, passwordUpdated: true };
        case UPDATE_PASSWORD_FAILURE:
            return { ...state, loading: false, passwordUpdated: false, updatePasswordError: action.payload };

        case CHECK_LOGIN:
            return {
                ...state,
                loading: true
            };
        case LOGIN_USER_SUCCESSFUL:
            return {
                ...state,
                loading: false
            };
        case LOGOUT_USER:
            return {
                ...state
            };
        case LOGOUT_USER_SUCCESS:
            return {
                ...state
            };
        case API_ERROR:
            return {
                ...state,
                loading: false,
                loginError: action.payload
            };
        default:
            return state;
    }
};

export default login;
