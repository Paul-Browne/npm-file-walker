const fileWalker = require("./index.js");

fileWalker({
	entry: "test",
	readFiles: true,
	onDirectory: response => {
		console.log(response);
	},
	onFile: response => {
		console.log(response);
	}
});