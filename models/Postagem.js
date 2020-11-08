const mongoose = require ("mongoose")
const Schema = mongoose.Schema;

const Postagem = new Schema ({
	titulo:{
		type: String,
		required: true
	},
	descricao:{
		type: String,
		requered: true
	},
	conteudo:{
		type: String,
		requered: true
	},
	lista:{
		type: Schema.Types.ObjectId,
		ref: "listas",
		requerid: true
	},
	date: {
		type: Date,
		default:Date.now()
	}
})

mongoose.model("postegens", Postagem)