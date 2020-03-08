import {takeEvery, delay,take, put, all, select} from 'redux-saga/effects'
import * as types from '../action-types'

// takeEvery 监听每一次动作，当动作发生的时候执行对应的saga
// takeEvery是一个高级语法糖，内部是靠take实现的
// takeEvery是一个死循环，会一直监听每一次动作，而take只监听依次，触发一次就销毁
// takeEvery: addEventListener
// take: event.once

export function* watchIncrementAsync() {
  for (let i = 0; i <3; i++) {
    const action = yield take(types.ASYNC_INCREMENT)
    console.log(action)
    yield put({ type: types.INCREMENT})
  }
  alert('完成')
}

export function* watchAndLog() {
  // 记录每一次派发的动作，当动作派发后打印日志
  while (true) {
    const action = yield take('*')
    console.log(action)
    // const state = yield select()
    // mapStateToProps
    const state = yield select(state => state.number)
    console.log(state, "state")
  }
}