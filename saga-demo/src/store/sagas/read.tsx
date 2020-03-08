import {takeEvery, put, call, apply, cps} from 'redux-saga/effects'
import {delay, readFile} from '../../utils'

export function* read() {
  // call类似js中的call方法，调用delay并传入1000,2000,并返回一个promsie
  // middleware会等待promise变成完成态
  // const result = yield call(delay, 1000, 2000)
  // const result = yield call([null, delay], 1000, 2000)
  // const result = yield apply(null, delay, [1000, 2000])
  // 用来命令 middleware 以 Node 风格的函数（Node style function）的方式调用 fn
  const result = yield cps(readFile, '1.txt')
  console.log(result, "result")
}