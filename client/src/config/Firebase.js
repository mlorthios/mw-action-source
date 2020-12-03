import firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCl9_6FjuOF_D0WrHH89PHm4xjFJmB0K6g",
    authDomain: "mw-actu-push.firebaseapp.com",
    databaseURL: "https://mw-actu-push.firebaseio.com",
    projectId: "mw-actu-push",
    storageBucket: "mw-actu-push.appspot.com",
    messagingSenderId: "1009105882365",
    appId: "1:1009105882365:web:c4dd904b73e54f30050294",
    measurementId: "G-8DHJB4KKH5"
}

// Initialize Firebase
let Firebase = firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()

export default Firebase
