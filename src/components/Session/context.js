import React from 'react'
import {withFirebase} from '../Firebase'
import {withRouter} from 'react-router-dom'
import ROUTES from '../../routes'

const AuthUserContext = React.createContext(null);

export const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
          super(props)
          this.state = {authUser: null}
        }
        componentDidMount() {
          this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
              authUser
                  ? this.setState({authUser})
                  : this.setState({authUser: null})
          })
        }
        componentWillUnmount() {
            this.listener()
        }
        render(){
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            )
        }
    }
    return withFirebase(WithAuthentication)
}

export const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        componentDidMount(){
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if(!condition(authUser)) {
                        this.props.history.push(ROUTES.SIGNIN)
                    }
            })
        }
        componentWillUnmount(){
            this.listener()
        }
        render() {
            return <Component {...this.props} />
        }
    }
    return withRouter(withFirebase(WithAuthorization))
}

export default AuthUserContext
