
const MongoClient = require('mongodb').MongoClient

const { url, port, dbName } = require('./config')

const uri = `${url}:${port}`


const client = new MongoClient(uri, { useNewUrlParser: true })



const connect = async () => {
    console.log('uri', uri)
    console.log('client', client)
	await client.connect((err, db) => {
//		assert.equal(null, err)
		console.log('Connected successfully to server', db)
	})
}

connect()