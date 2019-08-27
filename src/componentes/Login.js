import React, { Component } from 'react'
import qs from 'qs'
import '../css/login.css'

export default class Login extends Component {

  constructor(props) {
    super(props)
    let parametros = qs.parse(props.location.search, {
      ignoreQueryPrefix: true // https://stackoverflow.com/a/50017091
    })
    this.state = { msg: parametros.msg } // this.props.location.query.msg (https://stackoverflow.com/a/43220620)
  }

  enviar(event) {
    event.preventDefault()
    this.setState({ msg: '' }) // Limpa o <span> para ele reaparecer caso dê erro

    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({
        login: this.login.value,
        senha: this.senha.value
      }),
      headers: new Headers({
        'Content-type': 'application/json'
      })
    }

    fetch('https://instalura-api.herokuapp.com/api/public/login', requestInfo)
      .then(response => {
        if (response.ok) {
          return response.text()
        } else {
          switch (response.status) {
            case 401: // Sem autorização
              throw new Error('Login ou senha incorretos (' + response.status + ')')
            default:
              throw new Error('Não foi possível realizar o login (' + response.status + ')')
          }
        }
      })
      .then(token => {
        // Armazena o JSON Web Token
        console.log('token:', token)
        localStorage.setItem('auth-token', token)

        // Redireciona para /timeline se o login foi realizado com sucesso
        this.props.history.push('/timeline')
      })
      .catch(error => {
        this.setState({
          msg: error.message
        })
      })
  }

  render() {
    return (
      <div className="login-box">
        <h1 className="header-logo">Instalura</h1>
        <span>{this.state.msg}</span>
        <form onSubmit={this.enviar.bind(this)}>
          <input type="text" ref={input => this.login = input} />
          <input type="password" ref={input => this.senha = input} />
          <input type="submit" value="login" />
        </form>
      </div>
    )
  }

}