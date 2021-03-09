/*
- create a lookup "table": user_id, group_id
- pull from table for a given user, grab group_ids
- loop through, db.collection for each group_id
- pull in relevant group information
*/


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

    // Listen for the form submit and create/render the new group
    document.querySelector('form').addEventListener('submit', async function(event) {
      event.preventDefault()
      //grab data from form
      let destinationGroup = document.querySelector('#destinationGroup').value
      let type = document.querySelector('#type').value
      let url = document.querySelector('#url').value
      let title = document.querySelector('#title').value
      let category = document.querySelector('#category').value
      let time = document.querySelector('#time').value
      let commentary = document.querySelector('#commentary').value
      let docRef = await db.collection('content').add({ 
          //update this next!!
        groupname: groupName, 
        imageUrl: imageImageUrl, 
        likes: 0,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
      let groupId = docRef.id // the newly created document's ID
      document.querySelector('#groupName').value = '' // clear the group name field
    //   renderGroups(groupId, groupName, imageImageUrl, groupNumberOfPaperclips)
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