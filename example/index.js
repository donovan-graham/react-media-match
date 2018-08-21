import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const root = document.getElementById('app');
const render = Root => ReactDOM.render(<Root />, root);

if (module.hot) {
  module.hot.accept('./App', function() {
    const HotApp = require('./App').default;
    render(HotApp);
  });
}

render(App);
