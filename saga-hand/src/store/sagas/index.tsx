import {takeEvery, delay, put, all} from 'redux-saga/effects'
import * as types from '../action-types'
import {watchAsyncIncrement} from './counter'

export default function* rootSaga() {
  console.log('hello saga')
  // all 类似 promise.all
  yield all([watchAsyncIncrement()])
  // yield watchAsyncIncrement()
}