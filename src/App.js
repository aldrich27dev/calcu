import React, { Component } from 'react';
import './index.css';
import ResultComponent from './components/ResultComponent';
import KeyPadComponent from './components/KeyPadComponent';

class App extends Component {
  state = {
    result: ""
  }

  onClick = button => {
    if(button === "=") {
      this.calculate();
    }

    else if(button === "C") {
      this.reset();
    }

    else if(button === "CE") {
      this.backspace();
    }

    else {
      this.setState({
        result: this.state.result + button
      })
    }
  };

  calculate = () => {
    var checkResult = ''
    if(this.state.result.includes('--')) {
      checkResult = this.state.result.replace('--', '+')
    } else {
      checkResult = this.state.result;
    }

    try {
      this.setState({
        result: (eval(checkResult) || "") + ""
      })
    } catch(e) {
      this.setState({
        result: "error"
      })
    }
  };

reset = () => {
    this.setState({
      result: ""
    })
  };

  backspace = () => {
    this.setState({
        result: this.state.result.slice(0, -1)
    })
  };

  render() {
    return (
      <div>
       <div className=" text-center absolute right-0 bg-orange-500 border-solid rounded-lg text-slate-50 mr-5 h-10 pt-2 w-40"> <a href="https://aldrich27dev.github.io/aldrich"> Back to Portfolio </a>
          </div>
          <div className="ml-9 absolute inset-x-0 bottom-20 text-slate-50 text-opacity-20"> © Aldrich Naag </div>
        <div className="calculator-body">
          <h1 className="text-slate-50 ml-7 mt-9">Calculator</h1>
          <ResultComponent result={this.state.result} />
          <KeyPadComponent onClick={this.onClick} />
        </div>
      </div>
    )
  }
}

export default App;