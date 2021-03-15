let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  let newGroupId = body.newGroupId
  let userId = body.userId
  let groupName = body.groupName
  let firstName = body.firstName

  console.log(`groupname is ${groupname}`)
  console.log(`imageUrl is ${imageUrl}`)
  
  let newMapping = {
    newGroupId: newGroupId,
    userId: userId,
    groupName: groupName,
    firstName: firstName,
    created: firebase.firestore.FieldValue.serverTimestamp()
  }

  let docRef = await db.collection('user-group-mapping').add(newMapping)
  newMapping.id = docRef.id
 
  return {
    statusCode: 200,
    body: JSON.stringify(newMapping)
  }
}