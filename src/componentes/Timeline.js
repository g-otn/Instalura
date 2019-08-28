import React, { Component } from 'react'
import FotoItem from './FotoItem'
import '../css/timeline.css'

export default class Timeline extends Component {

  constructor(props) {
    super(props)
    this.state = {
      login: '',
      fotos: []
    }
  }

  carregarFotos() {
    let uri = 'https://instalura-api.herokuapp.com/api/'
    if (this.state.login) // timeline do usuário logado ou pública?
      uri += 'public/fotos/' + this.state.login
    else
      uri += `fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`

    fetch(uri)
      .then(response => response.json())
      .then(fotos => {
        this.setState({ fotos: fotos.error ? [] : fotos })
        window.scrollTo(0, 0);
      })
  }

  componentDidMount() {
    this.carregarFotos()
  }
  
  // Atualiza a página quando um link para outra timeline for clicado
  // ---------- 
  // Referências
  // https://pt-br.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
  // https://stackoverflow.com/a/48139367
  // https://stackoverflow.com/a/48139357  
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.paginaUsuario !== prevState.login)
      return { login: nextProps.paginaUsuario }
    else
      return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.paginaUsuario !== this.state.login)
      this.carregarFotos()
  }
  // ----------

  render() {
    return (
      <div className="fotos container">
        {this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} />)}
      </div>
    )
  }

}