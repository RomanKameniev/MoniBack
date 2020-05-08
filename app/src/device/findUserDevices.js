import api from '../../database/api'
import { getToken } from '../token'
import { getUser } from '../user'

const findUserDevices = async (ctx) => {
	// console.log('ctx in user', ctx)
	const token = getToken(ctx)

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
