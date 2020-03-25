import React from "react";
import { withFirebase } from "../Firebase";

export default withFirebase(({ firebase }) => (
  <li className="nav-link" onClick={firebase.signOut}>SIGN OUT</li>
));
