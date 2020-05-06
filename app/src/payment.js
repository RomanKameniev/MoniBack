// import api from '../database/api'
// import { onPay } from '../utils/pay'
import { getToken } from './token'
import { getUser } from './user'

const menagePayment = async (ctx) => {
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

	ctx.body = ctx.response.body

	const cardId = ctx.body.cardId
	if (cardId) {
		//here get card from db
		ctx.status = 200
		ctx.body = {
			success: true,
			message: 'payment succesfully',
		}
		return
	}

	let phone = user.phone
    //TODO show error if no phone 
    if (!phone) phone = '+380990725338'
    
    // let 

	// const paymentStatus = await onPay(card)

	// console.log('paymentStatus', paymentStatus)
}

exports.menagePayment = menagePayment
