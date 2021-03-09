
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

    // Join-Group button 
        document.querySelector('.join-group').innerHTML = `
        <button class="">join group</button>
      `
      document.querySelector('.join-group').addEventListener('click', function(event) {
        console.log('join group clicked')

            // drop user information into user-group mapping table
            let docRefMapping = db.collection('user-group-mapping').add({ 
                groupId: 'VQfOJRhzZYYzUdUsxZUv', 
                userId: userId, 
                groupName: 'faMMM',
                created: firebase.firestore.FieldValue.serverTimestamp()
            })

      })
    
    // Render all groups when the page is loaded
    // let querySnapshot = await db.collection('groups').orderBy('created').get()
    // let groups = querySnapshot.docs
    // for (let i=0; i<groups.length; i++) {
    //   let groupId = groups[i].id
    //   let groupData = groups[i].data()
    //   let groupName = groupData.groupname
    //   let groupImageUrl = groupData.imageUrl
    //   renderGroups(groupId, groupName, groupImageUrl)
    // }

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
