import {takeEvery, delay, put, all} from 'redux-saga/effects'
import * as types from '../action-types'

export function* watchAsyncIncrement() {
  // watch saga
  yield takeEvery(types.ASYNC_INCREMENT, asyncIncrement)
}

function* asyncIncrement() {
  // yield后面可以跟一个promise
  // sagaMiddle会停下来等待这个promise变成成功态，会继续向下执行
  yield delay(1000)
  // 相当于store.dispatch({type: types.INCREMENT})
  yield put({type: types.INCREMENT})
}