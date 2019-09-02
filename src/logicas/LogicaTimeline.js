import PubSub from 'pubsub-js'

export default class LogicaTimeline {

  constructor(fotos) {
    this.fotos = fotos
  }

  listar(urlPerfil) {
    fetch(urlPerfil)
      .then(response => response.json())
      .then(fotos => {
        this.fotos = fotos
        PubSub.publish('timeline', this.fotos)
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

        const indexFoto = this.fotos.findIndex(foto => foto.id === fotoId)
  
        this.fotos[indexFoto].comentarios.push(comentarioPostado)
  
        PubSub.publish('timeline', this.fotos)
      })
      .catch(erro => {
        console.error(erro.message)
      })
  }

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
        const indexFoto = this.fotos.findIndex(foto => foto.id === fotoId)
        const likerExistente = this.fotos[indexFoto].likers.find(liker => liker.login === like.login)

        // Atualiza a propriedade likeada para atualizar o CSS (src da imagem) do botão de like
        this.fotos[indexFoto].likeada = !this.fotos[indexFoto].likeada

        if (!likerExistente) {
          // Adiciona o novo liker na lista de likers
          this.fotos[indexFoto].likers.push(like)
        } else {
          // Remove o novo liker da lista de likers
          const novosLikers = this.fotos[indexFoto].likers.filter(liker => liker.login !== like.login)
          this.fotos[indexFoto].likers = novosLikers
        }

        PubSub.publish('timeline', this.fotos)
      })
      .catch(erro => {
        console.error(erro.message)
      })
  }

  inscrever(callback) {
    PubSub.subscribe('timeline', (topico, fotos) => {
      callback(fotos)
    })
  }

}