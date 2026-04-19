import React from 'react';

const BUTTONS = [
  { label: 'C', value: 'C', variant: 'accent' },
  { label: 'CE', value: 'CE', variant: 'accent' },
  { label: '(', value: '(', variant: 'operator' },
  { label: ')', value: ')', variant: 'operator' },
  { label: '7', value: '7', variant: 'number' },
  { label: '8', value: '8', variant: 'number' },
  { label: '9', value: '9', variant: 'number' },
  { label: '/', value: '/', variant: 'operator' },
  { label: '4', value: '4', variant: 'number' },
  { label: '5', value: '5', variant: 'number' },
  { label: '6', value: '6', variant: 'number' },
  { label: 'x', value: '*', variant: 'operator' },
  { label: '1', value: '1', variant: 'number' },
  { label: '2', value: '2', variant: 'number' },
  { label: '3', value: '3', variant: 'number' },
  { label: '-', value: '-', variant: 'operator' },
  { label: '0', value: '0', variant: 'number wide' },
  { label: '.', value: '.', variant: 'number' },
  { label: '+', value: '+', variant: 'operator' },
  { label: '=', value: '=', variant: 'equals' },
];

const KeyPadComponent = ({ onClick }) => (
  <div className="keypad-grid">
    {BUTTONS.map((button) => (
      <button
        key={`${button.label}-${button.value}`}
        className={`calc-button ${button.variant}`}
        name={button.value}
        onClick={(event) => onClick(event.currentTarget.name)}
        type="button"
      >
        {button.label}
      </button>
    ))}
  </div>
);

export default KeyPadComponent;
