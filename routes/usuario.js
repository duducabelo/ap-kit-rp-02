const express = require("express")
const mongoose = require ("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require('bcrypt')
/* importar o módulo do passaport */
const passport = require("passport")
const router = express.Router()

router.get('/registro', (req, res) => {
	
		res.render("usuario/registro")	
});

router.post('/registro', (req, res) => {
	let dados = req.body
	console.log(dados)
	var erros = []

	if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
		erros.push({senha: "senha é obrigatório"})		
	}

	if (req.body.senha.length < 4 ) {
		erros.push({senha: " A senha deve conter mais de 4 digitos"})		
	}

	if (req.body.senha != req.body.senha2) {
		erros.push({senha: "A senhas são diferentes, tente novamente!"})		
	}
	if (erros.length > 0) {
		console.log(erros)
		res.render("usuario/registro", {erros: erros})	
	}else {
		
		
		Usuario.findOne({email: req.body.email}).lean().then( function(usuario){
			if (usuario) {
				console.log(usuario)
				req.flash("error_msg","e-mail ja cadastrado!") /* "fash" tem que ser em seguida o redirect se nao da erro*/
				res.redirect("/usuario/registro") 
			} else{

				const novoUsuario = new Usuario({
					nome: req.body.nome,
					email: req.body.email,
					senha: req.body.senha

				})

				bcrypt.genSalt(10, function(err, salt) {
    				bcrypt.hash(novoUsuario.senha, salt, function(err, hash) {
        				if (err) {
        					req.flash("error_msg", "erro interno!")
        					res.redirect("/usuario/registro")
        				}

        				novoUsuario.senha = hash

        				novoUsuario.save().then(()=>{
        					req.flash("success_mgs", "Usuário cadratrado com sucesso")
        					res.redirect("/usuario/registro")
        				}).catch((err) => {
        					req.flash("error_msg", "erro ao criar Usuario! Tente novamente!")
        					res.redirect("/usuario/registro")
        				})

    				});
				});

			}
		}).catch((err) =>{
			req.flash("error_msg", "Erro interno")
			res.redirect("/usuario/registro")
		})
	}
});

router.get('/login', (req, res) =>{
	res.render("usuario/login")
});

router.post('/login', (req, res, next) =>{

	passport.authenticate('local', {
		successRedirect: "/" ,
		failureRedirect: "/usuario/login",
		failureFlash: true
	})(req, res, next)
		
		/*
		ducumentaçao
		app.post('/login', 
		passport.authenticate('local', { failureRedirect: '/login' }),
		function(req, res) {
		res.redirect('/');
		});*/
});

router.get('/logout', (req, res) =>{
	req.logout()
	res.redirect("/")
});


module.exports = router