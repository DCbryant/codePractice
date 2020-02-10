const SUCCESS = 'fulfilled'
const FAIL = 'rejected'
const PENDING = 'pending'

class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    // 存储所有成功的回调，只有status为pending的时候才存储
    this.onResolvedCallbacks = []
    this.onrejectedCallbacks = []

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = SUCCESS
        this.value = value
        // 发布订阅 先存储，触发后一个个执行
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
    if (this.status === SUCCESS) {
      onFulfilled(this.value)
    }

    if(this.status === FAIL) {
      onRejected(this.reason)
    }

    if(this.status === PENDING) {
      // 发布订阅
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onrejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}

module.exports = Promise