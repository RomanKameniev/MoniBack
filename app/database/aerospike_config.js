var aerospikeClusterIP = '127.0.0.1'
var aerospikeClusterPort = 3010
exports.aerospikeConfig = function () {
	return {
		hosts: [{ addr: aerospikeClusterIP, port: aerospikeClusterPort }],
	}
}
exports.aerospikeDBParams = {
	defaultNamespace: 'moni',
	defaultSet: 'moni',
}
