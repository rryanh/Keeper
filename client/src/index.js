import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import { AJAX } from "./helper";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Navigate to="/login" replace />}></Route>
      <Route path="/" element={<App />}>
        <Route path="/app" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
