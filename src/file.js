const fs = require('fs');
const path = require('path');
const events = require('events');
const ROOT = process.cwd();

class FileSystem {
  constructor(file, dir) {
    const multiple = file instanceof Array;
    if(file) {
      this.file = multiple ? file : [ file ];
    }
    this.dir = dir;
    this.cancel = false;
  }

  createFormat(file) {
    console.log(file);
    return {
      dir: this.dir,
      uuid: file.filename,
      name: file.originalname,
      extname: path.extname(file.originalname),
    };
  }

  async add(callback, option) {
    if(this.cancel) {
      return;
    }
    /*
    if(this.multiple) {
      this.file.forEach(file => {
        const serverPath = path.join(this.dir, file.filename);
        await callback(serverPath);
        await this.commit(file);
      });
    }
    */
    //const serverPath = path.join(this.dir, this.file.filename);
    if(!this.file) {
      if(option?.force) {
        return;
      }
      throw new Error('FILE_NOT_EXISTS');
    }
    try {
      for(const file of this.file) {
        await callback(this.createFormat(file));
        await this.commit(
          file.path,
          path.join(ROOT, this.dir, file.filename)
        );
      }
    } catch(err) {
      for(const file of this.file) {
        this.withdraw(file);
      }
      throw err;
    }
  }

  async del(callback) {
    const remover = (relativePath, option = {
      nameOnly: false
    }) => {
      const delPath = option.nameOnly ? path.join(path.join(ROOT, this.dir, relativePath)) : path.join(path.join(ROOT, relativePath));
      this.rm(delPath);
    };
    await callback(remover);
  }

  async commit(tempPath, newPath) {
    try {
      const R = fs.createReadStream(tempPath);
      const W = fs.createWriteStream(newPath);
      R.pipe(W);
      await events.once(W, 'finish');
      fs.existsSync(tempPath) && fs.rmSync(tempPath);
    } catch(err) {
      fs.existsSync(newPath) && fs.rmSync(newPath);
      this.withdraw();
      throw err;
    }
  }

  size() {
    return this?.file?.length ?? 0;
  }

  withdraw(file) {
    if(this.cancel) {
      return;
    }
    file?.path && fs.existsSync(file.path) && fs.rmSync(file.path);
    this.cancel = true;
  }

  rm(relativePath) {
    //const target = path.join(ROOT, relativePath);
    fs.existsSync(relativePath) && fs.rmSync(relativePath);
  }

  rename(oldPath, newPath) {
    fs.existsSync(oldPath) && fs.renameSync(oldPath, newPath);
  }
}
module.exports = FileSystem;
