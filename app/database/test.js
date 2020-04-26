const api = require('./api')
// Establish connection to the cluster
api.connect((error) => {
	if (error) {
		// handle failure
		let dbStatusCode = error.code
		console.log('Connection to Aerospike cluster failed!', dbStatusCode)
	} else {
		// handle success
		console.log('Connection to Aerospike cluster succeeded!')
		write(1)
	}
})

const write = async (key) => {
	return await new Promise((res, rej) => {
		// console.log('inPromise> ', key)
		api.writeRecord(key, { value: 'hello with aerospike' }, (error, result) => {
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
