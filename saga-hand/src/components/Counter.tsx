import React, { Component } from 'react';
import {connect} from 'react-redux';
import {CounterState} from '../store/reducer'
import actions from '../store/actions'
type Props = CounterState & typeof actions

class Counter extends Component<Props> {
  render() {
    return (
      <div>
        <p>{this.props.number}</p>
        <button onClick={this.props.increment}>+ 1</button>
        <button onClick={this.props.asyncIncrement}>异步+ 1</button>
      </div>
    )
  }
}
const mapStateToProps = (state: CounterState): CounterState => state

export default connect(
  mapStateToProps,
  actions
)(Counter)

