//! added es6+ syntax verification

import Koa from 'koa'
import Router from 'koa-router' //router
import loggerL from 'koa-logger' //perfect logger
import bodyParser from 'koa-bodyparser' // парсер для POST запросов
import serve from 'koa-static'
import cors from '@koa/cors'
// модуль, который отдает статические файлы типа index.html из заданной директории
//import passport from 'koa-passport' //реализация passport для Koa
import { HandlerGenerator, checkToken, checkVarify } from './middleware'
import { userQueryHandler } from './user'
import { connect } from '../database/api'
//import crypto from 'crypto'

const app = new Koa()
var router = new Router()

let handlers = new HandlerGenerator()
let user = new userQueryHandler()

//app.use(logger('combined'))

//app.use(passport.initialize()) // сначала passport
app.use(serve('public'))
app.use(loggerL())
app.use(cors())

app.use(
	bodyParser({
		detectJSON: function (ctx) {
			return /\.json$/i.test(ctx.path)
		},
	})
)
router.get('/', checkVarify)
router.get('/', checkToken, handlers.index)
router.get('/user', checkToken, user.getUserInfo)

router.post('/login', handlers.login)
router.post('/registration', handlers.registration)

connect()
app.use(router.routes()).use(router.allowedMethods())

app.listen(8080)
