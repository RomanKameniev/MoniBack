//! added es6+ syntax verification

import Koa from 'koa'
import Router from 'koa-router' //router
import loggerL from 'koa-logger' //perfect logger
import bodyParser from 'koa-bodyparser' // парсер для POST запросов
import serve from 'koa-static'
import cors from '@koa/cors'
import { HandlerGenerator, checkToken, checkVarify } from './middleware'
import { getUserInfo, addUserToContacts, getUserContacts } from './user'
import { setDevice } from './device'
import { findUserDevices } from './device/findUserDevices'
import { removeDevice } from './device/removeDevice'
import { connect } from '../database/api'
import { addUserToDevice } from './device/addUserToDevice'
//import crypto from 'crypto'

const app = new Koa()
var router = new Router()

let handlers = new HandlerGenerator()

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

router.get('/user', checkToken, getUserInfo)
router.post('/user', checkToken, addUserToContacts)
router.get('/contacts', checkToken, getUserContacts)

router.post('/login', handlers.login)
router.post('/registration', handlers.registration)

router.post('/device', checkToken, setDevice)
router.get('/devices', checkToken, findUserDevices)
router.delete('/device', checkToken, removeDevice)

router.post('/add-user-to-device', checkToken, addUserToDevice)

connect()
app.use(router.routes()).use(router.allowedMethods())

app.listen(80)
