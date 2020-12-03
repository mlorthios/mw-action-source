const initialState = { fetchAll: [false] }

function reducerChat(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'FETCH_ALL':
        nextState = {
            fetchAll: action.value
        }
        return nextState || state
  default:
    return state
  }
}

export default reducerChat;