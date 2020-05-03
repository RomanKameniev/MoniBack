import api from '../../database/api'

const findUserDevices = async (ctx) => {
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
	const user = await getUser(token)

	if (!user) {
		ctx.status = 423
		ctx.body = {
			success: false,
			message: 'user not found',
		}
		return
	}
	if (user.ownedDevices && user.ownedDevices.length) {
		const devices = await getAllUserDevices(user.ownedDevices)
		if (!devices) {
			ctx.body = {
				success: false,
				message: 'no devices found for this user',
			}
			return
		} else {

            console.log('devices', devices)
			ctx.status = 200
			ctx.body = {
				success: true,
				data: devices,
			}
			return
		}
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

const getAllUserDevices = async (devices) => {
	return await new Promise((res) => {
		api.findManyRecords('devices', 'deviceId', devices, (error, result) => {
			if (error) {
				console.warn('error => ', error)
				res(null)
			} else {
				console.log('res => ', !!result)
			}
			res(result.toArray() || null)
		})
	})
}

exports.findUserDevices = findUserDevices
