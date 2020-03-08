import store from './store';
import React from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import Counter from './components/Counter'

ReactDOM.render(
  <Provider store={store}>
    <Counter />
  </Provider>,
  document.getElementById('root')
)