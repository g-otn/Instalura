import React, { Component } from 'react'
import FotoItem from './FotoItem'
import '../css/timeline.css'

export default class Timeline extends Component {

  constructor(props) {
    super(props)
    console.log(props, this.props)
    this.state = {
      fotos: []
    }
  }

  componentDidMount() {
    let uri = 'https://instalura-api.herokuapp.com/api/'
    if (this.props.paginaUsuario) // timeline do usuário logado ou pública?
      uri += 'public/fotos/' + this.props.paginaUsuario
    else
      uri += `fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`
    
    fetch(uri)
      .then(response => response.json())
      .then(fotos => {
        
        this.setState({ fotos: fotos.error ? [] : fotos })
      })
  }

  render() {
    return (
      <div className="fotos container">
        {this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} />)}
      </div>
    )
  }

}