// /.netlify/functions/create_group
let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  let newGroup = JSON.parse(event.body)

  newGroup.timestamp = firebase.firestore.FieldValue.serverTimestamp()

  let docRef = await db.collection('groups').add(newGroup)
  newGroup.id = docRef.id

  return {
    statusCode: 200,
    body: JSON.stringify(newGroup)
  }
}