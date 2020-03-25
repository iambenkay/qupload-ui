import React from "react";
import "./App.css";
import { Router } from "@reach/router";
import Navigation from "./components/Navigation";
import { SignIn } from "./components/Auth";
import Home from "./components/Home";
import Tests from "./components/Tests";
import { AuthUserContext, withAuthentication } from "./components/Session";
import Creator, { CreatorWorks } from "./components/Creator";

const App = ({ firebase }) => (
  <AuthUserContext.Provider value={firebase.auth.currentUser}>
    <Navigation />
    <Router className="router">
      <Home path="/" />
      <SignIn path="signin" />
      <Tests path="tests" />
      <Creator path="tests/:testId" />
      <CreatorWorks path="results" />
    </Router>
  </AuthUserContext.Provider>
);

export default withAuthentication(App);
