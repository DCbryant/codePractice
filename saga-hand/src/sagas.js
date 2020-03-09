import {put,take, takeEvery, call, delay, cps} from './redux-saga/effects';
import * as types from './store/action-types';

// const delay = ms => new Promise((resolve,reject) => {
//     setTimeout(() => {
//         resolve();
//     },ms);
// });

const cbDelay = (ms,callback)=>{
  setTimeout(() => {
      callback('ok');
  },ms);
}

export function* increment() {
  let data = yield cps(cbDelay,1000);
  console.log(data);
  yield put({type:types.INCREMENT});
}

// export function* increment() {
//   // yield call(delay, 1000)
//   yield delay(1000)
//   yield put({type:types.INCREMENT});
// }

export function* rootSaga() {
  yield takeEvery(types.INCREMENT_ASYNC,increment);
}