const SET_TOKEN = "SET_TOKEN";

export const setToken = (value) => {
    return {type: SET_TOKEN, value: value}
}

const initialState = {
    value: ""
};

export const tokenReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_TOKEN:
            return {...state, value: action.value}
        default:
            return state;
    }
};