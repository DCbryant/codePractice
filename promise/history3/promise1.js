const SUCCESS = 'fulfilled'
const FAIL = 'rejected'
const PENDING = 'pending'

// promsie2: 返回的新的promise
// x: then方法的返回值
function resolvePromise(promsie2, x, resolve, reject) {
  if (promsie2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
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

    executor(resolve, reject)
  }

  then(onFulfilled, onRejected) {
    let promise2
    // promise不停的调用then方法，返还了一个新的promise
    promise2 = new Promise((resolve, reject) => {
      if (this.status === 'fulfilled') {
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
        }, 0);
      }
  
      if(this.status === 'rejected') {
        // onRejected(this.reason)
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0);
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

module.exports = Promise