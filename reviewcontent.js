
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
    
    let groupId = 'VQfOJRhzZYYzUdUsxZUv'
    console.log(`group = ${groupId}`)
    console.log(`user = ${userId}`)

    // Sign-out button new
    document.querySelector('.sign-out').innerHTML = `
      <button class="">sign out</button>
    `
    document.querySelector('.sign-out').addEventListener('click', function(event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'index.html'
    })

    //check if user is a member
    let querySnapshotUser = await db.collection('user-group-mapping').where('userId', '==', userId).get()
    let querySnapshotUserDocs = querySnapshotUser.docs
    
    if (querySnapshotUserDocs.length > 0) {
      console.log("user is member of this group") 

        // add-Content button 
        document.querySelector('.add-content').innerHTML = `
        <button class="">add content</button>
        `
        // hide join group button 
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
        document.querySelector('.join-group').addEventListener('click', function(event) {
          console.log('join group clicked')

        // drop user information into user-group mapping table
            let docRefMapping = db.collection('user-group-mapping').add({ 
                groupId: 'VQfOJRhzZYYzUdUsxZUv', 
                userId: userId, 
                groupName: 'faMMM',
                created: firebase.firestore.FieldValue.serverTimestamp()
            })
        
        // hide join group button 
            document.querySelector('.join-group').classList.add('hidden')

        //bring back the add content button
            document.querySelector('.add-content').classList.remove('hidden')

        //bring back the member flag
            document.querySelector('.member').classList.remove('hidden')
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
    
    // Render all content when the page is loaded
    let querySnapshot = await db.collection('content').orderBy('created').get()
    let content = querySnapshot.docs
    for (let i=0; i<content.length; i++) {
      let contentId = content[i].id
      let contentData = content[i].data()
      let contentTitle = contentData.title
      let contentAuthor = contentData.author
      let contentUserId = contentData.userId
      let contentUrl = contentData.url
      let contentCommentary = contentData.commentary
      let contentTime = contentData.time
      let contentDisplayName = contentData.userName
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
  <div class="grid gap-0 grid-cols-1 align-left pl-32">
    <h2 class="w-1/8 rounded-lg text-left font-dark font-normal text-xl underline"> <strong> <a href="${contentUrl}"> ${contentTitle}</a> </h2>
    <h2 class="w-1/8 rounded-lg text-left font-dark font-normal text-medium">✏️  | ${contentAuthor} | ${contentTime} minutes | ${contentDisplayName} 📎 </h2>
    <h2 class="w-1/8 rounded-lg text-left text-gray-600 font-thin text-medium"> ${contentCommentary} </h2>
  </div> <br>
  `)
}