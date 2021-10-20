import { readdir, readFile, stat } from "fs/promises";
import { join, basename } from "path";
import { get, set } from "stamptime";

const fileWalker = async (obj, depth, timestamp) => {
    const path = obj.entry;
    let ignoreDirectory = false;
    if(obj.ignoreDirectories){
        if(typeof obj.ignoreDirectories === 'string'){
            ignoreDirectory = path.indexOf(obj.ignoreDirectories) >= 0;
        }else{
            // currently ignores all dir's that contain eg. "bar"
            ignoreDirectory = obj.ignoreDirectories.some(element => path.indexOf(element) >= 0);
        }
    }
    if(ignoreDirectory){
        return [];
    }else{
        const details = await stat(path);
        if (details.isDirectory()) {
            const dir = await readdir(path);
            depth = depth + 1;
            return await Promise.all(dir.map(async subs => {
                obj.entry = join(path, subs);
                return await fileWalker(obj, depth, timestamp);
            }))
        } else {
            const modified = (details.mtimeMs > timestamp || details.ctimeMs > timestamp);
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
                return fileDetails;
            }else{
                return {};
            }
        }
    }
}

const rec = (element, store) => {
    if(Array.isArray(element)){
        element.forEach(ele => rec(ele, store));
    }else{
        store.push(element);
    }
}

export default async obj => {
    const timestamp = await get(obj.id || 1);
    const FW = await fileWalker(obj, -1, timestamp);
    await set(obj.id || 1);
    if(obj.flattern){
        const store = [];
        rec(FW, store);
        if(obj.sort){
            // TODO
        }
        return store;
    }else{
        return FW;
    }
}
