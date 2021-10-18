import { readdir, readFile, stat } from "fs/promises";
import { join, basename } from "path";
import { get, set } from "stamptime";

const fileWalker = async (obj, store, depth) => {
    const path = obj.entry;
    let timestamp;
    try {
        timestamp = await get(obj.id || 1);
    } catch (error) {
        set(obj.id || 1);
    }
    const details = await stat(path);
    let ignoreDir = false;
    if(obj.ignoreDir){
        if(typeof obj.ignoreDir === 'string'){
            ignoreDir = path.indexOf(obj.ignoreDir) >= 0;
        }else{
            ignoreDir = obj.ignoreDir.some(element => path.indexOf(element) >= 0);
        }
    }
    if(!ignoreDir){
        if (details.isDirectory()) {
            const dir = await readdir(path);
            dir.sort(async a => {
                const x = await stat(join(path, a));
                return x.isDirectory();
            });
            const contents = await Promise.all(dir.map(async subs => {
                const subPath = join(path, subs);
                const subStat = await stat(subPath);
                const isFile = subStat.isFile();
                return{
                    path: subPath,
                    name: subs,
                    stats: subStat,
                    isFile: isFile,
                    isDirectory: subStat.isDirectory(),
                    depth: depth + 1
                };
            }))
            const dirDetails = {
                stats: details,
                path: path,
                name: basename(path),
                isFile: false,
                isDirectory: true,            
                contents: contents,
                depth: depth
            };
            store.push(dirDetails);
            obj.onDirectory && obj.onDirectory(dirDetails);
            depth++;
            await Promise.all(dir.map(async subs => {
                obj.entry = join(path, subs);
                return await fileWalker(obj, store, depth);
            }))
        } else {
            const modified = !timestamp || (details.mtimeMs > timestamp || details.ctimeMs > timestamp);
            const readFilesBool = (obj.readFiles === true || (obj.readFiles === "modified" && modified));
            const fileName = basename(path);
            const isDotFile = fileName.indexOf(".") === 0;
            if(!(obj.ignoreDotFiles && isDotFile)){
                const contents = await readFile(path);
                const fileDetails = {
                    stats: details,
                    path: path,
                    name: fileName,
                    isFile: true,
                    isDirectory: false,
                    contents: readFilesBool && contents,
                    modified: modified,
                    depth: depth
                };
                store.push(fileDetails);
                obj.onFile && obj.onFile(fileDetails);
            }
        }
    }
}

export default async obj => {
    const store = [];
    await fileWalker(obj, store, 0);
    if(obj.onFinish){
        store.sort((a,b) => obj.sort && obj.sort === "desc" ? b.depth - a.depth : a.depth - b.depth);
        obj.onFinish(store);
    }
}
