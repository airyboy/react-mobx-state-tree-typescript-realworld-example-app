import React from "react";
import { StoreProvider } from "./common/StoreProvider";
import AppRouter from "./AppRouter";

function App() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  );
}

export default App;
