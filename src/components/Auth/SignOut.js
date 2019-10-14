import React from 'react'
import {withFirebase} from '../Firebase'

export default withFirebase(({firebase}) => (
    <button className="btn btn-dark font-weight-bold" onClick={firebase.signOut}>Sign Out</button>
))
