import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import FotoItem from './FotoItem'
import LogicaTimeline from '../logicas/LogicaTimeline'

export default class Timeline extends Component {

  constructor(props) {
    super(props)
    this.state = {
      login: '',
      fotos: []
    }
    this.logicaTimeline = new LogicaTimeline([])

    PubSub.subscribe('timeline', (topico, fotos) => {
      this.setState({ fotos })
    })
  }

  carregarFotos() {
    let urlPerfil = 'https://instalura-api.herokuapp.com/api/'
    if (this.state.login) // timeline do usuário logado ou pública?
      urlPerfil += 'public/fotos/' + this.state.login
    else
      urlPerfil += `fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`

    this.logicaTimeline.listar(urlPerfil)
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

  curtir(fotoId) {
    this.logicaTimeline.curtir(fotoId)
  }

  comentar(fotoId, comentario) {
    this.logicaTimeline.comentar(fotoId, comentario)
  }

  render() {
    const fotos = this.state.fotos.map(foto => {
      return (
        <FotoItem
          key={foto.id}
          foto={foto}
          curtir={this.curtir.bind(this)}
          comentar={this.comentar.bind(this)}
        />
      )
    })

    return (
      <div className="fotos container">
        {fotos}
      </div>
    )
  }

}