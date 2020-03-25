import React from "react";
import {
  FormLabel,
  FormGroup,
  FormControl,
  Col,
  Container,
  Alert
} from "react-bootstrap";
import { navigate } from "@reach/router";
import ROUTES from "../../routes";
import { withAuthorization } from "../Session";

const INITIAL_SIGNIN_STATE = {
  email: "",
  password: "",
  error: null,
  loading: false
};

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_SIGNIN_STATE };
  }
  onSubmit = event => {
    this.setState({ loading: true });
    const { email, password } = this.state;

    this.props.firebase
      .authenticateUser(email, password)
      .then(() => {
        this.setState({ ...INITIAL_SIGNIN_STATE });
        navigate(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, password, error, loading } = this.state;
    const isInvalid = password === "" || email === "" || loading;
    return (
      <Container>
        <Col xs={12} md={5} className="mx-md-auto">
          <form onSubmit={this.onSubmit}>
            <FormGroup>
              <FormLabel htmlFor="email">Email address</FormLabel>
              <FormControl
                id="email"
                name="email"
                value={email}
                onChange={this.onChange}
                type="email"
                placeholder="Enter Email"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl
                id="password"
                name="password"
                value={password}
                onChange={this.onChange}
                type="password"
                placeholder="Enter password"
              />
            </FormGroup>
            <button disabled={isInvalid} className="mt-4 btn btn-dark">
              Submit{" "}
              <div
                className={`spinner-border spinner-border-sm ${
                  loading ? "" : "d-none"
                }`}
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </button>
            {error && (
              <Alert variant="danger" className="mt-3">
                {error.message}
              </Alert>
            )}
          </form>
        </Col>
      </Container>
    );
  }
}

export default withAuthorization(authUser => !authUser, "/")(SignIn);
