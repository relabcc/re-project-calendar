import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

const ROOT_ELE = document.getElementById('root');

ROOT_ELE.style.setProperty('height', '100%');

ReactDOM.render(<App />, ROOT_ELE);
registerServiceWorker();
