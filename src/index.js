import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import App from './App';
import Login from './componentes/Login';

ReactDOM.render(
  (
    <BrowserRouter>
      <div id="root">
        <div className="main">
          <Switch>
            <Route path='/' component={Login} exact/>
            <Route path='/timeline' component={App}/>
            <Route component={Login}></Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  ),
  document.getElementById('root')
);