import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import { Link } from 'react-router-dom'

export default class Header extends Component {

  pesquisar(e) {
    e.preventDefault()

    fetch(`https://instalura-api.herokuapp.com/api/public/fotos/${this.inputPesquisa.value}`)
      .then(response => {
        if (response.ok)
          return response.json()
        else
          throw new Error('Não foi possível pesquisar (' + response.status + ')')
      })
      .then(fotos => {
        PubSub.publish('timeline', fotos)
      })
      .catch(erro => {
        console.error(erro.message)
      })
  }

  render() {
    return (
      <header className="header container">
        <h1 className="header-logo">
          Instalura
          </h1>

        <form className="header-busca" onSubmit={this.pesquisar.bind(this)}>
          <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" ref={input => this.inputPesquisa = input}/>
          <input type="submit" value="Buscar" className="header-busca-submit" />
        </form>

        <nav>
          <ul className="header-nav">
            <li className="header-nav-item">
              <Link to="/timeline">♡</Link>
              <Link to="/logout">×</Link>
            </li>
          </ul>
        </nav>
      </header>
    )
  }

}