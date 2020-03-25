import React from "react";
import styles from "./index.module.css";
import { withAuthorization } from "../Session";
import { Table } from "react-bootstrap";

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tests: [],
      results: null,
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
  getResults = examCode => {
    this.setState({ results: null });
    this.props.firebase
      .results(`${this.props.firebase.auth.currentUser.uid}/${examCode}`)
      .once("value", snapshot => {
        const data = snapshot.val();
        this.setState({ results: Object.keys(data || {}).map(k => ({ id: k, ...data[k]})) });
      });
  };
  tests = () =>
    this.state.tests.map(test => (
      <Test
        key={test.id}
        getResults={this.getResults}
        title={test.id}
        to={test.examCode}
        time={test.time}
      />
    ));
  render() {
    const { results } = this.state;
    return (
      <>
        <h1>Results</h1>
        <div className={styles.dashboard}>{this.tests()}</div>
        <div className={styles.table}>
          {results ? results.length ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Display Name</th>
                  <th>Attempted</th>
                  <th>Total</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id}>
                    <td>{r.displayName}</td>
                    <td>{r.attempted}</td>
                    <td>{r.totalQuestions}</td>
                    <td>{r.score}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ): <h3>No results yet</h3> : null}
        </div>
      </>
    );
  }
}

const Test = props => (
  <div className={styles.test}>
    <div className={styles.title}>{props.title.toUpperCase()}</div>
    <div className={styles.time}>{parseInt(props.time) / 30000} minutes</div>
    <button
      onClick={() => {
        props.getResults(props.to);
      }}
    >
      SEE RESULTS
    </button>
  </div>
);

export default withAuthorization(authUser => !!authUser)(Results);
