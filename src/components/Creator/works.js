import React from 'react'
import { withFirebase } from '../Firebase'
import { Container, Col, Alert, FormGroup, FormLabel, FormControl } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { withAuthorization, withAuthentication } from '../Session';

class CreatorWorks extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            current: 1,
            question: "",
            A: "",
            B: "",
            C: "",
            D: "",
            answer: "",
            loading: true,
            error: null,
        }
    }
    componentDidMount(){
        this.props.firebase.db.ref(`Exams/liveExams/${this.props.match.params.testId}/total`)
            .on('value', snapshot => {
                this.setState({current: snapshot.val() + 1, loading: false})
            })
    }
    onChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }
    onCreate = () => {
        const {current, question, A, B, C, D, answer} = this.state
        this.setState({loading: true})

        this.props.firebase.db.ref(`Exams/liveExams/${this.props.match.params.testId}/body/${current}`)
        .set({
            question,
            answer0: A,
            answer1: B,
            answer2: C,
            answer3: D,
            correctAnswer: answer
        })
        .then(() => {
            this.props.firebase.db.ref(`Exams/liveExams/${this.props.match.params.testId}`)
            .update({total: current})

            this.setState({current: current + 1})
        })
        .catch(error => {
            this.setState({error})
        })
        .finally(() => {
            this.setState({loading: false})
        })
    }
    render(){
        const {question, A, B, C, D, answer, loading, error} = this.state
        const isInvalid = !question || !A || !B || !C || !D || !answer || loading
        return (
            <>
                <Container className="py-5 row mx-auto">
                    <Col xs={12} md={5} className="mx-md-auto">
                        <form onSubmit={(event) => event.preventDefault()}>
                            <FormGroup>
                                <FormLabel htmlFor="questionBody">Question</FormLabel>
                                <FormControl id="questionBody" as="textarea" name="question" value={question} onChange={this.onChange} placeholder="Enter question body" />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor="optionA">Option A</FormLabel>
                                <FormControl id="optionA" as="textarea" name="A" value={A} onChange={this.onChange} placeholder="Enter option A" />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor="optionB">Option B</FormLabel>
                                <FormControl id="optionB" as="textarea" name="B" value={B} onChange={this.onChange} placeholder="Enter option B" />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor="optionC">Option C</FormLabel>
                                <FormControl id="optionC" as="textarea" name="C" value={C} onChange={this.onChange} placeholder="Enter option C" />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor="optionD">Option D</FormLabel>
                                <FormControl id="optionD" as="textarea" name="D" value={D} onChange={this.onChange} placeholder="Enter option D" />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor="answer">Answer</FormLabel>
                                <FormControl className="ml-2 w-50" as="select" name="answer" value={answer} onChange={this.onChange}>
                                    <option value="default">Select Answer</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </FormControl>
                            </FormGroup>
                            <button disabled={isInvalid} className="btn btn-dark mt-4" onClick={this.onCreate}>Create Question <div className={`spinner-border spinner-border-sm ${loading ? "": "d-none"}`} role="status">
                                <span className="sr-only">Loading...</span>
                            </div></button>
                            {error && <Alert variant="danger" className="mt-3">{error.message}</Alert>}
                        </form>
                    </Col>
                </Container>
            </>
        )
    }
}

export default withRouter(withAuthentication(withFirebase(withAuthorization(user => !!user)(CreatorWorks))))
