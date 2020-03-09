import {put,take} from './redux-saga/effects';
import * as types from './store/action-types';

export function* increment() {
  yield put({type:types.INCREMENT});
}

export function* rootSaga() {
    for (let i=0;i<3;i++){
      // 接受普通对象
        const res = yield take(types.INCREMENT_ASYNC);
        console.log(res, 'res')
        // yield put({type:types.INCREMENT});
        // yield  接受迭代器
        yield increment()
    }
    console.log('已经达到最大值');
}