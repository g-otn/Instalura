export default class TimelineAPI {

  constructor(fotos) {
    this.fotos = fotos
  }

  static listar(urlPerfil) {
    return dispatch => {
      fetch(urlPerfil)
        .then(response => response.json())
        .then(fotos => {
          dispatch({ type: 'LISTAGEM', fotos })
        })
    }
  }

  static comentar(fotoId, comentarioASerEnviado) {
    return dispatch => {
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
          dispatch({ type: 'COMENTARIO', fotoId, comentarioPostado })
        })
        .catch(erro => {
          console.error(erro.message)
        })
    }
  }

  static curtir(fotoId) {
    return dispatch => {
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
          dispatch({type: 'CURTIR', fotoId, like})
        })
        .catch(erro => {
          console.error(erro.message)
        })
    }
  }

}