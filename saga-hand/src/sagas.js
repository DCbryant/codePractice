import {put,take, takeEvery} from './redux-saga/effects';
import * as types from './store/action-types';

export function* increment() {
  yield put({type:types.INCREMENT});
}

export function* rootSaga() {
  yield takeEvery(types.INCREMENT_ASYNC,increment);
}