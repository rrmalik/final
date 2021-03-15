let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  let groupname = body.groupname
  let imageUrl = body.imageUrl

  console.log(`groupname is ${groupname}`)
  console.log(`imageUrl is ${imageUrl}`)
  
  let newGroup = {
    groupname: groupname,
    imageUrl: imageUrl,
    created: firebase.firestore.FieldValue.serverTimestamp()
  }

  let docRef = await db.collection('groups').add(newGroup)
  newGroup.id = docRef.id
 

  return {
    statusCode: 200,
    body: JSON.stringify(newGroup)
  }
}