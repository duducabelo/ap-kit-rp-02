/* importar o módulo do framework express */
const express = require("express")
/* importar o módulo do body-parser */
const bodyParser = require("body-parser")
/* importar o módulo do handlebars */
const handlebars = require("express-handlebars")
/* importar o módulo path do node*/
const path = require("path")
/* importar o módulo express-session*/
const session = require("express-session")
/* importar o módulo do passaport */
const passport = require("passport")
/* importar o módulo do passaport local */
require("../config/auth.js")(passport)
/* importar o módulo connect-flash*/
const flash = require("connect-flash")
/* importar o módulo routes */
const admin = require("../routes/admin")
const index = require("../routes/index")
const usuario = require("../routes/usuario")

/* iniciar o express */
const server = express();

server
		/* todos sao middleware*/
	/* configurar o middleware express.session de acordo com documentaçao*/
	.use(session({
	  secret: 'teste',
	  resave: true,
	  saveUninitialized: true,
	  //cookie: { secure: true }
	}))
	/* configurar o middleware passaport local de acordo com documentaçao ele tem que ficar entre express-session e o connect-flash */
	.use(passport.initialize())
	.use(passport.session())

	/* configurar o middlewares connect-flash senpre a baixo do express.session como dis a documentaçao*/
	.use(flash())
	/* middleware para o flash de sessao, " variaveis globais " que posso asessar de qualquer part  da minha aplicaçao*/
	.use((req, res, next) =>{
		res.locals.success_mgs = req.flash("success_mgs")
		res.locals.error_msg = req.flash("error_msg")
		res.locals.error = req.flash("error") /* este erro vem da rota ../config/auth.js */
		res.locals.user = req.user || null ; /* req.user e uma funçao do passport que se refere a usuario logado */
		next()
	})

	/* 'view engine' e 'views' do express-handlebars */
	.engine('handlebars', handlebars({defaultLayout: 'main'}))
	.set('view engine', 'handlebars')

	 /* utilizar req do body */
	.use(express.urlencoded({extended: true}))
	.use(bodyParser.json())

	/* configurar o middleware express.static */
	.use(express.static('public'))
	
	/*rotas*/
	
	/*routes aqui eu posso por um prefiquiso "/admin" eu teria que colocar /admin para ir a page index*/
	.use('/admin', admin)
	.use('/usuario', usuario)
	.use('/', index)
	
	


module.exports = server;