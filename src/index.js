import React from 'react';
import ReactDOM from 'react-dom';
import App from './scripts/App';
import './css/index.css';

ReactDOM.render(
  <App chrome={chrome}/>, // eslint-disable-line no-undef
  document.getElementById('root')
);
