const express = require('express')
const mongoose = require ("mongoose")
require("../models/Lista")
const Lista = mongoose.model("listas")
require("../models/Postagem")
const Postagem = mongoose.model("postegens")
const router = express.Router()

router.get('/', (req,res) => {
	Postagem.find().populate("lista").sort({date:'desc'}).lean().then((postegens) =>{
		res.render("index", {postegens: postegens})
	}).catch((err)=>{
		console.log('erro na pagina index'+err)
		res.redirect("/404")
	})
});


router.get('/categorias/:titulo', (req, res) => {
	Postagem.findOne({titulo: req.params.titulo}).lean().then((postegens) =>{
		if (postegens) {
				res.render("categorias", { postegens: postegens})
				//console.log(postegens)
		} else{
			console.log('erro na categorias 1 index'+err)
			res.redirect("/404")
		}

	}).catch((err)=>{
		console.log('erro na categorias 2 index'+err)
		res.redirect("/lista")
	 })	
				
	// res.render("categorias", {postegens})
	// console.log(postegens)
});


router.get('/lista', (req, res) => {
	Lista.find().sort({date:'desc'}).lean().then( function(listas){
		res.render("lista", {listas: listas})
	}).catch((err) =>{
		console.log("router.get(/lista"+err)
	})
});

router.get('/lista_para_categoria', (req, res) => {
	Lista.find().sort({date:'desc'}).lean().then( function(listas){
		res.render("lista-para-categoria", {listas: listas})
	}).catch((err) =>{
		console.log("router.get(/lista_para_categoria"+err)
	})
});


router.get("/listar", (req, res) =>{
	res.render("saco")

});

router.get("/listar/:nome", (req, res) =>{
	Lista.findOne({nome: req.params.nome}).lean().then((lista) =>{
		if (lista) {
			Postagem.find({lista: lista._id}).lean().then((postegens) =>{
				console.log(lista)
				res.render("saco", {postegens: postegens, lista: lista})

			}).catch((err) =>{
				console.log("router.get(lista/:nome"+err)
			})

		} else {
			req.flash("error_msg","Eesta com erro !")
		}
	}).catch((err) =>{
		console.log("router.get(lista/:nome"+err)
	})
});

router.get('/404', (req,res) => {
	res.send('erro 404 ')
});


module.exports = router;