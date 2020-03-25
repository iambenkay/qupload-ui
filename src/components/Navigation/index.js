import React from "react";
import ROUTES from "../../routes";
import { Link } from "@reach/router";
import { withFirebase } from "../Firebase";
import { navigate } from "@reach/router";
import { SignOut } from "../Auth";
import styles from "./index.module.css";

export default withFirebase(({ firebase }) => (
  <>
    <nav>
      <Link to={ROUTES.HOME} className={styles.brand}>
        RAADAA QUPLOAD
      </Link>
      <ul>
        {firebase.auth.currentUser ? (
          <SignOut />
        ) : (
          <>
            <li onClick={() => navigate(ROUTES.SIGNIN)}>SIGN IN</li>
            <li onClick={() => navigate("/signup")}>SIGN UP</li>
          </>
        )}
      </ul>
    </nav>
  </>
));
