const server = require("./database/server");
require("./database/db.js");

server.listen(3000, ()=>{
	console.log("servidor on!");
});