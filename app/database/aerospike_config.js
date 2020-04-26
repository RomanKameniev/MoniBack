exports.aerospikeClusterIP = '0.0.0.0'
exports.aerospikeClusterPort = 4080
// exports.aerospikeConfig = {
// 	hosts: [{ addr: aerospikeClusterIP, port: aerospikeClusterPort }],
// 	log: {
// 		level: aerospike.log.INFO,
// 		file: '/var/log/myapplication.log',
// 	},
// }
exports.aerospikeDBParams = {
	defaultNamespace: 'test',
	defaultSet: 'test',
}
