import React, { Component } from 'react'
import FotoItem from './FotoItem'
import '../css/timeline.css'

export default class Timeline extends Component {

  constructor() {
    super()
    this.state = {
      fotos: []
    }
  }

  componentDidMount() {
    fetch(`https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`) // alots, rafael ou vitor
      .then(response => response.json())
      .then(fotos => {
        console.log(fotos)
        this.setState({ fotos: fotos })
      })
  }

  render() {
    return (
      <div className="fotos container">
        {
          this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} />)
        }
      </div>
    )
  }

}