const initialState = { loggedIn: false }

function reducerAuthentication(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'LOGGING':
        nextState = {
            loggedIn: action.value,
            loggedId: action.Lid,
            loggedUsername: action.Lusername,
            loggedPseudonyme: action.Lpseudonyme,
            loggedAvatar: action.Lavatar,
            loggedToken: action.Ltoken,
            loggedEmail: action.Lemail,
            loggedVerified: action.Lverified,
            loggedNotificationActive: action.LnotificationActive,
            loggedNotificationId: action.LnotificationId,
            loggedCreateAt: action.LcreatedAt

        }
        return nextState || state
  default:
    return state
  }
}

export default reducerAuthentication;