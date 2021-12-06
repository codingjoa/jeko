const fs = require('fs');
const path = require('path');
const events = require('events');
const ROOT = process.cwd();

class FileSystem {
  constructor(file, dir, optionV2) {
    const multiple = file instanceof Array;
    if(file) {
      this.file = multiple ? file : [ file ];
    } else {
      this.file = [];
    }
    this.dir = dir;
    this.cancel = false;
    this.consume = false;
    this.getSaveName = optionV2?.saveName ?? (file => file.tempName);
  }

  createFormat(file) {
    return {
      dir: this.dir, // deprecated
      uuid: file.filename, // deprecated
      name: file.originalname, // deprecated
      extname: path.extname(file.originalname), // deprecated
      //V2
      baseDir: ROOT,
      saveDir: this.dir,
      tempPath: file.path,
      tempName: file.filename,
      fileName: file.originalname,
      extName: path.extname(file.originalname),
    };
  }

  async serialize(callback) {
    if(this.consume) {
      return;
    }
    this.consume = true;

    const files = this.file.map(file => this.createFormat(file)).map(file => ({
      ...file,
      saveName: this.getSaveName(file),
    }));
    try {
      await callback({
        size: this.size.bind(this),
        [Symbol.iterator]: function* () {
          for(const file of files) {
            yield file;
          }
        },
      });
      await this.commitTemps(files);
      await this.removeTemps(files);
    } catch(err) {
      await this.removeTemps(files);
      throw err;
    }
  }

  async commitTemps(files) {
    for(const file of files) {
      const tempPath = file.tempPath;
      const newPath = path.join(ROOT, file.saveDir, file.saveName);
      const R = fs.createReadStream(tempPath);
      const W = fs.createWriteStream(newPath);
      R.pipe(W);
      await events.once(W, 'finish');
    }
  }

  async removeTemps(files) {
    this.consume = true;
    for(const file of files) {
      const tempPath = file.tempPath;
      fs.existsSync(tempPath) && fs.rmSync(tempPath);
    }
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
      const delPath = option.nameOnly ? path.join(ROOT, this.dir, relativePath) : path.join(ROOT, relativePath);
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
