const getToken = (ctx) => {
	let token = ctx.headers['x-access-token'] || ctx.headers['authorization']
	if (token.startsWith('Bearer ')) {
		// Remove Bearer from string
		token = token.slice(7, token.length)
	}
	return token
}

exports.getToken = getToken
