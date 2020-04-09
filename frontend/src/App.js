import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./Views/Navbar";
import SignIn from "./Views/Sign-in";
import { getCurrentUser } from "./Services/authservice";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  if (getCurrentUser()) {
    return (
      <div>
        <ToastContainer />
        <Navbar></Navbar>
      </div>
    );
  } else {
    return (
      <div>
        <SignIn />
      </div>
    );
  }
}

export default App;
