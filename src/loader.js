const express = require('express');

function Header(CRUD) {
  const Allow = ['OPTIONS'];
  for(const key in CRUD) {
    if(key === 'Create') {
      Allow.push('POST');
    } else if(key === 'Read') {
      Allow.push('GET');
    } else if(key === 'Update') {
      Allow.push('PUT');
    } else if(key === 'Delete') {
      Allow.push('DELETE');
    } else if(key === 'Patch') {
      Allow.push('PATCH');
    }
  }
  return Allow;
}

function loader(path, CRUD) {
  if(!this?.parentRouter) {
    this.parentRouter = this.getNewRouter();
  }
  if(this.duplicate.has(path)) {
    throw new Error('Conflict path');
  }
  this.duplicate.add(path);
  const parentRouter = this.parentRouter;
  CRUD?.Middlewares && CRUD.Middlewares instanceof Array && parentRouter.use(path, ...CRUD.Middlewares);
  CRUD?.Create && parentRouter.post(path, CRUD.Create);
  CRUD?.Read && parentRouter.get(path, CRUD.Read);
  CRUD?.Update && parentRouter.put(path, CRUD.Update);
  CRUD?.Delete && parentRouter.delete(path, CRUD.Delete);
  CRUD?.Patch && parentRouter.patch(path, CRUD.Patch);
  parentRouter.head(path, (req, res) => res.set('Allow', Header(CRUD).toString()))
  // path가 바뀔때마다 바인딩되는 오브젝트도 새로 만들어지기 때문에 라우터도 새로 만들어진다.
  const loaderChild = loader.bind({
    parentRouter: null,
    duplicate: new Set(),
    getNewRouter() {
      const childRouter = express.Router({ mergeParams: true });
      parentRouter.use(path, childRouter);
      return childRouter; // this.parentRouter = childRouter;
    }
  });
  return loaderChild;
}

function loaderRoot(app) {
  let mainErrorModel = null;
  const loaderChild = loader.bind({
    // 첫 바인딩은 express의 app을 그대로 반환합니다.
    parentRouter: app,
    duplicate: new Set()
  });
  // 최상위 loader는 유일하게 listen을 수행할 수 있습니다.
  // main 입장에서는 app에 직접 접근이 차단됩니다.

  // Deprecated: 더 이상 사용되지 않을 것입니다. 
  Object.setPrototypeOf(loaderChild, {
    listen() {
      if(!mainErrorModel) {
        mainErrorModel = require('./error.default');
      }
      app.use(mainErrorModel.getErrorHandlar());
      app.listen(...arguments);
    },
    addErrorType(type, option) {
      if(!mainErrorModel) {
        const ErrorModel = require('./error.model');
        mainErrorModel = new ErrorModel();
      }
      mainErrorModel.addErrorType(type, option);
    },
    getProto() {
      // app에 직접 접근하는 방법 (https 관련하여 유연하게 설계하지 못하여 직접 접근으로 정책 변경)
      if(!mainErrorModel) {
        mainErrorModel = require('./error.default');
      }
      app.use(mainErrorModel.getErrorHandlar());
      return app;
    },
  });
  return loaderChild;
}

module.exports = loaderRoot;
