import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class FotoAtualizacoes extends Component {

  render() {
    return (
      <section className="fotoAtualizacoes">
        <a href="#" className="fotoAtualizacoes-like">Likar</a>
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
            this.props.foto.likers.map(liker => {
              return (<Link to={liker.login}>{liker.login}, </Link>)
            })
          }
          {this.props.foto.likers.length > 0 ? 'curtiram' : 'Nenhuma curtida'}
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
        <FotoAtualizacoes />
      </div>
    )
  }

}