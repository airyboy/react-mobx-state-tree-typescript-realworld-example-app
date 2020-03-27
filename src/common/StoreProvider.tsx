import React from "react";

import { connectReduxDevtools } from "mst-middlewares";

import { IStore, RootStore } from "../stores/RootStore";

const store = RootStore.create({});
export const StoreContext = React.createContext<IStore | null>(store);

if (process.env.NODE_ENV === "development") {
  /* tslint:disable-next-line */
  connectReduxDevtools(require("remotedev"), store);
}

export const StoreProvider: React.FC = ({ children }) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
