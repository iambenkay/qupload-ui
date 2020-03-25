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
  name: "",
  cpassword: "",
  error: null,
  loading: false
};

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_SIGNIN_STATE };
  }
  onSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password, cpassword, name } = this.state;

    if (password !== cpassword) {
      this.setState({
        error: { message: "Passwords do not match" },
        loading: false
      });
      return;
    }
    this.props.firebase
      .createUser(email, password)
      .then(authUser => {
        this.props.firebase
          .db(`users/${authUser.user.uid}`)
          .set({ name, email });
        this.setState({ ...INITIAL_SIGNIN_STATE });
        navigate(ROUTES.SIGNIN);
      })
      .catch(error => {
        this.setState({ error });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, password, cpassword, name, error, loading } = this.state;
    const isInvalid = password === "" || email === "" || loading;
    return (
      <Container style={{ paddingTop: "50px" }}>
        <Col xs={12} md={5} className="mx-md-auto">
          <h2 style={{ textAlign: "center" }}>SIGN UP</h2>
          <form onSubmit={this.onSubmit}>
            <FormGroup>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <FormControl
                id="name"
                name="name"
                value={name}
                onChange={this.onChange}
                type="text"
                placeholder="Enter full name"
              />
            </FormGroup>
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
            <FormGroup>
              <FormLabel htmlFor="cpassword">Confirm Password</FormLabel>
              <FormControl
                id="cpassword"
                name="cpassword"
                value={cpassword}
                onChange={this.onChange}
                type="password"
                placeholder="Re-Enter password"
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

export default withAuthorization(authUser => !authUser, "/")(SignUp);
