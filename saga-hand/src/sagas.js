import {put,take} from './redux-saga/effects';
import * as types from './store/action-types';

export function* rootSaga() {
    for (let i=0;i<3;i++){
        const res = yield take(types.INCREMENT_ASYNC);
        console.log(res, 'res')
        yield put({type:types.INCREMENT});
    }
    console.log('已经达到最大值');
}