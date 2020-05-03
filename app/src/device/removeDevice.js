import api from '../../database/api'
import { getToken } from '../token'
import { updateUserDevices } from '../device'

const removeDevice = async (ctx) => {
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
    ctx.body = ctx.request.body
	const deviceId = ctx.body.deviceId

	if (user.ownedDevices && user.ownedDevices.length) {
		if (user.ownedDevices.indexOf(deviceId) >= 0) {
			const removedDevice = await removeByDeviceId(deviceId)
			if (removedDevice) {
				let devices = [...user.ownedDevices]
				console.log('devices before', devices)
				const index = devices.indexOf(deviceId)
				devices.splice(index, 1)
				console.log('devices after', devices)
				const updateDevices = await updateUserDevices({ token, devices })
				if (updateDevices) {
					ctx.status = 200
					ctx.body = {
						success: true,
						message: 'Device removed!',
					}
					return
				}
			} else {
				ctx.status = 400
				ctx.body = {
					success: false,
					message: 'Device not found',
				}
				return
			}
		}
	}

	ctx.status = 400
	ctx.body = {
		success: false,
		message: 'Device not found',
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

const removeByDeviceId = async (deviceId) => {
	return await new Promise((res) => {
		api.removeOneRecord('devices', { deviceId }, (error, result) => {
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

exports.removeDevice = removeDevice
