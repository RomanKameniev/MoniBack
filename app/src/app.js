//! added es6+ syntax verification

import Koa from 'koa'
import Router from 'koa-router' //router
import loggerL from 'koa-logger' //perfect logger
import bodyParser from 'koa-bodyparser' // парсер для POST запросов
import serve from 'koa-static' // модуль, который отдает статические файлы типа index.html из заданной директории
import passport from 'koa-passport' //реализация passport для Koa



// import LocalStrategy from 'passport-local' //локальная стратегия авторизации
// import { Strategy, ExtractJwt } from 'passport-jwt' // авторизация через JWT
// import socketioJwt from 'socketio-jwt'
// import socketIO from 'socket.io'
// import crypto from 'crypto'

const app = new Koa()
var router = new Router()

//app.use(logger('combined'))

app.use(passport.initialize()) // сначала passport
app.use(serve('public'))
app.use(loggerL())
app.use(bodyParser())


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


app.use(router.routes()).use(router.allowedMethods())

app.listen(80)
