const fileWalker = require("./index.js");

fileWalker({
	id: 123,
	ignoreDotFiles: true,
	sort: "asc",	// desc
	entry: "test",
	readFiles: "modified",
	onDirectory: response => {
		//console.log("dir:", response.path);
	},
	onFile: response => {
		//console.log("file:", response.path);
	},
	onFinish: response => {
		console.log(response);
	}
});


