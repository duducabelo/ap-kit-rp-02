const server = require("./database/server");
require("./database/db.js");

server.listen(3546, ()=>{
	console.log("servidor on! 3546");
});