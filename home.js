
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
    firstName = splitUserName[0].toLowerCase()
    console.log(firstName)
    
    document.querySelector('.introduction').insertAdjacentHTML('beforeend', `
    <h1 class="text-6xl text-left pl-32"> <strong> hey, ${firstName} 👋  </strong> </h1>
        `)

    // Sign-out button new
    document.querySelector('.sign-out').innerHTML = `
      <button class="">sign out</button>
    `
    document.querySelector('.sign-out').addEventListener('click', function(event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'index.html'
    })

    // Pull all user's groupIds when page is loaded
    let querySnapshotUser = await db.collection('user-group-mapping').where('userId', '==', userId).get()
    let userGroups = querySnapshotUser.docs
      //grab user's groupIds
    for (let i=0; i<userGroups.length; i++) {
      let userGroupId = userGroups[i].id
      let userGroupData = userGroups[i].data()
      let userGroupIds = userGroupData.groupId 
      //grab group information
      let querySnapshot = await db.collection('groups').doc(userGroupIds).get()
      let groupData = querySnapshot.data()
      let groupName = groupData.groupname
      let groupImageUrl = groupData.imageUrl
      let groupId = userGroupIds

      //render groups
      renderUserGroups(groupId, groupName, groupImageUrl)
  }

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

async function renderUserGroups(groupId, groupName, groupImageUrl, groupNumberOfPaperclips) {
    document.querySelector('.userGroups').insertAdjacentHTML('beforeend', `
        <div class="px-1">
          <div class="groups-${groupId} md:mt-16 mt-8 space-y-2">
            <div class="md:mx-0 mx-4">
                <span class="font-bold text-xl">${groupName}</span>
            </div>
        
            <div>
                <img src="${groupImageUrl}" class="w-full shadow-2xl hover:border-2 hover:border-black">
            </div>
        
          </div>
        </div>
      
    `)

   // Clicking on a rendered Group sends user to Review Content page
   document.querySelector(`.groups-${groupId}`).addEventListener('click', async function(event) {
    event.preventDefault()
    console.log(`You clicked ${groupId}`)
    document.location.href = 'reviewcontent.html'
  })

}