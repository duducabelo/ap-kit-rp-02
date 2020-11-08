const express = require('express')
const mongoose = require ("mongoose")
require("../models/Lista")
const Lista = mongoose.model("listas")
require("../models/Postagem")
const Postagem = mongoose.model("postegens")
const {admin} = require("../helpers/admin")
const router = express.Router()

router.get('/eduardo', admin, (req, res) => {
	Lista.find().sort({date:'desc'}).lean().then( function(listas){
		res.render("admin/admin", {listas: listas})
	}).catch((err) =>{
		console.log("aaaa"+err)
	})
});

router.get('/sobre', admin, (req, res) => {
	
		res.render("admin/sobre")	
});

router.get('/criar-lista', admin, (req, res) => {
		
		res.render("admin/criar-lista")
});

router.post('/criar-lista', admin, (req, res) => {
    //neste caso eu estou usando required no input da view entrao a validacao nao vai aparecer
	// validaçao manual
	let dados = req.body
	var erros = []

	//console.log(datos)

	if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
		erros.push({texto: "Nome: é obrigatório"})		
	}

	if (!req.body.sobrenome || typeof req.body.sobrenome == undefined || req.body.sobrenome == null) {
		erros.push({texto: "Sobre nome: é obrigatório"})		
	}	

	if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
		erros.push({texto: "Email: é obrigatório"})		
	}
	// exemplo de uma condiçao no campo "length percore o array"
	// if (req.body.nome.length < 3) {
	// 	erros.push({texto: "Nome: muito pequeno tem que ser maior que 2"})		
	// }
	//pegando os erros para guspir na view
	if (erros.length > 0) {
		res.render("admin/criar-lista", {erros: erros, dados: dados})
	}else {
		const novaLista = {
		nome: req.body.nome,
		sobrenome: req.body.sobrenome,
		email: req.body.email
		}

		new Lista(novaLista).save().then(()=>{
			// msg 
			req.flash("success_mgs", "Lista foi salva com sucesso!")

			res.redirect("/admin/criar-lista")
			console.log("lista salva com sucesso!")
		}).catch((err) =>{
			// msg
			req.flash("error_msg", "Erro ao salvar Lista")
			console.log("erro ao salvar lista"+err)
		})
	}	
});

router.get('/listar', admin, (req, res) => {
	Lista.find().sort({date:'desc'}).lean().then( function(listas){
		res.render("admin/listar", {listas: listas})
	}).catch((err) =>{
		console.log("aaaa"+err)
	})
	
});

router.get('/editar-lista/:id', admin, (req, res) => {
	Lista.findOne({_id: req.params.id}).lean().then( function(listas){
		res.render("admin/editar-lista",{listas: listas})		
	}).catch((err)=>{
		req.flash("error_msg","Esta iten não existe na Lista!")
		res.redirect('/admin/listar')
	})	
});

router.post('/lista-editada', admin, (req, res)=>{

	Lista.findOne({_id: req.body.id}).then( function(listas){

		listas.nome = req.body.nome
		listas.sobrenome = req.body.sobrenome
		listas.email = req.body.email

		listas.save().then(()=>{

		req.flash("success_mgs", "Lista editada com sucesso!")
		res.redirect('/admin/listar')

		}).catch((err)=>{

		req.flash("error_msg","Erro interno na Hora de salvar a ediçao!")
		res.redirect('/admin/listar')	

		}).catch((err)=>{

		req.flash("error_msg","Esta iten não existe na Lista!")
		res.redirect('/admin/listar')
		})	
	})
});

router.post("/deletar-lista", admin, (req, res)=>{
	Lista.deleteOne({_id: req.body.id}).then(() => {
		req.flash("success_mgs", "Lista deletada com sucesso!")
		res.redirect('/admin/listar')
	}).catch((err)=>{
		req.flash("error_msg","Erro ao deletar lista!")
		res.redirect('/admin/listar')
	})
	
});

router.get("/postagens", admin, (req, res)=>{
	Postagem.find().populate("lista").sort({date:'desc'}).lean().then((postegens) =>{
		res.render("admin/postagens", {postegens: postegens})
	}).catch((err)=>{
		req.flash("error_msg","Erro ao postegens!")
		res.redirect('/admin/postagen')
	})

});

router.get("/criar-postagens", admin, (req, res)=>{
	Lista.find().lean().then( function(listas){
		res.render("admin/criar-postagens", {listas: listas})
	}).catch((err)=>{
		req.flash("error_msg","Erro ao caregar lista!")
		res.redirect('/admin/postagens')
	})
	
});

router.post("/criar-postagens", admin, (req, res)=>{
	
	var erros = []

	if (req.body.lista == 0) {
		erros.push({texto: "escolha uma item da lista!"})
	}

	if (erros.length > 0) {
		res.render("admin/criar-postagens", {erros: erros})

	}else{
		const novaPostagem = {
		titulo: req.body.titulo,
		descricao: req.body.descricao,
		conteudo: req.body.conteudo,
		lista: req.body.lista
		}

		new Postagem(novaPostagem).save().then(() => {
			req.flash("success_mgs", "Postagem foi salva com sucesso!")

			res.redirect("/admin/criar-postagens")
			console.log("Postagem salva com sucesso!")
		}).catch((err) =>{
			// msg
			req.flash("error_msg", "Erro ao salvar Postagem")
			console.log("erro ao salvar lista"+err)
			res.redirect('/admin/criar-postagens')
		})
	}
		
});

router.get('/editar-postagens/:id', admin, (req, res) => {
	Postagem.findOne({_id: req.params.id}).lean().then( function(postegens){
		Lista.find().lean().then( function(listas){
			res.render("admin/editar-postagens",{postegens: postegens, listas: listas})
		}).catch((err)=>{
		req.flash("error_msg", "errro na lista!")
		res.redirect('/admin/postagens')
	})	
				
	}).catch((err)=>{
		req.flash("error_msg", "errro na postagem!")
		res.redirect('/admin/postagens')
	})	
});

router.post('/postagem-editada', admin, (req, res) => {

	Postagem.findOne({_id: req.body.id}).then(function(postegens){

		postegens.titulo = req.body.titulo
		postegens.descricao = req.body.descricao
		postegens.conteudo = req.body.conteudo
		postegens.lista = req.body.lista
		
		postegens.save().then(() => {
			req.flash("success_mgs", "Postagem editada com sucesso!")
			res.redirect('/admin/postagens')
		}).catch((err)=>{
		req.flash("error_msg", "Erro interno na Hora de salvar a ediçao!")
		res.redirect('/admin/postagens')
		})

	}).catch((err)=>{
		console.log(err)
		req.flash("error_msg", "Erro ao salvar ediçao!")
		res.redirect('/admin/postagens')
	})	

});

router.post("/deletar-postagem", admin, (req, res)=>{
	Postagem.deleteOne({_id: req.body.id}).then(() => {
		req.flash("success_mgs", "Postagem deletada com sucesso!")
		res.redirect('/admin/postagens')
	}).catch((err)=>{
		req.flash("error_msg","Erro ao deletar Postagem!")
		res.redirect('/admin/postagens')
	})
	
});

/* tambem deleta mais é via get!!!*/
/*router.get('/editar-postagens/:id',(req, res) => {
	Postagem.deleteOne({_id: req.body.id}).then(() => {
		req.flash("success_mgs", "Postagem deletada com sucesso!")
		res.redirect('/admin/postagens')
	}).catch((err)=>{
		req.flash("error_msg","Erro ao deletar Postagem!")
		res.redirect('/admin/postagens')
	})
	
});*/


module.exports = router;