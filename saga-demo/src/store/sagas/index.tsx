import {takeEvery, delay, put, all} from 'redux-saga/effects'
import * as types from '../action-types'
import {watchAsyncIncrement} from './counter'
import {read} from './read'
import {watchIncrementAsync, watchAndLog} from './take'

export default function* rootSaga() {
  console.log('hello saga')
  // all 类似 promise.all
  yield all([
    watchAsyncIncrement(),
    read(),
    watchIncrementAsync(),
    watchAndLog()
  ])
  // yield watchAsyncIncrement()
}