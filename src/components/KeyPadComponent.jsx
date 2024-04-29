import React, { Component } from 'react';

class KeyPadComponent extends Component { 
  render() {
    return (

      <div className="button">
        <button className="ml-9 mt-5 mb-4 border-solid rounded-lg bg-zinc-800 text-orange-500" name="(" onClick={e => this.props.onClick(e.target.name)}>(</button> 
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-orange-500" name="CE" onClick={e => this.props.onClick(e.target.name)}>CE</button>
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-orange-500" name=")" onClick={e => this.props.onClick(e.target.name)}>)</button>
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-orange-500" name="C" onClick={e => this.props.onClick(e.target.name)}>C</button><br/>


        <button className="ml-9 mb-4 border-solid rounded-lg bg-zinc-800 text-slate-50" name="1" onClick={e => this.props.onClick(e.target.name)}>1</button>
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-slate-50" name="2" onClick={e => this.props.onClick(e.target.name)}>2</button>
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-slate-50" name="3" onClick={e => this.props.onClick(e.target.name)}>3</button>
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-orange-500" name="+" onClick={e => this.props.onClick(e.target.name)}>+</button><br/>


        <button className="ml-9 mb-4 border-solid rounded-lg bg-zinc-800 text-slate-50" name="4" onClick={e => this.props.onClick(e.target.name)}>4</button>
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-slate-50" name="5" onClick={e => this.props.onClick(e.target.name)}>5</button>
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-slate-50" name="6" onClick={e => this.props.onClick(e.target.name)}>6</button>
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-orange-500" name="-" onClick={e => this.props.onClick(e.target.name)}>-</button><br/>

        <button className="ml-9 mb-4 border-solid rounded-lg bg-zinc-800 text-slate-50" name="7" onClick={e => this.props.onClick(e.target.name)}>7</button>
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-slate-50" name="8" onClick={e => this.props.onClick(e.target.name)}>8</button>
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-slate-50" name="9" onClick={e => this.props.onClick(e.target.name)}>9</button>
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-orange-500" name="*" onClick={e => this.props.onClick(e.target.name)}>x</button><br/>


        <button className="ml-9 mb-4 border-solid rounded-lg bg-zinc-800 text-orange-500" name="." onClick={e => this.props.onClick(e.target.name)}>.</button>
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-slate-50" name="0" onClick={e => this.props.onClick(e.target.name)}>0</button>
        <button className="ml-4 border-solid rounded-lg bg-orange-500 text-slate-50" name="=" onClick={e => this.props.onClick(e.target.name)}>=</button>
        <button className="ml-4 border-solid rounded-lg bg-zinc-800 text-orange-500" name="/" onClick={e => this.props.onClick(e.target.name)}>÷</button><br/>
    </div>
    )
  }
}

export default KeyPadComponent;