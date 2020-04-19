import Koa from 'koa'

import Router from 'koa-router'
import loggerL from 'koa-logger'
//import logger from 'koa-morgan'
const app = new Koa()
var router = new Router()

//app.use(logger('combined'))
app.use(loggerL())

router.get('/', (ctx) => {
	ctx.body = 'I am root!'
})

router.get('/second_route', (ctx) => {
	ctx.body = 'I am second_route'
})

router.post('/something', (ctx) => {
	ctx.body = {
		something: 'something here',
	}
})

app.use(async function pageNotFound(ctx) {
	// we need to explicitly set 404 here
	// so that koa doesn't assign 200 on body=
	ctx.status = 404

	switch (ctx.accepts('html', 'json')) {
		case 'html':
			ctx.type = 'html'
			ctx.body = '<p>Page Not Found</p>'
			break
		case 'json':
			ctx.body = {
				message: 'Page Not Found',
			}
			break
		default:
			ctx.type = 'text'
			ctx.body = 'Page Not Found'
	}
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3001)
