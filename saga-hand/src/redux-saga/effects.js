export function take(actionType) {
  return {
      type:'TAKE',
      actionType
  }
}

export function put(action) {
  return {
      type: 'PUT',
      action
  }
}

export function fork(task) { //fork接收的是生成器
  return {
      type: 'FORK',
      task
  }
}

export function* takeEvery(actionType,task) { // task是生成器
  yield fork(function* () {
      while (true) {
          yield take(actionType);
          yield task();
      }
  });
}

export function call(fn,...args) {
  return {
      type: 'CALL',
      fn,
      args
  }
}

const innerDelay = ms => new Promise((resolve,reject) => {
  setTimeout(() => {
      resolve();
  },ms);
})

export function delay(...args) {
  return call(innerDelay, ...args);
}