
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

    // Sign-out button new
    document.querySelector('.sign-out').innerHTML = `
      <button class="">sign out</button>
    `
    document.querySelector('.sign-out').addEventListener('click', function(event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'index.html'
    })

    // Random integer function
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Listen for the form submit and create/render the new group
    document.querySelector('form').addEventListener('submit', async function(event) {
      event.preventDefault()
      let groupName = document.querySelector('#groupName').value
      let groupNumberOfPaperclips = 0
         // Grab random image from firebase to assign to group avatar
            let imageSnapshot = await db.collection('images').get()
            let images = imageSnapshot.docs
            imageData = images[getRandomInt(0,images.length)].data()
            imageImageUrl = imageData.imageURL
            console.log(imageImageUrl)
        // drop group information into firebase "group" collection
      let docRef = await db.collection('groups').add({ 
        groupname: groupName, 
        imageUrl: imageImageUrl, 
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
      let groupId = docRef.id // the newly created document's ID
        
      // drop user information into user-group mapping table
      let docRefMapping = await db.collection('user-group-mapping').add({ 
        groupId: groupId, 
        userId: userId, 
        groupName: groupName,
        userName: firstName,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
      document.querySelector('#groupName').value = '' // clear the group name field
    })


  } else {
    // Signed out
    console.log('signed out')

    // Hide the form when signed-out
    document.querySelector('form').classList.add('hidden')

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'exploregroups.html'
    }
    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})