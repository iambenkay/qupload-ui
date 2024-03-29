import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

export default class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
  }
  /* AUTH API */
  createUser = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
  authenticateUser = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  signOut = () => this.auth.signOut();
  resetUserPassword = email => this.auth.sendPasswordResetEmail(email);

  /* DATA ACCESS API */
  tests = (path = null) => this.db.ref(`Exams/liveExams/${path ? path: ""}`);
  results = (path = null) => this.db.ref(`ResultForView/${path ? path: ""}`);
}
