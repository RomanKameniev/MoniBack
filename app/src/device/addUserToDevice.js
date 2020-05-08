// import api from '../../database/api'
import { getToken } from '../token'
// import { updateUserDevices } from '../device'
import { getUser } from '../user'
import { getUserById } from '../user'

const addUserToDevice = async (ctx) => {
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
	const userId = ctx.body.userId
	console.log('user', user)

	const gettedUserById = await getUserById(userId)
	if (getUserById) {
		console.log('getted user = >', gettedUserById)
	}

	ctx.status = 400
	ctx.body = {
		success: false,
		message: 'Device not found',
	}
}

// const addUserById = async (userId) => {
// 	return await new Promise((res) => {
// 		api.removeOneRecord('devices', { deviceId }, (error, result) => {
// 			if (error) {
// 				console.warn('error => ', error)
// 				res(null)
// 			} else {
// 				console.log('res => ', !!result)
// 			}
// 			res(result || null)
// 		})
// 	})
// }

exports.addUserToDevice = addUserToDevice
