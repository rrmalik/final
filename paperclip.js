/*
TO DOs:
UI:
- Reorganize groups so there are 4 per row (using flex?)
- Add image shadow on left and bottom
- Update font to Lato?
UX:
- Add "back to home" button and logo in top nav menu
- Move "Create Group" form to separate page
- Have images be programmatically populated? Create inventory of images in Firebase?
- Images should be buttons that link to content pages (using ?q=)
- Decide if we want to do anything with the "likes" functionality or just remove
Back End: 
- Create API intermediatary to write/read from Firebase
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
    
    document.querySelector('.introduction').insertAdjacentHTML('beforeend', `
    <h1 class="text-6xl text-left pl-32"> <strong> hey, raman 👋  </strong> </h1>
        `)

    // // Sign-out button orig
    // document.querySelector('.sign-in-or-sign-out').innerHTML = `
    //   <button class="text-pink-500 underline sign-out">Sign Out</button>
    // `
    // document.querySelector('.sign-out').addEventListener('click', function(event) {
    //   console.log('sign out clicked')
    //   firebase.auth().signOut()
    //   document.location.href = 'index.html'
    // })

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
      let docRef = await db.collection('groups').add({ 
        groupname: groupName, 
        imageUrl: imageImageUrl, 
        likes: 0,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
      let groupId = docRef.id // the newly created document's ID
      document.querySelector('#groupName').value = '' // clear the group name field
      renderGroups(groupId, groupName, imageImageUrl, groupNumberOfPaperclips)
    })

    // Render all groups when the page is loaded
    let querySnapshot = await db.collection('groups').orderBy('created').get()
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
      signInSuccessUrl: 'exploregroups.html'
    }
    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})

async function renderGroups(groupId, groupName, groupImageUrl, groupNumberOfPaperclips) {
  document.querySelector('.groups').insertAdjacentHTML('beforeend', `
      <div class="px-1">
        <div class="groups-${groupId} md:mt-16 mt-8 space-y-4">
          <div class="md:mx-0 mx-4">
              <span class="font-bold text-xl">${groupName}</span>
          </div>
      
          <div>
              <img src="${groupImageUrl}" class="w-full shadow-2xl">
          </div>
      
          <div class="text-3xl md:mx-0 mx-4">
              <button class="like-button">📎</button>
              <span class="likes">${groupNumberOfPaperclips}</span>
          </div>
        </div>
      </div>
    
  `)

  //Clicking on a rendered Group sends user to Review Content page
  document.querySelector(`.groups-${groupId}`).addEventListener('click', async function(event) {
    event.preventDefault()
    console.log(`You clicked ${groupId}`)
    document.location.href = 'reviewcontent.html'
  })


  document.querySelector(`.groups-${groupId} .like-button`).addEventListener('click', async function(event) {
    event.preventDefault()
    console.log(`groups ${groupId} like button clicked!`)
    let existingNumberOfLikes = document.querySelector(`.groups-${groupId} .likes`).innerHTML
    let newNumberOfLikes = parseInt(existingNumberOfLikes) + 1
    document.querySelector(`.groups-${groupId} .likes`).innerHTML = newNumberOfLikes
    await db.collection('groups').doc(groupId).update({
      likes: firebase.firestore.FieldValue.increment(1)
    })
  })
}