const SUCCESS = 'fulfilled'
const FAIL = 'rejected'
const PENDING = 'pending'

class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = SUCCESS
        this.value = value
      }
    }

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = FAIL
        this.reason = reason
      }
    }

    executor(resolve, reject)
  }

  then(onFulfilled, onRejected) {
    if (this.status === 'fulfilled') {
      onFulfilled(this.value)
    }

    if(this.status === 'rejected') {
      onRejected(this.reason)
    }
  }
}

module.exports = Promise