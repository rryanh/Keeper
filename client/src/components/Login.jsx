import React, { useState } from "react";
import "../styles/login.css";

function Login() {
  return (
    <div className="login-container col-lg-12">
      <div className="d-grid gap-2">
        <a
          className="btn btn-lg  btn-google "
          aria-disabled="true"
          href="/auth/google"
          role="button"
        >
          <i className=" btn-icon fab fa-google"></i>
          Sign In with Google
        </a>
        <a
          className="disabled btn btn-default btn-lg btn-facebook"
          href="/auth/google"
          role="button"
        >
          <i className=" btn-icon fab fa-facebook-f "></i>
          Sign In with Facebook
        </a>
        <a
          className=" disabled btn  btn-lg btn-linkedin"
          href="/auth/google"
          role="button"
        >
          <i className="btn-icon fab fa-linkedin"></i>
          Sign In with Linkedin
        </a>
      </div>
    </div>
  );
}

export default Login;
