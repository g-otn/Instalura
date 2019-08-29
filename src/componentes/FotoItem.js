import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class FotoAtualizacoes extends Component {

  constructor(props) {
    super(props)
    this.state = {
      likeada: this.props.foto.likeada
    }
  }

  curtir(e) {
    e.preventDefault()

    fetch(`https://instalura-api.herokuapp.com/api/fotos/${this.props.foto.id}/like`,
      {
        method: 'POST',
        headers: { // X-AUTH-TOKEN pode ser por parâmetro de URL ou de cabeçalho
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
          // like.login
        })
      })
      .catch(erro => {
        console.error(erro.message)
      })
  }

  render() {
    return (
      <section className="fotoAtualizacoes">
        <a onClick={this.curtir.bind(this)} className={'fotoAtualizacoes-like' + (this.state.likeada ? '-ativo' : '')}>Likar</a>
        <form className="fotoAtualizacoes-form">
          <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" />
          <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit" />
        </form>

      </section>
    )
  }

}

class FotoInfo extends Component {

  render() {
    return (
      <div className="foto-info">
        <div className="foto-info-likes">
          {
            this.props.foto.likers.map((liker, index) => {
              return (
                <span>
                  <Link to={'/timeline/' + liker.login}>
                    {liker.login}
                  </Link>
                  {index < this.props.foto.likers.length - 1 ? ', ' : ' '}
                </span>
              )
            })
          }
          {this.props.foto.likers.length > 0 ?
            (this.props.foto.likers.length == 1 ? 'curtiu' : 'curtiram') :
            'Nenhuma likeada'}
        </div>

        <p className="foto-info-legenda">
          <Link to={`/timeline/${this.props.foto.loginUsuario}`} className="foto-info-autor">{this.props.foto.loginUsuario}</Link>
          {' ' + this.props.foto.comentario}
        </p>

        <ul className="foto-info-comentarios">
          {
            this.props.foto.comentarios.map(comentario => {
              return (
                <li className="comentario" key={comentario.id}>
                  <Link to={`/timeline/${comentario.login}`} className="foto-info-autor">{comentario.login}</Link>
                  {' ' + comentario.texto}
                </li>
              )
            })
          }
          {this.props.foto.comentarios.length === 0 ? 'Nenhum comentário' : ''}
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