import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <div id="page-container">
        <Header />
        <div id="content-wrap">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
