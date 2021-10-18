# recursive-file-walker
recursively look over all the files and sub directories from a starting directory

### usage

`npm i recursive-file-walker`

or 

`npm i -D recursive-file-walker`


```js
import fileWalker from "recursive-file-walker";

fileWalker({
	id: 789,                           // pass an id, if you are using more than one fileWalker function (optional)
  entry: "path/to/start/directory",  // where to start the recursive file walker
	ignoreDir: ["bar", "foo"],         // will ignore a directory (string), or array of directories
	ignoreDotFiles: true,              // will ignore dotfiles, default:false
	sort: "asc",                       // will sort the files by depth from root directory, only for the onFinish callback, default:"asc"
	readFiles: "modified",             // "true" - all files, "false" - no files, "modified" will only read the file if the contents have been changed, default:false
	onDirectory: response => {
		console.log(response);           // callback when directory, object passed with directory details 
	},
	onFile: response => {
		console.log(response);           // callback when file, object passed with file details 
	},                                 // will inc. contents if readFile:true or if readFile:"modified" and contents have changed
	onFinish: response => {
		console.log(response);           // callback when finished, array passed with all file and directory details
	}                                  // will inc. contents if readFile:true or if readFile:"modified" and contents have changed
});                                  // will also sort by depth ascending (root first)
```

example response for directory

```js
{
  stats: Stats {
    dev: 16777220,
    mode: 16877,
    nlink: 7,
    uid: 501,
    gid: 20,
    rdev: 0,
    blksize: 4096,
    ino: 59344308,
    size: 224,
    blocks: 0,
    atimeMs: 1613431138819.4158,
    mtimeMs: 1613431138623.7507,
    ctimeMs: 1613431138623.7507,
    birthtimeMs: 1613430981511.142,
    atime: 2021-02-15T23:18:58.819Z,
    mtime: 2021-02-15T23:18:58.624Z,
    ctime: 2021-02-15T23:18:58.624Z,
    birthtime: 2021-02-15T23:16:21.511Z
  },
  path: 'test',
  name: 'test',
  depth: 0,
  contents: [
    {
      path: 'test/bar',
      name: 'bar',
      stats: [Stats],
      isFile: false,
      isDirectory: true,
      depth: 1
    },
    {
      path: 'test/foo',
      name: 'foo',
      stats: [Stats],
      isFile: false,
      isDirectory: true,
      depth: 1
    },
    {
      path: 'test/index.html',
      name: 'index.html',
      stats: [Stats],
      isFile: true,
      isDirectory: false,
      depth: 1
    },
    {
      path: 'test/index.js',
      name: 'index.js',
      stats: [Stats],
      isFile: true,
      isDirectory: false,
      depth: 1
    },
    {
      path: 'test/index.txt',
      name: 'index.txt',
      stats: [Stats],
      isFile: true,
      isDirectory: false,
      depth: 1
    }
  ]
}
```


example response for a file. `contents` will be undefined if `readFile: false`.
`modified` will be `true` if the contents have changed, or if the file was created since the last walk (since the last time the function was called)

```js
{
  stats: Stats {
    dev: 16777220,
    mode: 33188,
    nlink: 1,
    uid: 501,
    gid: 20,
    rdev: 0,
    blksize: 4096,
    ino: 59344407,
    size: 4214700,
    blocks: 8320,
    atimeMs: 1613435111889.6147,
    mtimeMs: 1613432214420.2336,
    ctimeMs: 1613432214420.2336,
    birthtimeMs: 1613431128666.037,
    atime: 2021-02-16T00:25:11.890Z,
    mtime: 2021-02-15T23:36:54.420Z,
    ctime: 2021-02-15T23:36:54.420Z,
    birthtime: 2021-02-15T23:18:48.666Z
  },
  path: 'test/index.txt',
  name: 'index.txt',
  depth: 1,  
  contents: <Buffer 4c 6f 72 65 6d 20 69 70 73 75 6d 20 64 6f 6c 6f 72 20 73 69 74 20 61 6d 65 74 2c 20 63 6f 6e 73 65 63 74 65 74 75 72 20 61 64 69 70 69 73 69 63 69 6e ... 4214650 more bytes>,
  modified: true
}
```