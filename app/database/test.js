const api = require('./api')
const assert = require('assert')
// Establish connection to the cluster
api.connect(function (err) {
	assert.equal(null, err)
	console.log('Connected successfully to server')

	const db = api.db('Moni')
    console.log('db', db)
    write()
	api.close()
})

const write = async () => {
	return await new Promise((res, rej) => {
		// console.log('inPromise> ', key)
		api.writeRecord({ value: 'hello with aerospike' }, (error, result) => {
			if (error) {
				console.warn('error => ', error)
				rej(error)
			} else {
				//    console.log('res => ', result)
			}
			res(result || error)
		})
	})
}
