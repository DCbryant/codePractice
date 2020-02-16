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

module.exports = Promise