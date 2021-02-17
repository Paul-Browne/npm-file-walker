const fs = require("fs");
const path = require("path");
const stamp = require("stamptime");

const timestamp = stamp.get(1);

const fileWalker = obj => {
    const _path = obj.entry;
    const details = fs.statSync(_path);
    if (details.isDirectory()) {
        const dir = fs.readdirSync(_path);
        if(obj.onDirectory){
            const contents = dir.map(subs => {
                const subPath = path.join(_path, subs);
                const subStat = fs.statSync(subPath);
                return {
                    path: subPath,
                    stats: subStat,
                    isFile: subStat.isFile(),
                    isDirectory: subStat.isDirectory()
                }
            })        
            obj.onDirectory({
                stats: details,
                path: _path,
                contents: contents
            });
        }
        dir.map(subs => {
            obj.entry = path.join(_path, subs);
            return fileWalker(obj);
        })
    } else {
        const modified = (details.mtimeMs > timestamp || details.ctimeMs > timestamp);
        const readFilesBool = (obj.readFiles === true || (obj.readFiles === "modified" && modified));
        obj.onFile && obj.onFile({
            stats: details,
            path: _path,
            contents: readFilesBool && fs.readFileSync(_path),
            modified: modified
        });
    }
}

module.exports = obj => {
    stamp.set(1);
    return fileWalker(obj);
}
