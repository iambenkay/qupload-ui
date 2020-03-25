import React from "react";
import CreatorWorks from "./works";
import { withAuthorization } from "../Session";
import styles from "./index.module.css";
import { navigate } from "@reach/router";

class Creator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: false,
      current: 1,
      questionData: null,
      testName: null,
      testId: null,
      total: null,
      submitting: false
    };
  }
  updateState = state => {
    this.setState(state);
  };
  componentDidMount() {
    this.props.firebase.tests().once("value", snapshot => {
      const data = snapshot.val();
      console.log(data);
      const test = Object.keys(data).find(
        key =>
          data[key].examAdminId === this.props.firebase.auth.currentUser.uid &&
          this.props.testId === data[key].examCode
      );
      if (test)
        this.setState({
          authorized: true,
          testName: test,
          testId: data[test].examCode,
          total: data[test].total
        });
      else navigate("/tests");
    });
  }
  renderQUestionBookmarks = () =>
    Array.from({ length: this.state.total }).map((x, i) => (
      <div
        className={styles.bookmark}
        style={{ background: this.state.current === i + 1 ? "#060" : null }}
        key={i}
        onClick={() => {
          this.setState({ current: i + 1, questionData: null });
          this.props.firebase
            .tests(`${this.state.testName}/body/${i + 1}`)
            .once("value", snapshot => {
              this.setState({ questionData: snapshot.val() });
            });
        }}
      >
        {i + 1}
      </div>
    ));
  render() {
    const { questionData, authorized } = this.state;
    return authorized ? (
      <main>
        <div className={styles.questions}>{this.renderQUestionBookmarks()}</div>
        <div>
          {questionData ? (
            <QuestionPane
              name={this.state.testName}
              firebase={this.props.firebase}
              qno={this.state.current}
              questionData={questionData}
            />
          ) : (
            <Loader />
          )}
        </div>
      </main>
    ) : (
      <Loader />
    );
  }
}

const Loader = () => <div className={styles.loader}></div>;

class QuestionPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props.questionData };
  }
  update = () => {
    this.props.setter({ submitting: true });
    console.log(this.props.name);
    this.props.firebase.tests(`${this.props.name}/body`).update({
      [this.props.qno]: {
        ...this.props.questionData
      }
    }).then(() => {
      this.props.setter({ submitting: false });
    });
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const {
      answer0,
      answer1,
      answer2,
      answer3,
      question,
      correctAnswer
    } = this.state;
    const isInvalid =
      !answer0 ||
      !answer1 ||
      !answer2 ||
      !answer3 ||
      !correctAnswer ||
      !question;
    return (
      <>
        <div className={styles.questionnav}>
          <h2>Question {this.props.qno}</h2>
          <button
            disabled={isInvalid}
            className={styles.button}
            onClick={this.update}
          >
            UPDATE
          </button>
        </div>
        <div className={styles.editor}>
          <textarea
            className={styles.question}
            name="question"
            value={question}
            onChange={this.onChange}
            placeholder="Enter question"
          />
          <div className={styles.optionPane}>
            <div>
              <input
                value={answer0}
                defaultChecked={correctAnswer && correctAnswer === answer0}
                name="correctAnswer"
                type="radio"
                onChange={this.onChange}
                className={styles.radio}
              />
              <textarea
                value={answer0}
                name="answer0"
                onChange={this.onChange}
                className={styles.option}
                placeholder="Enter option A"
              />
            </div>
            <div>
              <input
                value={answer1}
                defaultChecked={correctAnswer && correctAnswer === answer1}
                name="correctAnswer"
                type="radio"
                onChange={this.onChange}
                className={styles.radio}
              />
              <textarea
                value={answer1}
                name="answer1"
                onChange={this.onChange}
                className={styles.option}
                placeholder="Enter option B"
              />
            </div>
            <div>
              <input
                value={answer2}
                defaultChecked={correctAnswer && correctAnswer === answer2}
                name="correctAnswer"
                type="radio"
                onChange={this.onChange}
                className={styles.radio}
              />
              <textarea
                value={answer2}
                name="answer2"
                onChange={this.onChange}
                className={styles.option}
                placeholder="Enter option C"
              />
            </div>
            <div>
              <input
                value={answer3}
                defaultChecked={correctAnswer && correctAnswer === answer3}
                name="correctAnswer"
                type="radio"
                onChange={this.onChange}
                className={styles.radio}
              />
              <textarea
                value={answer3}
                name="answer3"
                onChange={this.onChange}
                className={styles.option}
                placeholder="Enter option D"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withAuthorization(authUser => !!authUser)(Creator);
export { CreatorWorks };
