const express = require('express')
const mongoose = require ("mongoose")
require("../models/Lista")
const Lista = mongoose.model("listas")

const router = express.Router()

router.get('/',(req, res) => {
	res.render("home/index")
});

router.get('/sobre',(req, res) => {
	
		res.render("home/sobre")
	
	
});

router.get('/lista',(req, res) => {
	Lista.find().sort({date:'desc'}).lean().then( function(listas){
		res.render("home/lista", {listas: listas})
	}).catch((err) =>{
		console.log("aaaa"+err)
	})
});

router.post('/lista',(req, res) => {
	const novaLista = {
		nome: req.body.nome,
		sobrenome: req.body.sobrenome,
		email: req.body.email
	}

	new Lista(novaLista).save().then(()=>{
		res.redirect("/lista")
		console.log("lista salva com sucesso!")
	}).catch((err) =>{
		console.log("erro ao salvar lista"+err)
	})
});

module.exports = router;