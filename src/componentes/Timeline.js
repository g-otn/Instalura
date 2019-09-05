import React, { Component } from 'react'
import FotoItem from './FotoItem'

export default class Timeline extends Component {

  constructor(props) {
    super(props)
    this.state = {
      login: '',
      fotos: []
    }
  }

  carregarFotos() {
    let urlPerfil = 'https://instalura-api.herokuapp.com/api/'

    if (this.state.login) // timeline do usuário logado ou pública?
      urlPerfil += 'public/fotos/' + this.state.login
    else
      urlPerfil += `fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`

    const listaFixa = [{ "urlPerfil": "https://s3.amazonaws.com/caelum-online-public/react-native-parte-2/images/adittional-resources/profile-photo-alberto.jpg", "loginUsuario": "alots", "horario": "05/09/2019 11:14", "urlFoto": "https://s3.amazonaws.com/caelum-online-public/react-native-parte-2/images/adittional-resources/photo-1.jpg", "id": 1, "likeada": false, "likers": [{ "login": "vitor" }, { "login": "alots" }], "comentarios": [{ "login": "alots", "texto": "bunito", "id": 2 }], "comentario": "Legenda da foto" }, { "urlPerfil": "https://s3.amazonaws.com/caelum-online-public/react-native-parte-2/images/adittional-resources/profile-photo-alberto.jpg", "loginUsuario": "alots", "horario": "05/09/2019 11:14", "urlFoto": "https://s3.amazonaws.com/caelum-online-public/react-native-parte-2/images/adittional-resources/photo-2.jpg", "id": 2, "likeada": false, "likers": [{ "login": "vitor" }], "comentarios": [{ "login": "vitor", "texto": "wadsad", "id": 3 }], "comentario": "Legenda da foto" }]

    this.props.store.dispatch({ type: 'LISTAGEM', fotos: listaFixa })

    //this.props.store.listar(urlPerfil)
  }

  componentDidMount() {
    this.props.store.subscribe(() => {
      console.log(this.props.store.getState())
      this.setState({ fotos: this.props.store.getState() })
    })
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
    this.props.store.curtir(fotoId)
  }

  comentar(fotoId, comentario) {
    this.props.store.comentar(fotoId, comentario)
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