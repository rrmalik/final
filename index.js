let db = firebase.firestore()

// Change main event listener from DOMContentLoaded to 
// firebase.auth().onAuthStateChanged and move code that 
// shows login UI to only show when signed out
firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    // Signed in
    console.log('signed in')

    // Ensure the signed-in user is in the users collection
    db.collection('users').doc(user.uid).set({
      name: user.displayName,
      email: user.email
    })

    let userName = user.displayName
    let userId = user.uid

    console.log(`${userName} signed in`)

    splitUserName = userName.split(' ')
    firstName = splitUserName[0]
    console.log(firstName)

    document.location.href = 'homepage.html'

    // // Sign-up button new
    // document.querySelector('.sign-up').innerHTML = `
    //   <button class=""> sign up </button>
    // `
    // document.querySelector('.sign-up').addEventListener('click', function(event) {
    //   console.log('sign out clicked')
    //   firebase.auth().signOut()
    //   document.location.href = 'index.html'
    // })

  } else {
    // Signed out
    console.log('signed out')

    // Hide the form when signed-out
    // document.querySelector('form').classList.add('hidden')

    // Log-in button new
    document.querySelector('.log-in').innerHTML = `
    <button class=""> log in </button>
    `
    document.querySelector('.log-in').addEventListener('click', function(event) {
        console.log('log in clicked')  
      // Initializes FirebaseUI Auth
      let ui = new firebaseui.auth.AuthUI(firebase.auth())
  
      // FirebaseUI configuration
      let authUIConfig = {
        signInOptions: [
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        signInSuccessUrl: 'homepage.html'
      }
      // Starts FirebaseUI Auth
      ui.start('.sign-in-or-sign-out', authUIConfig)
    })

    // Sign-up button new
    document.querySelector('.sign-up').innerHTML = `
    <button class=""> sign up </button>
    `
    document.querySelector('.sign-up').addEventListener('click', function(event) {
      console.log('sign up clicked')
    //   firebase.auth().signOut()
    //   document.location.href = 'index.html'

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'homepage.html'
    }
    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  })
}
})