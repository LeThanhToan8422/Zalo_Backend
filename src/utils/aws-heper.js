require('dotenv').config()
const AWS = require('aws-sdk')

AWS.config.update({
    region : process.env.REGION,
    accessKeyId : process.env.ACCESS_KEY_ID,
    secretAccessKey : process.env.SECRET_ACCESS_KEY
})

const s3 = new AWS.S3()

const dynamodb = new AWS.DynamoDB.DocumentClient()

module.exports = {s3, dynamodb}