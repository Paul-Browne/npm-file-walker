const fs = require("fs");
const path = require("path");

const timestamp = fs.statSync(__filename).mtimeMs;

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
        obj.onFile && obj.onFile({
            stats: details,
            path: _path,
            contents: obj.readFiles && fs.readFileSync(_path),
            modified: (details.mtimeMs > timestamp || details.ctimeMs > timestamp)
        });
    }
}

module.exports = obj => {
    const self = fs.readFileSync(__filename);
    fs.writeFileSync(__filename, self);
    return fileWalker(obj);
}
