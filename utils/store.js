const SET_TOKEN = "SET_TOKEN";
const ADD_ITEM = "ADD_ITEM";
const REMOVE_ITEM = "REMOVE_ITEM";

export const setToken = (value) => {
    return {type: SET_TOKEN, value: value}
}

export const addItem = (item) => {
    return {type: ADD_ITEM, item: item, count: 1};
} 

export const removeItem = (item) => {
    return {type: REMOVE_ITEM, id: item, count: 1 };
} 

const initialState = {
    value: ""
};

const initialCart = {
    items: []
}

export const tokenReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_TOKEN:
            return {...state, value: action.value}
        default:
            return state;
    }
};

export const cartReducer = (state = initialCart, action) => {
    let pos = -1;
    let items;
    switch(action.type) {
        case ADD_ITEM:
            items = state.items;
            if(items.some((item) => {
                pos++;
                return action.item.id === item.item.id;
            })) {
                items[pos].count = items[pos].count + 1;
            } else {
                items.push({item: action.item, count: 1});
            }
            return {...state, items: items};
        case REMOVE_ITEM:
            items = state.items;
            if(items.some((item) => {
                pos++;
                return action.id === item.id;
            })) {
                if(items[pos].count === 1) {
                    items.splice(index, 1);
                } else {
                    items[pos].count = items[pos].count - 1;
                }
            }
            return {...state, items: items};
        default:
            return state;
    }
}