import React from "react";
import { IStore } from "../stores/RootStore";
import { StoreContext } from "./StoreProvider";

export function useStores(): IStore {
  const store = React.useContext(StoreContext);

  if (!store) {
    throw new Error("StoreProvider is not defined");
  }

  return store;
}
