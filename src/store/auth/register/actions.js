import { REGISTER_USER, REGISTER_USER_SUCCESSFUL, REGISTER_USER_FAILED } from './actionTypes';

export const registerUser = (user, history) => {
    return {
        type: REGISTER_USER,
        payload: { user, history }
    }
}

export const registerUserSuccessful = (user) => {
    return {
        type: REGISTER_USER_SUCCESSFUL,
        payload: user
    }
}

export const registerUserFailed = (error) => {
    return {
        type: REGISTER_USER_FAILED,
        payload: error
    }
}
