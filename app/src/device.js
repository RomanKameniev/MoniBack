import api from '../database/api'

const setDevice = async (ctx) => {
	// console.log('ctx in user', ctx)
	let token = ctx.headers['x-access-token'] || ctx.headers['authorization']
	if (token.startsWith('Bearer ')) {
		// Remove Bearer from string
		token = token.slice(7, token.length)
	}
	if (!token) {
		ctx.status = 423
		ctx.body = {
			success: false,
			message: 'invalid token',
		}
	}
	console.log('ctx.body', ctx)
	ctx.body = ctx.request.body

	const name = ctx.body.name
	const type = ctx.body.type
	const deviceId = ctx.body.deviceId

	if (!deviceId || !name || !type) {
		ctx.status = 400
		ctx.body = {
			success: false,
			message: 'Not all data provided!',
		}
		return
	}

	const deviceFound = await getDevice(deviceId)

	if (deviceFound) {
		ctx.status = 432
		ctx.body = {
			success: false,
			message: 'Device was already added to the system!',
		}
		return
	}

	let user = await getUser(token)

	if (!user) {
		ctx.status = 423
		ctx.body = {
			success: false,
			message: 'user not found',
		}
		return
	}

	let deviceRes = await addDevice({ name, deviceId, type })

	if (!deviceRes) {
		ctx.status = 500
		console.log('error while trying to set device', deviceRes)
		ctx.body = {
			success: false,
			message: 'internal server error',
		}
		return
	}

	let devices = user.ownedDevices && user.ownedDevices.length ? [...user.ownedDevices] : []

	if (deviceRes) {
		if (devices.indexOf(deviceId) > 0) {
			ctx.status = 400
			ctx.body = {
				success: false,
				message: 'Device was already added!',
			}
			return
		}
		devices.push(deviceId)
		const addedToUser = await updateUserDevices({ token, devices })
		if (addedToUser) {
			ctx.status = 200
			ctx.body = {
				success: true,
				message: 'device added',
			}
		} else {
			console.log('error while adding to user devices')
			ctx.status = 400
			ctx.body = {
				success: false,
				message: 'error',
			}
		}
		return
	}
	ctx.status = 400
	ctx.body = {
		success: false,
		message: 'not available',
	}
}

const getUser = async (token) => {
	return await new Promise((res) => {
		api.findOneRecord('users', { token }, (error, result) => {
			if (error) {
				console.warn('error => ', error)
				res(null)
			} else {
				console.log('res => ', !!result)
			}
			res(result || null)
		})
	})
}

const getDevice = async (deviceId) => {
	return await new Promise((res) => {
		api.findOneRecord('devices', { deviceId }, (error, result) => {
			if (error) {
				console.warn('error => ', error)
				res(null)
			} else {
				console.log('res => ', !!result)
			}
			res(result || null)
		})
	})
}

const addDevice = async ({ name, type, deviceId }) => {
	return await new Promise((res) => {
		api.writeOneRecord('devices', { name, type, deviceId }, (error, result) => {
			if (error) {
				console.warn('error => ', error)
				res(null)
			} else {
				console.log('res => ', !!result)
			}
			res(result || null)
		})
	})
}

const updateUserDevices = async ({ token, devices: ownedDevices }) => {
	console.log('ownedDevices',  ownedDevices)
	return await new Promise((res) => {
		api.updateOneRecord('users', { token }, { ownedDevices }, (error, result) => {
			if (error) {
				console.warn('error => ', error)
				res(null)
			} else {
				console.log('res => ', !!result)
			}
			res(result || null)
		})
	})
}

// const getDevices = () => {

// }

// const getDevice = () => {

// }
// const updateDevice = () => {

// }

exports.updateUserDevices = updateUserDevices

exports.setDevice = setDevice
