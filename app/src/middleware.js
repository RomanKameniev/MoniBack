import jwt from 'jsonwebtoken'
import api from '../database/api'
import { sendMail } from '../utils/email'
const jwtsecret = 'mysecretkey'

const setTokenToDB = async ({ token, id }) => {
	await new Promise((res) => {
		api.updateOneRecord('users', { id }, { token }, (error, result) => {
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

let checkToken = async (ctx, next) => {
	let token = ctx.headers['x-access-token'] || ctx.headers['authorization'] // Express headers are auto converted to lowercase
	if (token.startsWith('Bearer ')) {
		// Remove Bearer from string
		token = token.slice(7, token.length)
	}

	if (token) {
		await jwt.verify(token, jwtsecret, (err, decoded) => {
			if (err) {
				ctx.body = {
					success: false,
					message: 'Token is not valid',
				}
			} else {
				ctx.decoded = decoded
			}
		})
		await next()

	} else {
		return (ctx.body = {
			success: false,
			message: 'Auth token is not supplied',
		})
	}
}

const checkVarify = async (ctx) => {
	const { verify } = ctx.request.query
	console.log('ctx', verify)
	var o_id = new api.mongo.ObjectID(verify)
	if (verify) {
		const user = await new Promise((res) =>
			api.findOneRecord('users', { _id: o_id }, (error, result) => {
				if (error) {
					console.warn('error => ', error)
					res(null)
				} else {
					console.log('res => ', result)
				}
				res(result || null)
			})
		)
		console.log('user', user)
		if (user) {
			if (user.active) {
				ctx.status = 405
				ctx.body = {
					success: false,
					message: 'User already verified',
				}
				return
			}
			const updated = await new Promise((res) =>
				api.updateOneRecord('users', { _id: o_id }, { active: true }, (error, result) => {
					if (error) {
						console.warn('error => ', error)
						res(null)
					} else {
						//	console.log('res => ', result)
					}
					res(result || null)
				})
			)
			if (updated) {
				ctx.status = 200
				ctx.body = {
					success: true,
					message: 'Varified successfully!',
				}
			} else {
				ctx.status = 400
				ctx.body = {
					success: false,
					message: 'Varified dismissed!',
				}
			}
		} else {
			ctx.status = 400
			ctx.body = {
				success: false,
				message: 'User not found!',
			}
		}
	}
}

exports.checkVarify = checkVarify
exports.checkToken = checkToken

class HandlerGenerator {
	async login(ctx) {
		// console.log('res', req, res)
		//console.log('ctx', ctx)
		ctx.body = ctx.request.body
		const email = ctx.body.email
		const password = ctx.body.password
		// For the given username fetch user from DB
		const mockedUsername = 'admin'
		const mockedPassword = 'password'

		if (email && password) {
			if (email === mockedUsername && password === mockedPassword) {
				const token = jwt.sign({ email }, jwtsecret, {
					expiresIn: '24h', // expires in 24 hours
				})
				ctx.status = 200
				// return the JWT token for the future API calls
				ctx.body = {
					success: true,
					message: 'Authentication successful!',
					text: 'welcome admin!',
					token: token,
				}
				return
			}
			let user = await new Promise((res) =>
				api.findOneRecord('users', { email }, (error, result) => {
					if (error) {
						console.warn('error => ', error)
						res(null)
					} else {
						console.log('res => ', result)
					}
					res(result || null)
				})
			)
			if (user) {
				if (password === user.password) {
					console.log('password match')
					const token = jwt.sign({ email }, jwtsecret, {
						expiresIn: '24h', // expires in 24 hours
					})
					delete user.password
					ctx.status = 200
					// return the JWT token for the future API calls
					ctx.body = {
						success: true,
						message: 'Authentication successful!',
						user,
						token: token,
					}
					setTokenToDB({ token, id: user.id })
				} else {
					ctx.status = 403
					// return the JWT token for the future API calls
					ctx.body = {
						success: false,
						message: 'Incorrect username or password',
					}
				}
			} else {
				ctx.status = 403
				ctx.body = {
					success: false,
					message: 'Incorrect username or password',
				}
			}
		} else {
			ctx.status = 400

			ctx.body = {
				success: false,
				message: 'Authentication failed! Please check the request',
			}
		}
	}

	async registration(ctx) {
		ctx.body = ctx.request.body
		const email = ctx.body.email
		const login = ctx.body.login
		const password = ctx.body.password

		if (email && login && password) {
			let user = await new Promise((res) =>
				api.findOneRecord('users', { email }, (error, result) => {
					if (error) {
						console.warn('error => ', error)
						res(null)
					} else {
						console.log('res => ', result)
					}
					res(result || null)
				})
			)
			if (!user) {
				const response = await new Promise((res) =>
					api.writeOneRecord('users', { email, login, password, active: false }, (error, result) => {
						if (error) {
							console.warn('error => ', error)
							res(null)
						} else {
							//	console.log('res => ', result)
						}
						res(result || null)
					})
				)
				if (response) {
					sendMail(email, response.ops[0]._id)
					ctx.status = 200
					ctx.body = {
						success: true,
						message: 'User register succesfully!',
					}
				} else {
					ctx.status = 423
					ctx.body = {
						success: false,
						message: 'internal error',
					}
				}
			} else {
				ctx.status = 403
				// return the JWT token for the future API calls
				ctx.body = {
					success: false,
					message: 'This username already taken',
				}
			}
		} else {
			ctx.status = 403
			// return the JWT token for the future API calls
			ctx.body = {
				success: false,
				message: 'Not all data provided',
			}
		}
	}

	index(ctx) {
		ctx.body = {
			success: true,
			message: 'Index page',
		}
	}
}

exports.HandlerGenerator = HandlerGenerator
