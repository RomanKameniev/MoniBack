const MongoClient = require('mongodb').MongoClient;
const {url, port} = require('./config')
const client = new MongoClient(`${url}:${port}`, {useNewUrlParser: true});



exports.writeRecord = async (k, v, callback) => {
	console.log('write', k, v)
	await client.put(key, v, (error) => {
		// Check for errors
		if (error) {
			console.log('error', error)
			// An error occurred
			return callback(error)
		} else {
			return callback(null, 'ok')
		}
	})
}
// Read a record
exports.readRecord = function (k, callback) {
	//console.log('k=>', k)
	let key = new Aerospike.Key(aerospikeDBParams.defaultNamespace, aerospikeDBParams.defaultSet, k)
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
