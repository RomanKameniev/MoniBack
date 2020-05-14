// import api from '../database/api'
import { onPay } from '../utils/pay'
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

	ctx.body = ctx.request.body

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

const payForm = async (ctx) => {
	ctx.body = ctx.request.body


	console.log('card => ',ctx)

	const card = ctx.body.card
	const name = ctx.body.name
	const card_exp_year = ctx.body.card_exp_year
	const card_exp_month = ctx.body.card_exp_month
	const card_cvv = ctx.body.card_cvv
	const amount = 10

	let paymentStatus = await onPay({ card, name, card_exp_month, card_exp_year, card_cvv, amount })

	console.log('paymentStatus => ', paymentStatus)

	ctx.status = 200
	ctx.body = {
		success: true,
		message: 'payment successful',
	}
}



exports.payForm = payForm