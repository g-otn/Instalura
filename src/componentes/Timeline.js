import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import FotoItem from './FotoItem'

export default class Timeline extends Component {

  constructor(props) {
    super(props)
    this.state = {
      login: '',
      fotos: []
    }

    PubSub.subscribe('timeline', (topico, fotos) => {
      console.log(fotos)
      this.setState({ fotos })
      window.scrollTo(0, 0);
    })
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

  curtir(fotoId) {
    fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like`,
      {
        method: 'POST',
        headers: {
          'X-AUTH-TOKEN': localStorage.getItem('auth-token')
        }
      }
    )
      .then(response => {
        if (response.ok)
          return response.json()
        else
          throw new Error('Não foi possível curtir a foto (' + response.status + ')')
      })
      .then(like => {
        PubSub.publish('atualiza-liker',
          {
            fotoId: fotoId,
            like // shorthand property
          }
        )
      })
      .catch(erro => {
        console.error(erro.message)
      })
  }

  comentar(fotoId, comentarioASerEnviado) {
    fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/comment`,
      {
        method: 'POST',
        headers: { // https://stackoverflow.com/a/45753864
          'X-AUTH-TOKEN': localStorage.getItem('auth-token'), // pode ser por parâmetro de URL ou de cabeçalho
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          texto: comentarioASerEnviado
        })
      }
    )
      .then(response => {
        if (response.ok)
          return response.json()
        else
          throw new Error('Não foi possível comentar a foto (' + response.status + ')')
      })
      .then(comentarioPostado => {
        PubSub.publish('atualizar-comentarios',
          {
            fotoId: fotoId,
            comentario: comentarioPostado
          }
        )
      })
      .catch(erro => {
        console.error(erro.message)
      })
  }

  render() {
    const fotos = this.state.fotos.map(foto => {
      return (
        <FotoItem
          key={foto.id}
          foto={foto}
          curtir={this.curtir}
          comentar={this.comentar}
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