import * as firebase from "firebase/app"

import "firebase/auth"
import "firebase/database"

// ADD YOUR FIREBASE CONFIG OBJECT HERE:
var firebaseConfig = {
  apiKey: "AIzaSyCvlNpywlkDyPG-MhFDWKPCE38GL2yygOU",
    authDomain: "maverick-4a879.firebaseapp.com",
    databaseURL: "https://maverick-4a879.firebaseio.com",
    projectId: "maverick-4a879",
    storageBucket: "maverick-4a879.appspot.com",
    messagingSenderId: "880649996682",
    appId: "1:880649996682:web:c434e315f5a5433ddee073"
}

let firebaseApp = firebase.initializeApp(firebaseConfig)
let firebaseAuth = firebaseApp.auth()
let firebaseDb = firebaseApp.database()

export { firebaseAuth, firebaseDb }