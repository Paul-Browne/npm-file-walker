import fileWalker from "./index.js";

const res = await fileWalker({
	id: "xyz",
	//ignoreDir: ["bar", "foo"],
	ignoreDotFiles: true,
	sort: "asc",	// desc
	entry: "test",
	readFiles: "modified",
	onDirectory: response => {
		console.log("onDirectory")
		console.log("===========")
		console.log(response);
	},
	onFile: response => {
		console.log("onFile")
		console.log("======")		
		console.log(response);
	},
	// onFinish: response => {
	// 	console.log("onFinish")
	// 	console.log("========")			
	// 	console.log(response);
	// }
});

console.log(res);