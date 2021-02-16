# recursive-file-walker
recursively look over all the files and sub directories from a starting directory

### usage

`npm i recursive-file-walker`

or 

`npm i -D recursive-file-walker`


```js
const fileWalker = require("recursive-file-walker");

fileWalker({
	entry: "path/to/start/directory",
	readFiles: true,					// fs.readFileSync the files. default: false
	onDirectory: response => {
		console.log(response);			// callback when directory, object passed with directory details 
	},
	onFile: response => {
		console.log(response);			// callback when file, object passed with file details
	}									// will inc. contents if readFile: true
});
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
  contents: [
    {
      path: 'test/bar',
      stats: [Stats],
      isFile: false,
      isDirectory: true
    },
    {
      path: 'test/foo',
      stats: [Stats],
      isFile: false,
      isDirectory: true
    },
    {
      path: 'test/index.html',
      stats: [Stats],
      isFile: true,
      isDirectory: false
    },
    {
      path: 'test/index.js',
      stats: [Stats],
      isFile: true,
      isDirectory: false
    },
    {
      path: 'test/index.txt',
      stats: [Stats],
      isFile: true,
      isDirectory: false
    }
  ]
}
```


example response for a file. `contents` will be undefined if `readFile: false`

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
  contents: <Buffer 4c 6f 72 65 6d 20 69 70 73 75 6d 20 64 6f 6c 6f 72 20 73 69 74 20 61 6d 65 74 2c 20 63 6f 6e 73 65 63 74 65 74 75 72 20 61 64 69 70 69 73 69 63 69 6e ... 4214650 more bytes>
}
```