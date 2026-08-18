import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    const url = "https://urbanbites-48tb.onrender.com";

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({
                ...prev,
                [itemId]: 1
            }));
        } else {
            setCartItems((prev) => ({
                ...prev,
                [itemId]: prev[itemId] + 1
            }));
        }

        if (token) {
            await axios.post(
                url + "/api/cart/add",
                { itemId },
                { headers: { token } }
            );
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
        }));

        if (token) {
            await axios.post(
                url + "/api/cart/remove",
                { itemId },
                { headers: { token } }
            );
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find(
                    (product) => product._id === item
                );

                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }

        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(
                url + "/api/food/list"
            );

            if (response.data.success) {
                setFoodList(response.data.data || []);
            } else {
                setFoodList([]);
            }
        } catch (error) {
            console.log("Error fetching food:", error);
            setFoodList([]);
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(
                url + "/api/cart/get",
                {},
                {
                    headers: { token }
                }
            );

            setCartItems(response.data.cartData || {});
        } catch (error) {
            console.log("Error loading cart:", error);
            setCartItems({});
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchFoodList();

            const savedToken = localStorage.getItem("token");

            if (savedToken) {
                setToken(savedToken);
                await loadCartData(savedToken);
            }
        };

        loadData();
    }, []);

    const contextvalue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextvalue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;