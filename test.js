import fileWalker, {reset} from "./index.js";

const res = await fileWalker({
	entry: "test",
	id: "xyz123",
	ignoreFiles: "*.js",				// TODO
	ignoreDirectories: ["foo"],			// TODO - add globbing eg. */node_modules
	ignoreDotFiles: true,			
	ignoreDotDirectories: true,			// TODO
	readFiles: "modified",
	flatten: false,
	sort: "asc"							// TODO
});

console.log(res);

Math.random() > 0.5 && reset("xyz123");