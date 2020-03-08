import {applyMiddleware, createStore} from 'redux'
import reducer from './reducer'
import helloSaga from './rootSaga'
import createSagaMiddleware from 'redux-saga'

// 进程管理器
const sagaMiddleware = createSagaMiddleware()



const store =  applyMiddleware(sagaMiddleware)(createStore)(reducer)
sagaMiddleware.run(helloSaga)
export default store