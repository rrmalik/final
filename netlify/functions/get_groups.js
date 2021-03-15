let firebase = require('./firebase')

exports.handler = async function(event) {
console.log('hello from the back-end')

let db = firebase.firestore()

if (event.queryStringParameters.groupid) { 

  console.log('has groupId')

  let groupsAPI = []
  let queryStringGroupId = event.queryStringParameters.groupid
  console.log(queryStringGroupId)
  let querySnapshot = await db.collection('groups')
                              .doc(queryStringGroupId)
                              .get()
  let groupData = querySnapshot.data()
  let groupName = groupData.groupname
  let groupImageUrl = groupData.imageUrl

  groupsAPI.push({
      groupName: groupName,
      groupImageUrl: groupImageUrl,
      groupId: queryStringGroupId
      })

  return {
    statusCode: 200,
    body: JSON.stringify(groupsAPI)
  }
} else { 

  console.log('no groupId')

  let groupsAPI = []
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
      groupImageUrl: groupImageUrl,
      groupId: groupId
  })
  }

    // return an Object in the format that a Netlify lambda function expects
    return {
      statusCode: 200,
      body: JSON.stringify(groupsAPI)
    }
}
}