const mongoose = require ("mongoose")
const Schema = mongoose.Schema;

const Usuario = new Schema ({
	nome:{
		type: String,
		required: true
	},
	email:{
		type: String,
		lowercase: true,
		requered: true
	},
	eAdmin:{
		type: Number,
		default: 0
	},
	senha:{
		type: String,
		requered: true
	},
	
	date: {
		type: Date,
		default:Date.now()
	}
})

mongoose.model("usuarios", Usuario)