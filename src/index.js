import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import App from './App';
import Login from './componentes/Login';

// Verifica se o usuário está autenticado
function autenticado() {
  return localStorage.getItem('auth-token')
}

ReactDOM.render(
  (
    <BrowserRouter>
      <div id="root">
        <div className="main">
          <Switch>
            <Route path='/' component={Login} exact />
            <Route path='/timeline' render={() => // render: substitui nesse caso o onEnter da v3
              autenticado() ?
                (<App />) :
                (<Redirect to="/?msg=Você precisa estar autenticado para acessar o endereço" />)
            } />
            <Route component={Login}></Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  ),
  document.getElementById('root')
);