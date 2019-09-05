import React, { Component } from 'react'
import Header from './componentes/Header'
import Timeline from './componentes/Timeline'
import { createStore } from 'redux'
import { timeline } from './reducers/timeline'

const store = createStore(timeline)

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