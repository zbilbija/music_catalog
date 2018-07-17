import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter } from 'react-router-dom';
import history from './history/history'

ReactDOM.render(
<BrowserRouter history={history}>
    <App />
</BrowserRouter>,
document.getElementById('root'));
registerServiceWorker();
