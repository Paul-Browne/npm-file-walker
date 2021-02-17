const fileWalker = require("./index.js");

fileWalker({
	entry: "test",
	readFiles: "modified",
	onDirectory: response => {
		// console.log(response);
	},
	onFile: response => {
		console.log(response);
	}
});