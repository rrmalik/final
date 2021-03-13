// /.netlify/functions/get_posts
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()                             // define a variable so we can use Firestore
  let postsData = []                                        // an empty Array
  
  let postsQuery = await db.collection('posts')             // posts from Firestore
                           .orderBy('created')              // ordered by created
                           .get()
  let posts = postsQuery.docs                               // the post documents themselves
  
  // loop through the post documents
  for (let i=0; i<posts.length; i++) {
    let postId = posts[i].id                                // the ID for the given post
    let postData = posts[i].data()                          // the rest of the post data
    let likesQuery = await db.collection('likes')           // likes from Firestore
                             .where('postId', '==', postId) // for the given postId
                             .get()
    let commentsQuery = await db.collection('comments')     // likes from Firestore
                             .where('postId', '==', postId) // for the given postId
                             .get()
    let commentsData = []                                   // an empty Array
    let comments = commentsQuery.docs                       // the comments documents

    // loop through the comment documents
    for (let i=0; i<comments.length; i++) {
      let comment = comments[i].data()                      // grab the comment data
      commentsData.push({
        username: comment.username,                         // the author of the comment
        text: comment.text                                  // the comment text
      })
    }

    // add a new Object of our own creation to the postsData Array
    postsData.push({
      id: postId,                                           // the post ID
      imageUrl: postData.imageUrl,                          // the image URL
      username: postData.username,                          // the username
      likes: likesQuery.size,                               // number of likes
      comments: commentsData                                // an Array of comments
    })
  }
  
  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(postsData)
  }
}