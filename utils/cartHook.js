import { useState } from 'react';

export default function useCart(initialState, token) {
    const [cart, setCart] = useState(initialState);
    
    const addItem = (item) => {
        const items = cart.slice(0);
        console.log("NEW CART");
        console.log(items);
        const pos = items.reduce((res, i) => {
            if(i.item.id === item.id)
                return items.indexOf(i);
            return res;
        }, -1);
        if(pos !== -1) {
            items[pos].count = items[pos].count + 1;
        } else {
            items.push({item: item, count: 1});
        }
        setCart(items);
    };

    const removeItem = (item) => {
        const items = cart.slice(0);
        const pos = items.reduce((res, i) => {
            if(i.item.id === item.id)
                return items.indexOf(i);
            return res;
        }, -1);
        if(pos !== -1) {
            if(items[pos].count === 1) {
                items.splice(pos, 1);
            } else {
                items[pos].count = items[pos].count - 1;
            }
            setCart(items);
        }
    };

    const removeAll = (item) => {
        const items = cart.slice(0);
        const pos = items.reduce((res, i) => {
            if(i.item.id === item.id)
                return items.indexOf(i);
            return res;
        }, -1);
        if(pos !== -1) {
            items.splice(pos, 1);
            setCart(items);
        }
    }

    return {
        cart: cart,
        addItem: addItem,
        removeItem: removeItem,
        removeAll: removeAll
    };
}