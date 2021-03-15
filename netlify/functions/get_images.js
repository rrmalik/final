let firebase = require('./firebase')

exports.handler = async function(event) {
console.log('hello from the back-end')
console.log(event)
// let queryStringUserId = event.queryStringParameter.userId
// console.log(queryStringUserId)


// Random integer function
function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

let imagesAPI = []
let db = firebase.firestore()
let imageSnapshot = await db.collection('images').get()
let images = imageSnapshot.docs
let imageData = images[getRandomInt(0,images.length)].data()
let imageImageUrl = imageData.imageURL

imagesAPI.push({
    imageImageUrl: imageImageUrl
})

  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(imagesAPI)
  }
}