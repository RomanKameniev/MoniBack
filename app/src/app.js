import Koa from 'koa'

//import route from 'koa-route'
import Router from 'koa-router'

//import websockify from 'koa-websocket'
import logger from 'koa-logger'
const app = new Koa()
//const app = websockify(new Koa())
var router = new Router()
app.use(logger())

router.get('/', (ctx, next) => {
	console.log('ctx => ', ctx)
	return next()
})

app.use(router.routes()).use(router.allowedMethods())
// Regular middleware
// Note it's app.ws.use and not app.use

// Note it's app.ws.use and not app.use

app.listen(3001)
