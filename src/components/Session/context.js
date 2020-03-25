import React from "react";
import { withFirebase, FirebaseContext } from "../Firebase";
import { navigate } from "@reach/router";
import ROUTES from "../../routes";

const AuthUserContext = React.createContext(null);

export const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = { authUser: props.firebase.auth.currentUser };
    }
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      });
    }
    componentWillUnmount() {
      this.listener();
    }
    render() {
      return (
        <FirebaseContext.Consumer>
          {authUser => <Component {...this.props} authUser={authUser} />}
        </FirebaseContext.Consumer>
      );
    }
  }
  return withFirebase(WithAuthentication);
};

export const withAuthorization = (condition, to = ROUTES.SIGNIN) => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          navigate(to);
        }
      });
    }
    componentWillUnmount() {
      this.listener();
    }
    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }
  return withFirebase(WithAuthorization);
};

export default AuthUserContext;
