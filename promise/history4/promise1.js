const SUCCESS = 'fulfilled'
const FAIL = 'rejected'
const PENDING = 'pending'

// Object.defineProperty(obj, 'then', {
//   get() {
//     if() {
//       throw new Error
//     }
//     throw new Error()
//   }
// })

// promsie2: 返回的新的promise
// x: then方法的返回值

// function resolvePromise(promsie2, x, resolve, reject) {
//   if (promsie2 === x) {
//     return reject(new TypeError('Chaining cycle detected for promise'))
//   }
//   // 判断x的类型
//   // promsie有n种实现，都符合了这个规范
//   let called
//   // 怎么判断x是不是一个promsie，看他有没有then方法
//   if (typeof x === 'function' || (typeof x === 'object' && x != null)) {
//     // 应该判断别人的promise成功了就不能失败，失败了就不能成功
//     try {
//       let then = x.then
//       if (typeof then === 'function') { //认为它是一个promise
//         // 不要使用x.then否则会在此取值

//         // then.call(x,y => {
//         //   // 如果promise是成功的话就把结果往下传
//         //   // 如果失败的话就让下一个也失败
//         //   // resolve(y)
//         //   // 递归调用，防止promise里面还返回promise
//         //   if (called) return
//         //   called = true
//         //   resolvePromise(promise2, y, resolve, reject)
//         // }, r => {
//         //   if (called) return
//         //   called = true
//         //   reject(r)
//         // })
//       } else {
//         // 普通值不用管，resolve后不会再调用reject
//         resolve(x)
//       }
//     } catch (e) {
//       if (called) return
//       called = true
//       reject(e)
//     }
//   } else { //普通值
//     // 普通值不用管，resolve后不会再调用reject
//     resolve(x)
//   }
// }

function resolvePromise(promise2, x,resolve,reject) { 
  if(promise2 === x){
     return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'));
  }
  let called;
  if(typeof x === 'function' || (typeof x === 'object' &&  x != null)){
    try{
      let then = x.then;  // then 可能是getter object.defineProperty
      if(typeof then === 'function'){  // {then:null}
         then.call(x,y=>{ 
           if(called) return; // 1)
           called = true;
            resolvePromise(promise2,y,resolve,reject); 
         },r=>{
           if(called) return; // 2)
           called = true;
            reject(r);
         }) 
      }else{ 
        resolve(x);
      }
    }catch(e){
      if(called) return; // 3) 为了辨别这个promise 不能调用多次
      called = true;
      reject(e);
    }
  }else{
    resolve(x);
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onrejectedCallbacks = []

    const resolve = (value) => {
      if (this.status === PENDING) {
        // 当value是promise的时候，会让那个promise执行等待它resolve的结果
        if (value instanceof Promise) {
          value.then(resolve, reject)
        }
        this.status = SUCCESS
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = FAIL
        this.reason = reason
        this.onrejectedCallbacks.forEach(fn => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  catch(errCb) { //then的语法糖
    return this.then(null, errCb)
  }

  finally(callback) { //不管成功失败都执行回调
    // 因为callback可能是一个函数返回promise，得等这个promise先执行完再执行函数
    return this.then((data) => {
      // return new Promise((resolve, reject) => {
      //   resolve(callback())
      // }).then(() => data)

      return Promise.resolve(callback()).then(() => data)

      // callback()
      // return data

    }, (err) => {
      // callback()
      // throw err

      // return new Promise((resolve, reject) => {
      //   resolve(callback())
      // }).then(() => {throw err})

      return Promise.resolve(callback()).then(() => {throw err})
    })
  }

  static resolve(cb) {
    return new Promise((resolve, reject) => {
      resolve(cb)
    })
  }

  static reject(cb) {
    return new Promise((resolve, reject) => {
      reject(cb)
    })
  }

  isPromise() {
    if (typeof value === 'function' || (typeof value === 'object' && value !== null)) {
      if (typeof value.then === 'function') {
        return true
      }
    }
    return false
  }

  // 计数器
  static all(promises) { //同步多个异步 同步得问题， 同步多个异步得结果
    return new Promise((resolve, reject) => {
      const arr = []
      let i = 0;
      let processData = (key, value) => {
        arr[key] = value
        if (++i === promises.length) {
          resolve(arr)
        }
      }
      for (let i = 0; i < promises.length; i++) {
        let current = promises[i]
        if (isPromise(current)) {
          current.then(y=> {
            processData(i, y)
          },reject)
        } else {
          processData(i, current)
        }
      }
    })
  }

  static race(promises) {
    return new Promise((resolve, reject) => {
      const arr = []
      let i = 0;
      for (let i = 0; i < promises.length; i++) {
        let current = promises[i]
        if (isPromise(current)) {
          current.then(resolve,reject)
        } else {
          resolve(current)
        }
      }
    })
  }

  // 如何终止promise链？返回一个等待得promise

  // 返回一个空的promise，既不成功也不失败

  then(onFulfilled, onRejected) {
    // 值的穿透
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (val) => val;
    onRejected = typeof onRejected === 'function' ? onRejected : (err) => {throw err}
    let promise2
    // promise不停的调用then方法，返还了一个新的promise
    promise2 = new Promise((resolve, reject) => {
      if (this.status === SUCCESS) {
        // onFulfilled(this.value)
        // 为了获取到promise2这个值，因此外层得加setTimeout
        setTimeout(() => {
          try {
            // 调用当前then方法的返回结果，来判断当前这个promise2是成功还是失败
            // x是普通值还是promise
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        });
      }
  
      if(this.status === FAIL) {
        // onRejected(this.reason)
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        });
      }

      if(this.status === PENDING) {
        // 发布订阅
        this.onResolvedCallbacks.push(() => {
          // onFulfilled(this.value)
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
        this.onrejectedCallbacks.push(() => {
          // onRejected(this.reason)
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    })
    return promise2
  }
}

// promises-aplus-tests
// deffered
Promise.defer = Promise.deferred = () => {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

// function wrap(promise) {
//   let abort
//   const newPromise = new Promise((resolve, reject) => {
//     abort = reject
//   })
//   let p = Promise.race([newPromise, promise])
//   p.abort = abort
//   return p
// }

// const promise = new Promise((resolve, reject) => {resolve()})
// const p = wrap(promise)
// p.abort()

module.exports = Promise