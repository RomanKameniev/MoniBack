const MongoClient = require('mongodb').MongoClient
const mongo = require('mongodb')

const { url, dbName } = require('./config')

const uri = `mongodb://${url}` //:${port}`

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
				return
			}
			console.log('Connected successfully to server')
			res(data)
		})
	})
	db = con ? con.db(dbName) : null
	//	console.log('db', db)
}

exports.connect = connect
exports.mongo = mongo

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

	await api.insertOne(v, (error, result) => {
		if (error) {
			console.log('error while try to insertOne', error)
			return callback(error)
		} else {
			//		console.log('result', result)
			console.log('Inserted')
			callback(null, result)
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
//			console.log('result', result)
			console.log('Taked')
			callback(null, result)
		}
	})
}

exports.updateOneRecord = async (col, select, value, callback) => {
	let api

	try {
		api = db.collection(col)
	} catch (e) {
		console.log('error while try to get', e)
		callback('error while getting db')
		return
	}

	await api.updateOne(select, { $set: value }, (error, result) => {
		if (error) {
			console.log('error while try to updateOne', error)
			return callback(error)
		} else {
			//		console.log('result', result)
			console.log('Updated')
			callback(null, result)
		}
	})
}


exports.findManyRecords = async (col, select, value, callback) => {
	let api

	try {
		api = db.collection(col)
	} catch (e) {
		console.log('error while try to get', e)
		callback('error while getting db')
		return
	}
	let objQuery = {}
	objQuery[select] = { "$in": value }
	console.log('objQuery', objQuery)
	await api.find(objQuery, (error, result) => {
		if (error) {
			console.log('error while try to updateOne', error)
			return callback(error)
		} else {
			//		console.log('result', result)
			console.log('finded')
			callback(null, result)
		}
	})
}
