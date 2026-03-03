import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GeneralContextProvider } from "./context/GeneralContext";
import Dashboard from "./components/Dashboard";
import Summary from "./components/Summary";
import Holdings from "./components/Holdings";

function App() {
  return (
    <BrowserRouter>
      <GeneralContextProvider>
        <Routes>
          <Route path="/*" element={<Dashboard />} />
        </Routes>
      </GeneralContextProvider>
    </BrowserRouter>
  );
}

export default App;