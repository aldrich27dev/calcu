import React from 'react';

const formatDisplay = (value) => value.replace(/\*/g, 'x');

const ResultComponent = ({ history, result }) => (
  <div className="result">
    <p className="result-history">{history}</p>
    <p className="result-value">{formatDisplay(result)}</p>
  </div>
);

export default ResultComponent;
