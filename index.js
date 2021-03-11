const fs = require("fs");
const path = require("path");
const stamp = require("stamptime");

const fileWalker = (obj, store, depth) => {
    const timestamp = stamp.get(obj.id || 1);
    const _path = obj.entry;
    const details = fs.statSync(_path);
    if (details.isDirectory()) {
        const dir = fs.readdirSync(_path).sort(a => {
            const subPath = path.join(_path, a);
            return fs.statSync(subPath).isDirectory();
        });
        const contents = dir.map(subs => {
            const subPath = path.join(_path, subs);
            const subStat = fs.statSync(subPath);
            const isFile = subStat.isFile();
            return {
                path: subPath,
                name: subs,
                stats: subStat,
                isFile: isFile,
                isDirectory: subStat.isDirectory(),
                depth: depth + 1
            }
        })
        const dirDetails = {
            stats: details,
            path: _path,
            name: path.basename(_path),
            contents: contents,
            depth: depth
        };
        store.push(dirDetails);
        obj.onDirectory && obj.onDirectory(dirDetails);
        depth++;
        dir.map(subs => {
            obj.entry = path.join(_path, subs);
            return fileWalker(obj, store, depth);
        })
    } else {
        const modified = (details.mtimeMs > timestamp || details.ctimeMs > timestamp);
        const readFilesBool = (obj.readFiles === true || (obj.readFiles === "modified" && modified));
        const fileName = path.basename(_path);
        const isDotFile = fileName.indexOf(".") === 0;
        if(!(obj.ignoreDotFiles && isDotFile)){
            const fileDetails = {
                stats: details,
                path: _path,
                name: fileName,
                contents: readFilesBool && fs.readFileSync(_path),
                modified: modified,
                depth: depth
            };
            store.push(fileDetails);
            obj.onFile && obj.onFile(fileDetails);
        }
    }
}

module.exports = obj => {
    const store = [];
    const res = fileWalker(obj, store, 0);
    if(obj.onFinish){
        store.sort((a,b) => {
            return obj.sort && obj.sort === "desc" ? b.depth - a.depth : a.depth - b.depth;
        })
        obj.onFinish(store);
    }    
    stamp.set(obj.id || 1);
    return res
}
