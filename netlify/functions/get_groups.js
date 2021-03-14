let firebase = require('./firebase')

exports.handler = async function(event) {
console.log('hello from the back-end')
console.log(event)
// let queryStringUserId = event.queryStringParameter.userId
// console.log(queryStringUserId)

let groupsAPI = []
let db = firebase.firestore()
let querySnapshot = await db.collection('groups')
                            .orderBy('created')
                            .get()
    let groups = querySnapshot.docs
    for (let i=0; i<groups.length; i++) {
      let groupId = groups[i].id
      let groupData = groups[i].data()
      let groupName = groupData.groupname
      let groupImageUrl = groupData.imageUrl
      groupsAPI.push({
        groupName: groupName,
        groupImageUrl: groupImageUrl
      })
    }

  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(groupsAPI)
  }
}