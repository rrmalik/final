const firebase = require("firebase/app")
require("firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyAifIXtUqXHGO6I1PCQrNR_f4fAmlx2kCU",
  authDomain: "paperclip---kiei451.firebaseapp.com",
  projectId: "paperclip---kiei451",
  storageBucket: "paperclip---kiei451.appspot.com",
  messagingSenderId: "601420250611",
  appId: "1:601420250611:web:daa06d99774bd5c1c4e686"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

module.exports = firebase