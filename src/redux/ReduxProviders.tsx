"use client";
import { FC, ReactNode } from "react";
import { store } from "./configureStore";
import { Provider } from "react-redux";

interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider: FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
