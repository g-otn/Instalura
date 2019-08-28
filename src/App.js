import React, { Component } from 'react'
import Header from './componentes/Header'
import Timeline from './componentes/Timeline'
import './css/reset.css'
import './css/reset.css'

class App extends Component {
  
  render() {
    return (
      <div>
        <Header />
        <Timeline paginaUsuario={this.props.paginaUsuario} />
      </div>
    )
  }

}

export default App