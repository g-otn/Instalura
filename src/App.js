import React, { Component } from 'react'
import Header from './componentes/Header'
import Timeline from './componentes/Timeline'
import TimelineStore from './logicas/TimelineStore'
import { createStore } from 'redux'

const timelineStore = new TimelineStore()

function timeline(state = [], action) {
  if (action.type === 'LISTAGEM') {
    return action.fotos
  }

  return state
}

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