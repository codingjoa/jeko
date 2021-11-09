const DAO = require('./dao');
class MVC {
  constructor() {
    this.code = 200;
    this.Model = null;
    this.view = new Map();
    const method = this.method = new Map();
    this.errors = {};
    this.docs = new Map();
    this.handlar = {
      get(req, name) {
        if(!method.has(name)) {
          throw new Error();
        }
        const value method.get(name)(req);
        return method.get(name)(req);
      }
    };
  }
  async Controller(req, res, next) {
    try {
      const param = new Proxy(req, this.handlar);
      const dao = new DAO();
      const result = await this.Model({
        param,
        dao,
        errors: this.errors
      });
      this.view.get(req.accepts(this.view.keys()))(res, result);
    } catch(err) {
      next(err);
    }
  }
  model(fn) {
    this.Model = fn;
    return this;
  }
  status(code = 200) {
    this.code = code;
    return this;
  }
  json() {
    this.view.set('application/json', (res, result) => res.json(result));
    return this;
  }
  addParameter({
    name,
    visualName,
    description,
    method,
    type
  }) {
    this.method.set(name, method);
    visualName && this.docs.set({
      parameter: visualName,
      type,
      description
    });
    return this;
  }
  addErrorType(code, CommonError) {

  }
}

class CL {
  constructor() {}
  controller() {}

  getController() {
    let Read = null, Create = null, Update = null, Delete = null, Patch = null;
    const s = {
      create: () => {
        if(Read === null) {
          Read = new MVC();
        }
        return Read;
      },
      delete: () => {
        if(Read === null) {
          Read = new MVC();
        }
        return Read;
      },
      read: () => {
        if(Read === null) {
          Read = new MVC();
        }
        return Read;
      },
      patch: () => {
        if(Read === null) {
          Read = new MVC();
        }
        return Read;
      },
      update: () => {
        if(Read === null) {
          Read = new MVC();
        }
        return Read;
      },
    };
    this.controller(s);
    //this.only();
    this.parameter(s);
    return {
      Create: Create?.Controller,
      Delete: Delete?.Controller,
      Read: Read?.Controller,
      Patch: Patch?.Controller,
      Update: Update?.Controller,
    };
  }
}


const handlar = {
  get(req, name) {
    method
  }
};
