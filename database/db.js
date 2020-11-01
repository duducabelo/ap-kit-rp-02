const mongoose = require ("mongoose");

	mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://localhost/dbteste02', {useUnifiedTopology: true, useNewUrlParser: true})
		.then(() => {
			console.log("mongodb conect tudo OK")
		})
		.catch((err) => {
			console.log('erro conect mongodb '+err)
		});
