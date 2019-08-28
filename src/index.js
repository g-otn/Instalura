import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect, matchPath } from 'react-router-dom'

import './css/reset.css';
import './css/timeline.css';
import './css/login.css';

import App from './App';
import Login from './componentes/Login';

// Verifica se o usuário está autenticado
function autenticado() {
  return localStorage.getItem('auth-token') // null?
}

function acessarTimeline(nextState) {
  let paginaUsuario = nextState.match.params.paginaUsuario
  if (!autenticado() && !paginaUsuario)
    return (<Redirect to="/?msg=Você precisa estar autenticado para acessar o endereço" />)
  else
    return (<App paginaUsuario={nextState.match.params.paginaUsuario} />)
}

function logout() {
  localStorage.removeItem('auth-token')
  return (<Redirect to="/" />)
}

ReactDOM.render(
  (
    <BrowserRouter>
      <div id="root">
        <div className="main">
          <Switch>
            <Route path='/' component={Login} exact />
            <Route path='/timeline/:paginaUsuario?' render={acessarTimeline} /> {/* render: substitui o onEnter da v3 */}
            <Route path='/logout' render={logout} />
            {/*<Route component={Login}/>*/}
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  ),
  document.getElementById('root')
);