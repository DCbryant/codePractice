import {put,take, takeEvery, call, delay} from './redux-saga/effects';
import * as types from './store/action-types';

// const delay = ms => new Promise((resolve,reject) => {
//     setTimeout(() => {
//         resolve();
//     },ms);
// });

export function* increment() {
  // yield call(delay, 1000)
  yield delay(1000)
  yield put({type:types.INCREMENT});
}

export function* rootSaga() {
  yield takeEvery(types.INCREMENT_ASYNC,increment);
}