let firebase = require('./firebase')

exports.handler = async function(event) {
console.log('hello from the back-end')

let queryStringUserId = event.queryStringParameters.userid
console.log(queryStringUserId)

let userToGroupAPI = []

let db = firebase.firestore()

let querySnapshotUser = await db.collection('user-group-mapping')
                                .where('userId', '==', queryStringUserId)
                                .get()
let userGroups = querySnapshotUser.docs

//grab user's groupIds
for (let i=0; i<userGroups.length; i++) {
  let userGroupId = userGroups[i].id
  let userGroupData = userGroups[i].data()
  let userGroupIds = userGroupData.groupId
  userToGroupAPI.push({
    userGroupIds: userGroupIds
  })
}
  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(userToGroupAPI)
  }
}