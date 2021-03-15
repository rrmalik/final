let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  let destinationGroup = body.destinationGroup
  let url = body.url
  let title = body.title
  let author = body.author
  let time = body.time
  let commentary = body.commentary
  let userId = body.userId
  let userName = body.userName
  
  let newContent = {
    destinationGroup: destinationGroup,
    url: url,
    title: title,
    author: author,
    time: time,
    commentary: commentary,
    userId: userId,
    userName: userName,
    created: firebase.firestore.FieldValue.serverTimestamp()
  }

  let docRef = await db.collection('content').add(newContent)
  newContent.id = docRef.id
 

  return {
    statusCode: 200,
    body: JSON.stringify(newContent)
  }
}