// /.netlify/functions/get_groups
let firebase = require('./firebase')

exports.handler = async function(event) {
console.log('hello from the back-end')

let groupsData = []
  
  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(groupsData)
  }
}