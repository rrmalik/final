let firebase = require('./firebase')

exports.handler = async function(event) {
// console.log('hello from the back-end')
// console.log(event)
// let queryStringUserId = event.queryStringParameter.userId
// console.log(queryStringUserId)

let contentAPI = []
let db = firebase.firestore()
let querySnapshot = await db.collection('content')
                            .where('destinationGroup', '==', groupId)
                            .orderBy('created','desc').get()
let content = querySnapshot.docs
console.log(content.length)
for (let i=0; i<content.length; i++) {
  let contentId = content[i].id
  let contentData = content[i].data()
  let contentTitle = contentData.title
  let contentAuthor = contentData.author
  let contentUserId = contentData.userId
  let contentUrl = contentData.url
  let contentCommentary = contentData.commentary
  let contentTime = contentData.time
  let contentDisplayName = contentData.userName
  contentAPI.push({
    contentId: contentId,
    contentTitle: contentTitle,
    contentAuthor: contentAuthor,
    contentUserId: contentUserId,
    contentUrl: contentUrl,
    contentCommentary: contentCommentary,
    contentTime: contentTime,
    contentDisplayName: contentDisplayName
  })
}

  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(contentAPI)
  }
}