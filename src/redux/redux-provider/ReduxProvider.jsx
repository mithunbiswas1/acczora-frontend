// src/redux/reduxProvider/ReduxProvider.jsx

"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux/store/store";
import { initializeCart } from "@/redux/slice/CartDrawerSlice";

function CartInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeCart());
  }, [dispatch]);

  return null;
}

const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <CartInitializer />
      {children}
    </Provider>
  );
};

export default ReduxProvider;
