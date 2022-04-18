import { SAVE_ASSERTIONS, SAVE_SCORE, SAVE_CURRENT_SCORE, USER_LOGIN } from '../actions';

const INITIAL_STATE = {
  name: '',
  assertions: 0,
  score: 0,
  currentScore: 0,
  gravatarEmail: '',
};

const player = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case USER_LOGIN:
    return {
      ...state,
      gravatarEmail: action.email,
      name: action.name,
    };
  case SAVE_SCORE:
    return { ...state, score: action.score };
  case SAVE_CURRENT_SCORE:
    return { ...state, currentScore: action.currentScore };
  case SAVE_ASSERTIONS:
    return { ...state, assertions: action.assertions };
  default:
    return state;
  }
};

export default player;
