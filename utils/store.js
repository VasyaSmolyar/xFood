const SET_TOKEN = "SET_TOKEN";
const ADD_ITEM = "ADD_ITEM";
const REMOVE_ITEM = "REMOVE_ITEM";
const LOAD_CART = "LOAD_CART";
const SET_PRICE = "SET_PRICE"; 

export const setToken = (value) => {
    return {type: SET_TOKEN, value: value}
}

export const addItem = (item) => {
    return {type: ADD_ITEM, item: item, count: 1};
} 

export const removeItem = (item) => {
    return {type: REMOVE_ITEM, item: item, count: 1 };
} 

export const removeAllItem = (item) => {
    return {type: REMOVE_ITEM, item: item, count: item.count };
} 

export const loadCart = (items) => {
    return {type: LOAD_CART, items: items };
}

export const setPrice = (price, delivery) => {
    return {type: SET_PRICE, price: price, delivery: delivery };
}

const initialState = {
    value: ""
};

const initialCart = {
    items: []
}

const initialPrice = {
    price: 0,
    delivery: 0
}

export const priceReducer = (state = initialPrice, action) => {
    switch(action.type) {
        case SET_PRICE:
            return {...state, price: action.price, delivery: action.delivery}
        default:
            return state;
    }
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
                items[pos].count = items[pos].count + action.count;
            } else {
                items.push({item: action.item, count: action.count});
            }
            return {...state, items: items};
        case REMOVE_ITEM:
            items = state.items;
            if(items.some((item) => {
                pos++;
                return action.item.id === item.item.id;
            })) {
                if(items[pos].count <= action.count) {
                    items.splice(pos, 1);
                } else {
                    items[pos].count = items[pos].count - action.count;
                }
            }
            return {...state, items: items};
        case LOAD_CART:
            return {...state, items: action.items};
        default:
            return state;
    }
}