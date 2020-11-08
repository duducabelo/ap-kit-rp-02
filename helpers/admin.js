/*isso é um tipo de middleware*/
module.exports = {
	admin: (req, res, next) =>{
		/* isAuthenticated() uma funçao do passport*/
		if (req.isAuthenticated() && req.user.eAdmin === 1 ){
			return next();
		}
		req.flash("error_msg", "area administrativa")
		res.redirect("/")
	}
};

//tenho que criar a rota de usuario logado area restrita onde eu trenho o controle de pessoas nao publicas lembret