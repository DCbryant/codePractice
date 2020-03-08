import {applyMiddleware, createStore} from 'redux'
import reducer from './reducer'
import rootSaga from './sagas/index'
import createSagaMiddleware from 'redux-saga'

// 进程管理器
const sagaMiddleware = createSagaMiddleware()



const store =  applyMiddleware(sagaMiddleware)(createStore)(reducer)
sagaMiddleware.run(rootSaga)
export default store