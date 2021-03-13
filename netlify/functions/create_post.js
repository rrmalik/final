// /.netlify/functions/create_post
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  let userId = body.userId
  let username = body.username
  let imageUrl = body.imageUrl
  
  console.log(`user: ${userId}`)
  console.log(`imageUrl: ${imageUrl}`)

  let newPost = { 
    userId: userId,
    username: username, 
    imageUrl: imageUrl, 
    created: firebase.firestore.FieldValue.serverTimestamp()
  }

  let docRef = await db.collection('posts').add(newPost)
  newPost.id = docRef.id
  newPost.likes = 0

  return {
    statusCode: 200,
    body: JSON.stringify(newPost)
  }

}