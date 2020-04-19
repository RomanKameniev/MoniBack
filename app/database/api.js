const Aerospike = require('aerospike')
const { aerospikeConfig, aerospikeDBParams } = require('./aerospike_config')

const client = Aerospike.client(aerospikeConfig)
// Establish connection to the cluster
exports.connect = function (callback) {
	client.connect(callback)
}
exports.disconnect = (callback) => {
	client.disconnect(callback)
}
// Write a record
exports.writeRecord = async (k, v, callback) => {
	//console.log('write', k, v)
	let key = new Aerospike.Key(aerospikeDBParams.defaultNamespace, aerospikeDBParams.defaultSet, k)
	await client.put(key, v, async (error) => {
		// Check for errors
		if (error) {
			// An error occurred
			return await callback(error)
		} else {
			return await callback(null, 'ok')
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
