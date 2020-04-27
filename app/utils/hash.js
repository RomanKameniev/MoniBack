const toHash = (s) => {
	let v = s.split('').reduce(function (a, b) {
		a = (a << 5) - a + b.charCodeAt(0)
		return a & a
	}, 0)
	console.log('v', v)
	return v
}

// toHash('Hello/there')

exports.toHash = toHash

/*Object.defineProperty(String.prototype, 'hashCode', {
	value: function () {
		var hash = 0,
			i,
			chr
		for (i = 0; i < this.length; i++) {
			chr = this.charCodeAt(i)
			hash = (hash << 5) - hash + chr
			hash |= 0 // Convert to 32bit integer
		}
		return hash
	},
})
*/
