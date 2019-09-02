import React, { Component } from 'react'
import Header from './componentes/Header'
import Timeline from './componentes/Timeline'
import TimelineStore from './logicas/TimelineStore'

const timelineStore = new TimelineStore()

class App extends Component {
  
  render() {
    return (
      <div>
        <Header />
        <Timeline paginaUsuario={this.props.paginaUsuario} store={timelineStore} />
      </div>
    )
  }

}

export default App