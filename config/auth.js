/* importar o módulo do passaport local */
const LocalStrategy = require('passport-local').Strategy;
/* importar o módulo do mongoose */
const mongoose = require ("mongoose")
/* importar o módulo do bcrypt conforme documentaçao */
const bcrypt = require('bcrypt')

/* importar o model de usuario */
require("../routes/usuario")
const Usuario = mongoose.model("usuarios")

/* exportar o módulo do passaport local de usuario */
module.exports = function(passport){
	/* indicando qual o parametro eu vou usar para faser a altenticaçao aqui o email */
	// passport.use(new LocalStrategy(
	// 	function(email, senha, done) {
	// 	  User.findOne({ email: email }, function (err, user) {
	// 		if (err) { return done(err); }
	// 		if (!user) { return done(null, false); }
	// 		if (!user.verifyPassword(senha)) { return done(null, false); }
	// 		return done(null, user);
	// 	  });
	// 	}
	//   ));
	
	 passport.use(new LocalStrategy({usernameField: 'email', passwordField: "senha"}, (email, senha, done) =>{
		
	 	Usuario.findOne({email: email}).lean().then( (usuario) => {
	 		if (!usuario){
	 			return done(null, false, {message: "Esta conta não existe"})
	 		}
	 		bcrypt.compare(senha, usuario.senha, (erro, batem) =>{
	 			if (batem){
	 				return done(null, usuario)
	 			}else{
	 				return done(null, false, {message: "Senha invalida"})
	 			}
	 		})
	 	})
	 }))
	/*sauvar os dados do usuario em uma sessao*/
	 // passport.serializeUser((usuario, done) =>{
	 // 	done(null, usuario.id)
	 // })
	 passport.serializeUser(function(user, done) {
  		done(null, user);
	}); 
	 
	 passport.deserializeUser((id, done) =>{
	 	Usuario.findById(id,(err, usuario) => {
	 		done(err, usuario)
	 	})
	 })
	 
	//  passport.deserializeUser(function(user, done) {
 //  		done(null, user);
	// });
}

