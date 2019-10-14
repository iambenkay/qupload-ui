import React from 'react'
import CreatorWorks from './works'
import { Container, Col, Alert, FormText, FormGroup, FormLabel, FormControl, } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import {withFirebase} from '../Firebase'
import { withAuthorization, withAuthentication } from '../Session';

const INITIAL_TEST_CREATION_STATE = {
    testId: "",
    duration: "",
    loading: false,
    error: null
}

class Creator extends React.Component {
    constructor(props) {
        super(props)
        this.state = { ...INITIAL_TEST_CREATION_STATE }
    }
    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    onSubmit = event => {
        const { testId, duration } = this.state
        this.setState({loading: true})
        this.props.firebase.db.ref(`Exams/liveExams/${testId}`)
        .set({time: duration * 60 * 1000, body: null, total: 0 })
        .then(() => {
            this.setState({...INITIAL_TEST_CREATION_STATE})
            this.props.history.push(`/creator/${testId}/manage/`)
        })
        .catch(error => {
            this.setState({error})
        })
        .finally(() => {
            this.setState({loading: false})
        })
        event.preventDefault()
    }
    render() {
        const { testId, duration, loading, error } = this.state
        const isInvalid = !testId || !duration || loading
        return (
            <Container className="py-5 row mx-auto">
                <Col xs={12} md={5} className="mx-md-auto">
                    <form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <FormLabel htmlFor="test_id">Unique ID for test</FormLabel>
                            <FormControl id="test_id" type="text" name="testId" value={testId} onChange={this.onChange} placeholder="Enter unique ID for test" />
                            <FormText className="text-muted">The above field must be unique. Test will override existing one if any</FormText>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="duration" >Duration (in minutes)</FormLabel>
                            <FormControl id="duration" type="number" name="duration" value={duration} onChange={this.onChange} placeholder="Enter duration of the test" />
                        </FormGroup>
                        <button disabled={isInvalid} className="btn btn-dark mt-4">Submit <div className={`spinner-border spinner-border-sm ${loading ? "": "d-none"}`} role="status">
                            <span className="sr-only">Loading...</span>
                        </div></button>
                        {error && <Alert variant="danger" className="mt-3">{error.message}</Alert>}
                    </form>
                </Col>
            </Container>
        )
    }
}

export default withRouter(withFirebase(withAuthentication(withAuthorization(user => !!user)(Creator))))
export { CreatorWorks }
