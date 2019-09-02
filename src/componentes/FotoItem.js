import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class FotoAtualizacoes extends Component {

  comentar(e) {
    e.preventDefault()
    this.props.comentar(this.props.foto.id, this.comentario.value);
    this.comentario.value = ''
  }

  curtir(e) {
    e.preventDefault()
    this.props.curtir(this.props.foto.id)
  }

  render() {
    return (
      <section className="fotoAtualizacoes">
        <div onClick={this.curtir.bind(this)} className={'fotoAtualizacoes-like' + (this.props.foto.likeada ? '-ativo' : '')}>Likar</div>
        <form className="fotoAtualizacoes-form" onSubmit={this.comentar.bind(this)}>
          <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={input => this.comentario = input} />
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
                <span key={index}>
                  <Link to={'/timeline/' + liker.login}>
                    {liker.login}
                  </Link>
                  {index < this.props.foto.likers.length - 1 ? ', ' : ' '}
                </span>
              )
            })
          }
          {this.props.foto.likers.length > 0 ?
            (this.props.foto.likers.length === 1 ? 'curtiu' : 'curtiram') :
            'Nenhuma curtida'}
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
        <FotoAtualizacoes {...this.props} />
      </div>
    )
  }

}