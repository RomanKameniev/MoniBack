import api from '../database/api'
import { getToken } from './token'
import { getUser } from './user'

const getOrderById = async (orderId) => {
	return await new Promise((res) => {
		api.findOneRecord('orders', { orderId }, (error, result) => {
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

const getUserOrders = async (ctx) => {
	const token = getToken(ctx)
	if (!token) {
		ctx.status = 423
		ctx.body = {
			success: false,
			message: 'invalid token',
		}
		return
	}
	const user = await getUser(token)
	if (!user) {
		ctx.status = 400
		ctx.body = {
			success: false,
			message: 'user not found',
		}
		return
	}

	if (!user.orders) {
		ctx.status = 200
		ctx.body = {
			success: true,
			data: [],
		}
		return
	}

	const allOrders = await getAllUserOrders(user.orders)
	if (allOrders) {
		ctx.status = 200
		ctx.body = {
			success: true,
			data: allOrders,
		}
		return
	}

	ctx.status = 400
	ctx.body = { success: false, message: 'no data was found' }
}

const getAllUserOrders = async (orders) => {
	return await new Promise((res) => {
		api.findManyRecords('orders', 'order_id', orders, (error, result) => {
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

exports.getOrderById = getOrderById
exports.getUserOrders = getUserOrders