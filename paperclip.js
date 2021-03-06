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

    console.log('signed in')

    // Sign-out button
    document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <button class="text-pink-500 underline sign-out">Sign Out</button>
    `
    document.querySelector('.sign-out').addEventListener('click', function(event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'groups.html'
    })

    // Listen for the form submit and create/render the new group
    document.querySelector('form').addEventListener('submit', async function(event) {
      event.preventDefault()
      let groupName = document.querySelector('#groupName').value
      let groupImageUrl = document.querySelector('#image-url').value
      let groupNumberOfPaperclips = 0
      let docRef = await db.collection('posts').add({ 
        groupname: groupName, 
        imageUrl: groupImageUrl, 
        likes: 0,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
      let groupId = docRef.id // the newly created document's ID
      document.querySelector('#image-url').value = '' // clear the image url field
      document.querySelector('#groupName').value = '' // clear the image url field
      renderGroups(groupId, groupName, groupImageUrl, groupNumberOfPaperclips)
    })

    // Render all groups when the page is loaded
    let querySnapshot = await db.collection('posts').orderBy('created').get()
    let groups = querySnapshot.docs
    for (let i=0; i<groups.length; i++) {
      let groupId = groups[i].id
      let groupData = groups[i].data()
      let groupName = groupData.groupname
      let groupImageUrl = groupData.imageUrl
      let groupNumberOfPaperclips = groupData.likes
      renderGroups(groupId, groupName, groupImageUrl, groupNumberOfPaperclips)
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
      signInSuccessUrl: 'groups.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})

async function renderGroups(groupId, groupName, groupImageUrl, groupNumberOfPaperclips) {
  document.querySelector('.posts').insertAdjacentHTML('beforeend', `
    <div class="post-${groupId} md:mt-16 mt-8 space-y-4">
      <div class="md:mx-0 mx-4">
        <span class="font-bold text-xl">${groupName}</span>
      </div>
  
      <div>
        <img src="${groupImageUrl}" class="w-full">
      </div>
  
      <div class="text-3xl md:mx-0 mx-4">
        <button class="like-button">📎</button>
        <span class="likes">${groupNumberOfPaperclips}</span>
      </div>
    </div>
  `)

  document.querySelector(`.post-${groupId} .like-button`).addEventListener('click', async function(event) {
    event.preventDefault()
    console.log(`post ${groupId} like button clicked!`)
    let existingNumberOfLikes = document.querySelector(`.post-${groupId} .likes`).innerHTML
    let newNumberOfLikes = parseInt(existingNumberOfLikes) + 1
    document.querySelector(`.post-${groupId} .likes`).innerHTML = newNumberOfLikes
    await db.collection('posts').doc(groupId).update({
      likes: firebase.firestore.FieldValue.increment(1)
    })
  })
}