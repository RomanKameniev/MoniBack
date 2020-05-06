import LiqPay from 'liqpay'

const public_key = 'sandbox_i2458727848'
const private_key = 'sandbox_SvjtBXzpFxVLRSF5I6cuDKNo4X46kt2KvjkXGhQ1'

var liqpay = new LiqPay(public_key, private_key)



const onPay = ({ phone, card_exp_month, card_exp_year, card_cvv, card, order_id,amount }) => {
	liqpay.api(
		'request',
		{
			action: 'pay',
			version: '3',
			phone,
			amount,
			currency: 'USD',
			description: 'description text',
			order_id,
			card,
			card_exp_month,
			card_exp_year,
			card_cvv,
		},
		function (json) {
			console.log(json.status)
		}
	)
}



exports.onPay =onPay
