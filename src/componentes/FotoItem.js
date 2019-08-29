import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PubSub from 'pubsub-js'

class FotoAtualizacoes extends Component {

  constructor(props) {
    super(props)
    this.state = {
      likeada: this.props.foto.likeada
    }
  }

  comentar(e) {
    e.preventDefault()

    fetch(`https://instalura-api.herokuapp.com/api/fotos/${this.props.foto.id}/comment`,
      {
        method: 'POST',
        headers: { // https://stackoverflow.com/a/45753864
          'X-AUTH-TOKEN': localStorage.getItem('auth-token'), // pode ser por parâmetro de URL ou de cabeçalho
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          texto: this.comentario.value
        })
      }
    )
      .then(response => {
        if (response.ok)
          return response.json()
        else
          throw new Error('Não foi possível comentar a foto (' + response.status + ')')
      })
      .then(comentario => {
        this.comentario.value = ''
        PubSub.publish('atualiza-comentarios',
          {
            fotoId: this.props.foto.id,
            comentario // shorthand property
          }
        )
      })
      .catch(erro => {
        console.error(erro.message)
      })
  }

  curtir(e) {
    e.preventDefault()

    fetch(`https://instalura-api.herokuapp.com/api/fotos/${this.props.foto.id}/like`,
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
        this.setState({
          likeada: !this.state.likeada
        })
        PubSub.publish('atualiza-liker',
          {
            fotoId: this.props.foto.id,
            like
          }
        )
      })
      .catch(erro => {
        console.error(erro.message)
      })
  }

  render() {
    return (
      <section className="fotoAtualizacoes">
        <div onClick={this.curtir.bind(this)} className={'fotoAtualizacoes-like' + (this.state.likeada ? '-ativo' : '')}>Likar</div>
        <form className="fotoAtualizacoes-form" onSubmit={this.comentar.bind(this)}>
          <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={input => this.comentario = input} />
          <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit" />
        </form>

      </section>
    )
  }

}

class FotoInfo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      likers: this.props.foto.likers,
      comentarios: this.props.foto.comentarios
    }

    PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {
      if (infoLiker.fotoId !== this.props.foto.id)
        return

      const likerExistente = this.state.likers.find(liker => liker.login === infoLiker.like.login)

      if (!likerExistente) {
        // Adiciona o novo liker na lista de likers
        const novosLikers = this.state.likers.concat(infoLiker.like)
        this.setState({
          likers: novosLikers
        })
      } else {
        // Remove o novo liker da lista de likers
        const novosLikers = this.state.likers.filter(liker => liker.login !== infoLiker.like.login)
        this.setState({ likers: novosLikers })
      }
    })

    PubSub.subscribe('atualiza-comentarios', (topico, infoComentario) => {
      if (infoComentario.fotoId !== this.props.foto.id)
        return
      
      // Adiciona o novo comentário na lista de comentários
      const novosComentarios = this.state.comentarios.concat(infoComentario.comentario)
      this.setState({
        comentarios: novosComentarios
      })
    })


  }

  render() {
    return (
      <div className="foto-info">
        <div className="foto-info-likes">
          {
            this.state.likers.map((liker, index) => {
              return (
                <span key={index}>
                  <Link to={'/timeline/' + liker.login}>
                    {liker.login}
                  </Link>
                  {index < this.state.likers.length - 1 ? ', ' : ' '}
                </span>
              )
            })
          }
          {this.state.likers.length > 0 ?
            (this.state.likers.length === 1 ? 'curtiu' : 'curtiram') :
            'Nenhuma curtida'}
        </div>

        <p className="foto-info-legenda">
          <Link to={`/timeline/${this.props.foto.loginUsuario}`} className="foto-info-autor">{this.props.foto.loginUsuario}</Link>
          {' ' + this.props.foto.comentario}
        </p>

        <ul className="foto-info-comentarios">
          {
            this.state.comentarios.map(comentario => {
              return (
                <li className="comentario" key={comentario.id}>
                  <Link to={`/timeline/${comentario.login}`} className="foto-info-autor">{comentario.login}</Link>
                  {' ' + comentario.texto}
                </li>
              )
            })
          }
          {this.state.comentarios.length === 0 ? 'Nenhum comentário' : ''}
        </ul>
      </div>
    )
  }

}

class FotoHeader extends Component {

  render() {
    return (
      <header className="foto-header">
        <figure className="foto-usuario">
          <img src={this.props.foto.urlPerfil} alt="foto do usuario" />
          <figcaption className="foto-usuario">
            <Link to={`/timeline/${this.props.foto.loginUsuario}`}>{this.props.foto.loginUsuario}</Link>
          </figcaption>
        </figure>
        <time className="foto-data">{this.props.foto.horario}</time>
      </header>
    )
  }

}

export default class FotoItem extends Component {

  render() {
    return (
      <div className="foto">
        <FotoHeader foto={this.props.foto} />
        <img alt="foto" className="foto-src" src={this.props.foto.urlFoto} />
        <FotoInfo foto={this.props.foto} />
        <FotoAtualizacoes foto={this.props.foto} />
      </div>
    )
  }

}