import React from "react";
import styles from "./index.module.css";
import ROUTES from "../../routes";
import { navigate } from "@reach/router";
import { withAuthorization } from "../Session";

class Home extends React.Component {
  render() {
    return (
      <>
        <div className={styles.dashboard}>
          <Card data="Tests" to={ROUTES.MANAGETESTS} />
          <Card data="Results" to={ROUTES.MANAGETESTS} />
        </div>
      </>
    );
  }
}

const Card = ({ data, to }) => (
  <div className={styles.item}>
    <div>{data}</div>
    <div>
      <button
        className={styles.managetests}
        onClick={() => {
          navigate(to);
        }}
      >
        MANAGE {data.toUpperCase()}
      </button>
    </div>
  </div>
);

export default withAuthorization(authUser => !!authUser)(Home);
