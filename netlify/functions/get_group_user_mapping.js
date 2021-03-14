let firebase = require('./firebase')

exports.handler = async function(event) {
console.log('hello from the back-end')

let queryStringGroupId = event.queryStringParameters.groupid
console.log(queryStringGroupId)

let curatedByAPI = []

let db = firebase.firestore()

let querySnapshotCuratedBy = await db.collection('user-group-mapping')
                                    .where('groupId', '==', queryStringGroupId)
                                    .get()
let curatedList = querySnapshotCuratedBy.docs
    for (let i=0; i<curatedList.length; i++) {
      let curatedId = curatedList[i].id
      let curatedlistData = curatedList[i].data()
      let curatedFirstName = curatedlistData.firstName
      curatedByAPI.push(` ${curatedFirstName}`)
    }

  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(curatedByAPI)
  }
}