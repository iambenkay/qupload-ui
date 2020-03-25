import React from "react";
import styles from "./index.module.css";
import { withAuthorization } from "../Session";
import { Col, Container, Form, Alert } from "react-bootstrap";
import { navigate } from "@reach/router";

class Tests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tests: [],
      creating: false
    };
  }
  componentDidMount() {
    this.props.firebase.tests().on("value", snapshot => {
      const data = snapshot.val();
      const tests = Object.keys(data)
        .filter(
          key =>
            data[key].examAdminId === this.props.firebase.auth.currentUser.uid
        )
        .map(key => ({
          id: key,
          examCode: data[key].examCode,
          time: data[key].time,
          total: data[key].total
        }));

      this.setState({ tests });
    });
  }
  componentWillUnmount() {
    this.props.firebase.tests().off();
  }
  tests = () =>
    this.state.tests.map(test => (
      <Test key={test.id} title={test.id} to={test.examCode} time={test.time} />
    ));
  render() {
    return (
      <>
        {this.state.creating ? (
          <Createtest
            firebase={this.props.firebase}
            blur={() => this.setState({ creating: false })}
          />
        ) : null}
        <h1>Tests</h1>
        <button
          className={styles.createtest}
          onClick={() => this.setState({ creating: true })}
        >
          CREATE TEST +
        </button>
        <div className={styles.dashboard}>{this.tests()}</div>;
      </>
    );
  }
}

const Test = props => (
  <div className={styles.test}>
    <div className={styles.title}>{props.title.toUpperCase()}</div>
    <div className={styles.time}>{parseInt(props.time) / 30000} minutes</div>
    <button onClick={() => navigate(`/tests/${props.to}`)}>MANAGE</button>
  </div>
);

class Createtest extends React.Component {
  INITIAL_STATE = {
    name: "",
    code: "",
    time: null,
    total: null,
    error: "",
    loading: false
  };
  modal = React.createRef();
  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }
  onSubmit = () => {
    this.setState({ loading: true });
    const { name, code, time, total } = this.state;

    this.props.firebase
      .tests(name)
      .set({
        examAdminId: this.props.firebase.auth.currentUser.uid,
        examCode: code,
        time: time * 60000,
        total
      })
      .then(() => {
        this.setState({ ...this.INITIAL_STATE });
        this.props.blur();
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
  times = [10, 20, 30, 50, 60, 120];
  questions = [10, 20, 30, 50, 70, 100];
  render() {
    const { name, time, code, total, error, loading } = this.state;
    const isInvalid = !name || !time || !code || !total;
    return (
      <div
        className={styles.modal}
        ref={this.modal}
        onClick={e => {
          if (this.modal.current === e.target) {
            this.props.blur();
          }
        }}
      >
        <div className={styles.card}>
          <h3>CREATE TEST</h3>
          <Container>
            <Col>
              <form onSubmit={this.onSubmit}>
                <Form.Group>
                  <Form.Label htmlFor="name">Test name</Form.Label>
                  <Form.Control
                    name="name"
                    value={name}
                    onChange={this.onChange}
                    type="text"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="code">Test code</Form.Label>
                  <Form.Control
                    name="code"
                    value={code}
                    onChange={this.onChange}
                    type="text"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label as="legend">No. of questions: </Form.Label>
                  <br />
                  {this.questions.map(n => (
                    <Form.Check
                      inline
                      key={n}
                      type="radio"
                      name="total"
                      label={n}
                      onChange={this.onChange}
                      value={n}
                    />
                  ))}
                </Form.Group>
                <Form.Group>
                  <Form.Label as="legend">Time to complete: </Form.Label>
                  <br />
                  {this.times.map(n => (
                    <Form.Check
                      inline
                      key={n}
                      type="radio"
                      name="time"
                      label={`${n} mins`}
                      onChange={this.onChange}
                      value={n}
                    />
                  ))}
                </Form.Group>

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
        </div>
      </div>
    );
  }
}
export default withAuthorization(authUser => !!authUser)(Tests);
