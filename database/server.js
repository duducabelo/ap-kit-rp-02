/* importar o módulo do framework express */
const express = require("express");
/* importar o módulo do body-parser */
const bodyParser = require("body-parser");
/* importar o módulo do handlebars */
const handlebars = require("express-handlebars");
/* importar o módulo path do node*/
const path = require("path")
/* importar o módulo routes */
const index = require("../routes/index");

/* iniciar o express */
const server = express();

server
	/* 'view engine' e 'views' do express-handlebars */
	.engine('handlebars', handlebars({defaultLayout: 'main'}))
	.set('view engine', 'handlebars')

	 /* utilizar req do body */
	.use(express.urlencoded({extended: true}))
	.use(bodyParser.json())

	/* configurar o middleware express.static */
	.use(express.static(path.join(__dirname,"public")))
	
	/*routes aqui eu posso por um prefiquiso "/home" eu teria que colocar /home para ir a page index*/
	.use('/', index)
	


module.exports = server;