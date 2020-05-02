import api from '../database/api'

class userQueryHandler {
	async getUserInfo(ctx) {
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
		console.log('get user', token)
		let res = await new Promise((res) => {
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
		console.log('res', res)
		if (res) {
			delete res.token
			delete res.password
			ctx.status = 200
			ctx.body = {
				success: true,
				data: res,
			}
		} else {
			ctx.status = 400
			ctx.body = {
				success: false,
				message: 'user not found',
			}
		}
		return
	}
}

exports.userQueryHandler = userQueryHandler
