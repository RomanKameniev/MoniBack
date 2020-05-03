import api from '../database/api'
import { getToken } from './token'

const getUserInfo = async (ctx) => {
	// console.log('ctx in user', ctx)
	const token = getToken(ctx)
	if (!token) {
		ctx.status = 423
		ctx.body = {
			success: false,
			message: 'invalid token',
		}
	}
	let res = await getUser(token)
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

const getUserById = async (id) => {
	const _id = new api.mongo.ObjectID(id)

	return await new Promise((res) => {
		api.findOneRecord('users', { _id }, (error, result) => {
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

const getUserByEmail = async (email) => {
	return await new Promise((res) => {
		api.findOneRecord('users', { email }, (error, result) => {
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

const updateUserWithContact = async ({ token, contacts }) => {
	return await new Promise((res) => {
		api.updateOneRecord('users', { token }, { contacts }, (error, result) => {
			if (error) {
				console.warn('error => ', error)
				res(null)
			} else {
				console.log('res added user => ', !!result)
			}
			res(result || null)
		})
	})
}

exports.getUserInfo = getUserInfo

const addUserToContacts = async (ctx) => {
	const token = getToken(ctx)
	if (!token) {
		ctx.status = 423
		ctx.body = {
			success: false,
			message: 'invalid token',
		}
		return
	}
	ctx.body = ctx.request.body
	const email = ctx.body.email
	const userId = ctx.body.userId

	const user = await getUser(token)
	if (!user) {
		ctx.status = 400
		ctx.body = {
			success: false,
			message: 'user not found',
		}
		return
	}
	if (email === user.email || userId === user._id.toString()) {
		ctx.status = 400
		ctx.body = {
			success: false,
			message: 'You can not add you to your contacts!',
		}
		return
	}

	if (email) {
		return await addUserByEmailMain({ email, user, token, ctx })
	}
	if (userId) {
		return await addUserByIdMain({ userId, user, token, ctx })
	}
	if (!email && !userId) {
		ctx.status = 400
		ctx.body = {
			success: false,
			message: 'You should provide Id or email for add user to your contacts!',
		}
		return
	}
	ctx.status = 400
	ctx.body = {
		success: false,
		message: 'unprocessed error',
	}
	return
}

const addUserByEmailMain = async ({ email, user, token, ctx }) => {
	const gettedByEmail = await getUserByEmail(email)
	if (gettedByEmail) {
		let contacts = user && user.contacts && user.contacts.length ? [...user.contacts] : []
		contacts = contacts.map((i) => i.toString())

		if (contacts.indexOf(gettedByEmail._id.toString()) >= 0) {
			ctx.status = 400
			ctx.body = {
				success: false,
				message: 'User Already in your contacts!',
			}
			return
		}
		contacts.push(gettedByEmail._id)
		const updatedUserContacts = await updateUserWithContact({ token, contacts })
		if (updatedUserContacts) {
			ctx.status = 200
			ctx.body = {
				success: true,
				message: 'User added to your contacts!',
			}
			return
		}
	} else {
		ctx.status = 404
		ctx.body = {
			success: false,
			message: 'user not found',
		}
		return
	}
}
const addUserByIdMain = async ({ userId, user, token, ctx }) => {
	const gettedById = await getUserById(userId)
	if (gettedById) {
		let contacts = user.contacts && user.contacts.length ? [...user.contacts] : []
		contacts = contacts.map((i) => i.toString())
		if (contacts.indexOf(gettedById._id.toString()) >= 0) {
			ctx.status = 400
			ctx.body = {
				success: false,
				message: 'User Already in your contacts!',
			}
			return
		}
		contacts.push(gettedById._id)
		const updatedUserContacts = await updateUserWithContact({ token, contacts })

		if (updatedUserContacts) {
			ctx.status = 200
			ctx.body = {
				success: true,
				message: 'User added to your contacts!',
			}
			return
		}
	} else {
		ctx.status = 404
		ctx.body = {
			success: false,
			message: 'user not found',
		}
		return
	}
}

exports.addUserToContacts = addUserToContacts
