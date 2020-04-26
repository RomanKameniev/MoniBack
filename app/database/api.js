const MongoClient = require('mongodb').MongoClient

const { url, port, dbName } = require('./config')

const uri = `mongodb://${url}:${port}`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

var db

const connect = async () => {
	console.log('- uri =>', uri)
	//console.log('client', client)
	const con = await new Promise((res) => {
		client.connect((err, data) => {
			if (err) {
				console.log('err', err)
				res(null)
			}
			console.log('Connected successfully to server')
			res(data)
		})
	})
	db = con.db(dbName)
	//	console.log('db', db)
}

exports.connect = connect

exports.disconnect = async () => {
	try {
        await client.close()
        console.log('disconnected')
	} catch (e) {
		console.log('error while trying to close connect', e)
	} finally {
		console.log('disconnect function')
	}
}

exports.writeOneRecord = async (col, v, callback) => {
	let api

	try {
		api = db.collection(col)
	} catch (e) {
		console.log('error while try to get', e)
		callback('error while getting db')
		return
	}

	await api.insertOne(v, (error /*, result*/) => {
		if (error) {
			console.log('error while try to insertOne', error)
			return callback(error)
		} else {
			//		console.log('result', result)
			console.log('Inserted')
			callback(null, 'ok')
		}
	})
}

exports.findOneRecord = async (col, v, callback) => {
	let api

	try {
		api = db.collection(col)
	} catch (e) {
		console.log('error while try to get', e)
		callback('error while getting db')
		return
	}

	await api.findOne(v, (error, result) => {
		if (error) {
			console.log('error while try to insertOne', error)
			return callback(error)
		} else {
			//		console.log('result', result)
			console.log('Data taked')
			callback(null, result)
		}
	})
}
/*
// Read a record
exports.readRecord = function (k, callback) {
	//console.log('k=>', k)
	client.get(key, function (error, record) {
		// Check for errors
		// console.log('records= >', record)
		if (error) {
			// An error occurred
			return callback(error)
		} else {
			return callback(null, record.bins)
		}
	})
}

exports.removeRecord = function (k, callback) {
	//console.log('k=>', k)
	let key = new Aerospike.Key(aerospikeDBParams.defaultNamespace, aerospikeDBParams.defaultSet, k)
	client.remove(key, function (error, record) {
		// Check for errors
		if (error) {
			// An error occurred
			return callback(error)
		} else {
			//let bins = record.bins
			return callback(null, record)
		}
	})
}
*/
