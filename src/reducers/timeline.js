export function timeline(state = [], action) {
  if (action.type === 'LISTAGEM') {
    return action.fotos
  }

  if (action.type === 'COMENTARIO') {
    const fotoId = action.fotoId
    const comentarioPostado = action.comentarioPostado
    const fotoAchada = state.find(foto => foto.id === fotoId) 
    
    // push direto pois fotoAchada é uma REFERÊNCIA constante a state
    fotoAchada.comentarios.push(comentarioPostado) 

    return state
  }

  return state
}