import React, { Component } from 'react';

class ResultComponent extends Component {
  render() {
    let { result } = this.props;

    return (
      <div className="result ml-5">
        <p>{ result }</p>
      </div>
    )
  }
}

export default ResultComponent;