import fileWalker from "./index.js";

const res = await fileWalker({
	entry: "test",
	id: "xyz",
	ignoreFiles: "*.js",				// TODO
	ignoreDirectories: ["foo"],			// TODO - add globbing eg. */node_modules
	ignoreDotFiles: true,			
	ignoreDotDirectories: true,			// TODO
	readFiles: "modified",
	flatten: false,
	sort: "asc"							// TODO
});

console.log(res);