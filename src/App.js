import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ResultComponent from './components/ResultComponent';
import KeyPadComponent from './components/KeyPadComponent';

const OPERATORS = new Set(['+', '-', '*', '/', '%']);

const isOperator = (value) => OPERATORS.has(value);

const tokenizeExpression = (expression) => {
  const tokens = [];
  let currentNumber = '';

  for (const char of expression) {
    if ('0123456789.'.includes(char)) {
      currentNumber += char;
      continue;
    }

    if (currentNumber) {
      tokens.push(currentNumber);
      currentNumber = '';
    }

    if (isOperator(char) || char === '(' || char === ')') {
      tokens.push(char);
    } else {
      throw new Error('Invalid character');
    }
  }

  if (currentNumber) {
    tokens.push(currentNumber);
  }

  return tokens;
};

const toRpn = (tokens) => {
  const output = [];
  const operators = [];
  const precedence = { 'u-': 3, '*': 2, '/': 2, '%': 2, '+': 1, '-': 1 };
  const associativity = { 'u-': 'right', '*': 'left', '/': 'left', '%': 'left', '+': 'left', '-': 'left' };

  tokens.forEach((token, index) => {
    if (!Number.isNaN(Number(token))) {
      output.push(token);
      return;
    }

    if (token === '(') {
      operators.push(token);
      return;
    }

    if (token === ')') {
      while (operators.length && operators[operators.length - 1] !== '(') {
        output.push(operators.pop());
      }

      if (operators[operators.length - 1] !== '(') {
        throw new Error('Mismatched parentheses');
      }

      operators.pop();
      return;
    }

    let currentOperator = token;
    const previousToken = tokens[index - 1];
    const isUnaryMinus =
      token === '-' &&
      (index === 0 || previousToken === '(' || isOperator(previousToken));

    if (isUnaryMinus) {
      currentOperator = 'u-';
    }

    while (operators.length) {
      const topOperator = operators[operators.length - 1];

      if (topOperator === '(') {
        break;
      }

      const currentPrecedence = precedence[currentOperator];
      const topPrecedence = precedence[topOperator];
      const shouldPopLeft = associativity[currentOperator] === 'left' && currentPrecedence <= topPrecedence;
      const shouldPopRight = associativity[currentOperator] === 'right' && currentPrecedence < topPrecedence;

      if (!shouldPopLeft && !shouldPopRight) {
        break;
      }

      output.push(operators.pop());
    }

    operators.push(currentOperator);
  });

  while (operators.length) {
    const operator = operators.pop();

    if (operator === '(') {
      throw new Error('Mismatched parentheses');
    }

    output.push(operator);
  }

  return output;
};

const evaluateRpn = (tokens) => {
  const stack = [];

  tokens.forEach((token) => {
    if (!Number.isNaN(Number(token))) {
      stack.push(Number(token));
      return;
    }

    if (token === 'u-') {
      if (stack.length < 1) {
        throw new Error('Malformed expression');
      }

      stack.push(-stack.pop());
      return;
    }

    if (stack.length < 2) {
      throw new Error('Malformed expression');
    }

    const right = stack.pop();
    const left = stack.pop();

    switch (token) {
      case '+':
        stack.push(left + right);
        break;
      case '-':
        stack.push(left - right);
        break;
      case '*':
        stack.push(left * right);
        break;
      case '/':
        if (right === 0) {
          throw new Error('Cannot divide by zero');
        }
        stack.push(left / right);
        break;
      case '%':
        if (right === 0) {
          throw new Error('Cannot divide by zero');
        }
        stack.push(left % right);
        break;
      default:
        throw new Error('Unknown operator');
    }
  });

  if (stack.length !== 1 || !Number.isFinite(stack[0])) {
    throw new Error('Malformed expression');
  }

  return stack[0];
};

const evaluateExpression = (expression) => {
  const normalized = expression.replace(/\s+/g, '');

  if (!normalized) {
    return '';
  }

  const tokens = tokenizeExpression(normalized);
  const rpn = toRpn(tokens);
  const value = evaluateRpn(rpn);

  if (!Number.isFinite(value)) {
    throw new Error('Invalid result');
  }

  return Number(value.toFixed(10)).toString();
};

const OPERATION_NAMES = {
  '+': 'addition',
  '-': 'subtraction',
  '*': 'multiplication',
  '/': 'division',
  '%': 'modulo',
};

const detectOperations = (expression) => {
  const uniqueOperations = new Set();

  expression.split('').forEach((char) => {
    if (OPERATION_NAMES[char]) {
      uniqueOperations.add(OPERATION_NAMES[char]);
    }
  });

  return Array.from(uniqueOperations);
};

const buildInsight = (expression, result) => {
  const operations = detectOperations(expression);
  const hasParentheses = expression.includes('(') || expression.includes(')');
  const hasDecimal = expression.includes('.');

  if (!expression) {
    return 'Start typing to see a quick explanation of the math you are building.';
  }

  if (!result) {
    if (hasParentheses) {
      return 'Parentheses group part of the expression so that section is solved first.';
    }

    if (hasDecimal) {
      return 'Decimals let you work with values smaller than 1, like money or measurements.';
    }

    if (operations.length === 0) {
      return 'This is a plain number so far. Add an operator to turn it into a calculation.';
    }

    if (operations.length === 1) {
      return `This expression uses ${operations[0]}. Finish it and press "=" to solve it.`;
    }

    return `This combines ${operations.join(', ')}. The calculator will follow normal order of operations.`;
  }

  if (hasParentheses) {
    return `${expression} = ${result}. The grouped part inside parentheses was solved before the rest.`;
  }

  if (operations.includes('multiplication') || operations.includes('division') || operations.includes('modulo')) {
    return `${expression} = ${result}. Multiplication, division, and modulo are handled before addition or subtraction.`;
  }

  if (operations.length > 0) {
    return `${expression} = ${result}. This result comes from ${operations.join(' and ')}.`;
  }

  return `${expression} stays ${result} because there was no operator to evaluate.`;
};

const App = () => {
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState('Ready');
  const [historyItems, setHistoryItems] = useState([]);

  const displayValue = useMemo(() => (expression ? expression : '0'), [expression]);
  const activeInsight = useMemo(() => {
    if (history.endsWith('=') && historyItems[0]?.result === expression) {
      return historyItems[0].insight;
    }

    return buildInsight(expression, '');
  }, [expression, history, historyItems]);

  const reset = useCallback(() => {
    setExpression('');
    setHistory('Cleared');
  }, []);

  const backspace = useCallback(() => {
    setExpression((current) => current.slice(0, -1));
    setHistory('Edited');
  }, []);

  const appendValue = useCallback((value) => {
    setExpression((current) => {
      const lastChar = current.slice(-1);

      if (/^\d$/.test(value)) {
        return `${current}${value}`;
      }

      if (value === '.') {
        const currentSegment = current.split(/[-+*/%()]/).pop() || '';

        if (currentSegment.includes('.')) {
          return current;
        }

        if (!current || isOperator(lastChar) || lastChar === '(') {
          return `${current}0.`;
        }

        return `${current}.`;
      }

      if (value === '(') {
        if (!current) {
          return '(';
        }

        if (/\d/.test(lastChar) || lastChar === ')') {
          return `${current}*(`;
        }

        return `${current}(`;
      }

      if (value === ')') {
        const openCount = (current.match(/\(/g) || []).length;
        const closeCount = (current.match(/\)/g) || []).length;

        if (!current || openCount <= closeCount || isOperator(lastChar) || lastChar === '(') {
          return current;
        }

        return `${current})`;
      }

      if (isOperator(value)) {
        if (!current) {
          return value === '-' ? '-' : current;
        }

        if (isOperator(lastChar)) {
          return `${current.slice(0, -1)}${value}`;
        }

        if (lastChar === '(') {
          return value === '-' ? `${current}-` : current;
        }

        return `${current}${value}`;
      }

      return `${current}${value}`;
    });

    setHistory('Typing...');
  }, []);

  const calculate = useCallback(() => {
    try {
      const result = evaluateExpression(expression);

      if (result === '') {
        return;
      }

      setHistory(`${expression} =`);
      setHistoryItems((current) => [
        {
          expression,
          result,
          insight: buildInsight(expression, result),
          id: `${Date.now()}-${current.length}`,
        },
        ...current,
      ].slice(0, 8));
      setExpression(result);
    } catch (error) {
      setHistory(error.message);
      setExpression('');
    }
  }, [expression]);

  const reuseHistoryItem = useCallback((itemExpression) => {
    setExpression(itemExpression);
    setHistory('Loaded from history');
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryItems([]);
    setHistory('History cleared');
  }, []);

  const handleInput = useCallback((value) => {
    if (value === '=') {
      calculate();
      return;
    }

    if (value === 'C') {
      reset();
      return;
    }

    if (value === 'CE') {
      backspace();
      return;
    }

    appendValue(value);
  }, [appendValue, backspace, calculate, reset]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      if (/^\d$/.test(key) || ['+', '-', '*', '/', '%', '.', '(', ')'].includes(key)) {
        event.preventDefault();
        handleInput(key);
        return;
      }

      if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
        return;
      }

      if (key === 'Backspace') {
        event.preventDefault();
        backspace();
        return;
      }

      if (key === 'Escape' || key === 'Delete') {
        event.preventDefault();
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [backspace, calculate, handleInput, reset]);

  return (
    <main className="app-shell">
      <section className="calculator-card">
        <div className="card-copy">
          <p className="eyebrow">Simple React Calculator</p>
          <p className="supporting-text">
            Try the mouse or your keyboard. Use <span>Esc</span> to clear and <span>Backspace</span> to edit.
          </p>
        </div>

        <div className="calculator-layout">
          <div className="calculator-body">
            <ResultComponent history={history} result={displayValue} />
            <section className="insight-panel">
              <p className="panel-label">Quick Trivia</p>
              <p className="panel-copy">{activeInsight}</p>
            </section>
            <KeyPadComponent onClick={handleInput} />
          </div>

          <aside className="history-panel">
            <div className="history-header">
              <div>
                <p className="panel-label">History</p>
                <p className="history-subtitle">Recent calculations and mini explanations.</p>
              </div>
              {historyItems.length > 0 && (
                <button className="history-clear" type="button" onClick={clearHistory}>
                  Clear
                </button>
              )}
            </div>

            {historyItems.length === 0 ? (
              <p className="history-empty">Your solved expressions will show up here.</p>
            ) : (
              <div className="history-list">
                {historyItems.map((item) => (
                  <button
                    key={item.id}
                    className="history-item"
                    type="button"
                    onClick={() => reuseHistoryItem(item.expression)}
                  >
                    <span className="history-expression">{item.expression}</span>
                    <span className="history-result">= {item.result}</span>
                    <span className="history-insight">{item.insight}</span>
                  </button>
                ))}
              </div>
            )}
          </aside>
        </div>

        <footer className="card-footer">
          <a href="https://aldrich27dev.github.io/aldrich" target="_blank" rel="noreferrer">
            Portfolio
          </a>
          <span>Aldrich Naag</span>
        </footer>
      </section>
    </main>
  );
};

export default App;
