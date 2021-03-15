
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
    <h1 class="text-6xl text-left pl-2 sm:pl-32"> <strong> hey, ${firstName} 👋  </strong> </h1>
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

    // Explore groups
    document.querySelector('.explore-groups').innerHTML = `
      <button class="">explore groups</button>
    `
    document.querySelector('.explore-groups').addEventListener('click', function(event) {
      console.log('explore groups clicked')
      document.location.href = 'exploregroups.html'
    })

    // Pull all user's groupIds when pages is loaded
    let responseUserGroups = await fetch(`/.netlify/functions/get_user_group_mapping?userid=${userId}`)
    let userGroupSnapshot = await responseUserGroups.json()
      
    //grab user's groupIds
    for (let i=0; i<userGroupSnapshot.length; i++) {
      let userGroupId = userGroupSnapshot[i].id
      let userGroupIds = userGroupSnapshot[i].userGroupIds 
      
      //grab group information
      let responseGroupInfo = await fetch(`/.netlify/functions/get_groups?groupid=${userGroupIds}`)
      let groupSnapshot = await responseGroupInfo.json()
      let groupSnapshotData = groupSnapshot[0]
      let groupName = groupSnapshotData.groupName
      let groupImageUrl = groupSnapshotData.groupImageUrl
      let groupId = groupSnapshotData.groupId

      //render groups
      renderUserGroups(groupId, groupName, groupImageUrl)
  }

  
 // BUILD THE MODAL
 var modal = document.getElementById("myModal"); // Get the modal
 var btn = document.getElementById("myBtn"); // Get the button that opens the modal
 var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal
 
 btn.onclick = function() {    // When the user clicks on the button, open the modal
   modal.style.display = "block";
 }

 span.onclick = function() { // When the user clicks on <span> (x), close the modal
   modal.style.display = "none";
 }

 window.onclick = function(event) {  // When the user clicks anywhere outside of the modal, close it
   if (event.target == modal) {
     modal.style.display = "none";
   }
 }

// START - create group flow

    // Populate the "Create Group" button 
        document.querySelector('.creategroup').innerHTML = `
        <button class="">create group</button>
        `

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
       // Grab random image from firebase to assign to group avatar
          let responseImages = await fetch(`/.netlify/functions/get_images`)
          let imageSnapshot = await responseImages.json()
          let imageImageUrl = imageSnapshot[0].imageImageUrl
    
      // drop group information into firebase "group" collection
      let newGroupResponse = await fetch('/.netlify/functions/create_group', {
        method: 'POST',
        body: JSON.stringify({
          groupname: groupName,
          imageUrl: imageImageUrl
        })
      })
      
      let newGroup = await newGroupResponse.json()
      let newGroupId = newGroup.id //newly created document's ID
      
    // drop user information into user-group mapping table
      let newMappingResponse = await fetch('/.netlify/functions/create_user_group_map', {
        method: 'POST',
        body: JSON.stringify({
          newGroupId: newGroupId, 
          userId: userId, 
          groupName: groupName,
          firstName: firstName
        })
      })
 
    document.querySelector('#groupName').value = '' // clear the group name field
    modal.style.display = "none";

    renderUserGroups(newGroupId, groupName, imageImageUrl)
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

async function renderUserGroups(groupId, groupName, groupImageUrl, groupNumberOfPaperclips) {
    document.querySelector('.userGroups').insertAdjacentHTML('beforeend', `
        <div class="px-1">
          <div class="groups-${groupId} md:mt-16 mt-8 space-y-2 focus:ring-4">
            <div class="mx-0">
                <span class="font-bold text-xl">${groupName}</span>
            </div>
        
            <div class="border-2 border-transparent hover:border-black">
                <img src="${groupImageUrl}" class="w-full shadow-2xl ">
            </div>
        
          </div>
        </div>
      
    `)

   // Clicking on a rendered Group sends user to Review Content page
   document.querySelector(`.groups-${groupId}`).addEventListener('click', async function(event) {
    event.preventDefault()
    console.log(`You clicked ${groupId}`)
    document.location.href = `reviewcontent.html?groupId=${groupId}`
  })

}