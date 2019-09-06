export function timeline(state = [], action) {
  if (action.type === 'LISTAGEM') {
    return action.fotos
  }

  if (action.type === 'COMENTARIO') {
    const fotoAchada = state.find(foto => foto.id === action.fotoId) 
    
    // push direto pois fotoAchada é uma REFERÊNCIA constante a state
    fotoAchada.comentarios.push(action.comentarioPostado)

    return state
  }

  if (action.type === 'CURTIR') {
    console.log(action)
    const indexFoto = state.findIndex(foto => foto.id === action.fotoId)
    const liker = action.like
    const likerExistente = state[indexFoto].likers.find(likerNaLista => likerNaLista.login === liker.login)

    // Atualiza a propriedade likeada para atualizar o CSS (src da imagem) do botão de like
    state[indexFoto].likeada = !state[indexFoto].likeada

    if (!likerExistente) {
      // Adiciona o novo liker na lista de likers
      state[indexFoto].likers.push(liker)
    } else {
      // Remove o novo liker da lista de likers
      const novosLikers = state[indexFoto].likers.filter(likerNaLista => likerNaLista.login !== liker.login)
      state[indexFoto].likers = novosLikers
    }
    
    return state
  }

  return state
}