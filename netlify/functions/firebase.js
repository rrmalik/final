const firebase = require("firebase/app")
require("firebase/firestore")

const firebaseConfig = {} // replace

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

module.exports = firebase