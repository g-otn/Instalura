import React, { Component } from 'react'
import Header from './componentes/Header'
import Timeline from './componentes/Timeline'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk';
import { timeline } from './reducers/timeline'

const store = createStore(timeline, applyMiddleware(thunkMiddleware))

class App extends Component {

  render() {
    return (
      <div>
        <Header />
        <Timeline paginaUsuario={this.props.paginaUsuario} store={store} />
      </div>
    )
  }

}

export default App