const api = require('./api')
// Establish connection to the cluster

const tryConnect = async () => {
	await api.connect()
	await write()
	await find()
	await api.disconnect()
}

const write = async () => {
	return await new Promise((res, rej) => {
		// console.log('inPromise> ', key)
		api.writeOneRecord('users', {_id:15, value: 'hello with mongo' }, (error, result) => {
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

const find = async () => {
	return await new Promise((res, rej) => {
		// console.log('inPromise> ', key)
		api.findOneRecord('users', {}, (error, result) => {
			if (error) {
				console.warn('error => ', error)
				rej(error)
			} else {
				   console.log('res => ', result)
			}
			res(result || error)
		})
	})
}

tryConnect()
