import { useState } from 'react';
import send from './net';

export default function useCart(initialState, token) {
    const [cart, setCart] = useState(initialState);
    
    const addItem = (item, onSuccess = undefined) => {
        const items = cart.slice(0);
        const pos = items.reduce((res, i) => {
            if(i.item.id === item.id)
                return items.indexOf(i);
            return res;
        }, -1);
        send('api/cart/addtocart', 'POST', {"product.id": item.id, num: 1}, () => {
            if(pos !== -1) {
                items[pos].num = items[pos].num + 1;
            } else {
                items.push({item: item, num: 1});
            }
            setCart(items);
            if(onSuccess !== undefined) {
                onSuccess();
            }
        }, token);
        return items;
    };

    const removeItem = (item, onSuccess = undefined) => {
        const items = cart.slice(0);
        const pos = items.reduce((res, i) => {
            if(i.item.id === item.id)
                return items.indexOf(i);
            return res;
        }, -1);
        if(pos !== -1) {
            send('api/cart/deletefromcart', 'POST', {"product.id": item.id, num: 1}, () => {
                if(items[pos].num === 1) {
                    items.splice(pos, 1);
                } else {
                    items[pos].num = items[pos].num - 1;
                }
                setCart(items);
                if(onSuccess !== undefined) {
                    onSuccess();
                }
            }, token);
        }
        return items;
    };

    const removeAll = (item, onSuccess = undefined) => {
        const items = cart.slice(0);
        const pos = items.reduce((res, i) => {
            if(i.item.id === item.id)
                return items.indexOf(i);
            return res;
        }, -1);
        if(pos !== -1) {
            send('api/cart/deletefromcart', 'POST', {"product.id": item.id, num: items[pos].count}, () => {
                items.splice(pos, 1);
                setCart(items);
            }, token);
        }
        return items;
    }

    const loadCart = (items) => {
        setCart(items);
    }

    return {
        cart: cart,
        addItem: addItem,
        removeItem: removeItem,
        removeAll: removeAll,
        loadCart: loadCart
    };
}