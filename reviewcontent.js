
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
  
  // Pull user and group information
    let userName = user.displayName
    let userId = user.uid
    splitUserName = userName.split(' ')
    firstName = splitUserName[0]
    let queryString = new URLSearchParams(document.location.search)
    let groupId = queryString.get('groupId')
    console.log(`group = ${groupId}`)
    console.log(`user = ${userId}`)

  // Grab group information
    let responseGroupInfo = await fetch(`/.netlify/functions/get_groups?groupid=${groupId}`)
    let groupSnapshot = await responseGroupInfo.json()
    let groupSnapshotData = groupSnapshot[0]
    let groupName = groupSnapshotData.groupName

  // Sign-out button new
    document.querySelector('.sign-out').innerHTML = `
      <button class="">sign out</button>
    `
    document.querySelector('.sign-out').addEventListener('click', function(event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'index.html'
    })

  // Grab current group-member mapping from API
  let response = await fetch(`/.netlify/functions/get_group_user_mapping?groupid=${groupId}`)
  let curatedBy = await response.json()
  
  // Populate curated by: 
    document.querySelector('.curatedBy').innerHTML = `
    <div class="pl-32 w-1/8 rounded-lg text-left font-dark font-normal text-small "><strong>curated by:</strong>${curatedBy.join().toLowerCase()}</div>
  `
  // Check if user is a member
  let responseUser = await fetch(`/.netlify/functions/get_user_group_mapping?userid=${userId}&groupid=${groupId}`)
  let querySnapshotUserDocs = await responseUser.json()  

    if (querySnapshotUserDocs.length > 0) {
      console.log("user is member of this group") 

  // Populate the "Add Content" button 
        document.querySelector('.add-content').innerHTML = `
        <button class="">add content</button>
        `
  // Hide the "Join Group" "button 
         document.querySelector('.join-group').classList.add('hidden')

      } else { // if user is NOT  member....
        console.log('user is not a member of this group')

      // hide add content button
        document.querySelector('.add-content').classList.add('hidden')

      // hide member flag
        document.querySelector('.member').classList.add('hidden')

      // display Join-Group button 
        document.querySelector('.join-group').innerHTML = `
        <button class="">join group</button>
      `
      // if join group button is clicked...
        document.querySelector('.join-group').addEventListener('click', async function(event) {
          console.log('join group clicked')

      // drop user information into user-group mapping table

            let newMappingResponse = await fetch('/.netlify/functions/create_user_group_map', {
              method: 'POST',
              body: JSON.stringify({
                newGroupId: groupId, 
                userId: userId, 
                groupName: groupName,
                firstName: firstName
              })
            })
        // hide join group button 
            document.querySelector('.join-group').classList.add('hidden')

        //bring back the add content button
            document.querySelector('.add-content').classList.remove('hidden')

        //bring back the member flag
            document.querySelector('.member').classList.remove('hidden')

        // REpopulate curated by: 
            curatedBy.push(` ${firstName}`)
            console.log(curatedBy.join().toLowerCase())
            document.querySelector('.curatedBy').innerHTML = `
            <div class="pl-32 w-1/8 rounded-lg text-left font-dark font-normal text-small "><strong>curated by:</strong>${curatedBy.join().toLowerCase()}</div>
          `
      })
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

    // Listen for the form submit within the modal and create/render the new content
    document.querySelector('form').addEventListener('submit', async function(event) {
      event.preventDefault()
      console.log('form-submitted')
      
      //grab data from form
      let destinationGroup = groupId
      let url = document.querySelector('#url').value
      let title = document.querySelector('#title').value
      let author = document.querySelector('#author').value
      let time = document.querySelector('#time').value
      let commentary = document.querySelector('#commentary').value

      //send data to firebase
      let docRef = await db.collection('content').add({ 
          destinationGroup: destinationGroup, 
          url: url,
          title: title,
          author: author,
          time: time, 
          commentary: commentary,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          userId: userId,
          userName: userName
      })
      let newContentItem = docRef.id // the newly created document's ID

      modal.style.display = "none";
      
      // clear form
      document.querySelector('#url').value = '' 
      document.querySelector('#title').value = ''
      document.querySelector('#author').value = '' 
      document.querySelector('#time').value = '' 
      document.querySelector('#commentary').value = ''     

    // Render all content when the page is loaded
    let querySnapshot = await db.collection('content').doc(newContentItem).get()
    console.log(newContentItem)
    let contentData = querySnapshot.data()
      let contentTitle = contentData.title
      let contentAuthor = contentData.author
      let contentUserId = contentData.userId
      let contentUrl = contentData.url
      let contentCommentary = contentData.commentary
      let contentTime = contentData.time
      let contentDisplayName = contentData.userName
      renderContent(contentUrl, contentTitle, contentAuthor, contentTime, contentUserId, contentDisplayName, contentCommentary)
    
    })
    
    // Group Name
    document.querySelector('.group-name').innerHTML = `
    <div class="text-6xl text-left pl-32 font-bold">${groupName}</div>
     `

    // Render all content when the page is loaded
    let responseContent = await fetch(`/.netlify/functions/get_content?groupid=${groupId}`)
    let content = await responseContent.json()  
    console.log(content)
    for (let i=0; i<content.length; i++) {
      let contentData = content[i]
      let contentId = contentData.contentId
      let contentTitle = contentData.contentTitle
      let contentAuthor = contentData.contentAuthor
      let contentUserId = contentData.contentUserId
      let contentUrl = contentData.contentUrl
      let contentCommentary = contentData.contentCommentary
      let contentTime = contentData.contentTime
      let contentDisplayName = contentData.contentDisplayName
      renderContent(contentUrl, contentTitle, contentAuthor, contentTime, contentUserId, contentDisplayName, contentCommentary)
    }

  } else {
    // Signed out
    console.log('signed out')

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

async function renderContent(contentUrl, contentTitle, contentAuthor, contentTime, contentUserId, contentDisplayName, contentCommentary) {
  document.querySelector('.content').insertAdjacentHTML('beforeend', `
  <div class="grid pl-32 gap-0 grid-cols-1 align-left">
    <h2 class="w-1/8 rounded-lg text-left font-dark font-normal text-xl underline"> <strong> <a href="${contentUrl}"> ${contentTitle}</a> </h2>
    <h2 class="w-1/8 rounded-lg text-left font-dark font-normal text-medium">✏️  ${contentAuthor} | ${contentTime} minutes | 📎 ${contentDisplayName} </h2>
    <h2 class="w-1/8 rounded-lg text-left text-gray-600 font-thin text-medium"> ${contentCommentary} </h2>
  </div> <br>
  `)
}