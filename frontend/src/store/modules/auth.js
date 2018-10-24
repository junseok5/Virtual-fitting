import { createAction, handleActions } from 'redux-actions'

import { Map } from 'immutable'
import { pender } from 'redux-pender'
import * as AuthAPI from 'lib/api/auth'
import social from 'lib/social'

// action types
const CHANGE_INPUT = 'auth/CHANGE_INPUT'
const SELECT_LOGIN_TYPE = 'auth/SELECT_LOGIN_TYPE'
const LOCAL_LOGIN_USER = 'auth/LOCAL_LOGIN_USER'
const LOCAL_LOGIN_SELLER = 'auth/LOCAL_LOGIN_SELLER'
const PROVIDER_LOGIN = 'auth/PROVIDER_LOGIN'
const SOCIAL_LOGIN = 'auth/SOCIAL_LOGIN'
const INITIALIZE = 'auth/INITIALIZE'

// action creators
export const changeInput = createAction(CHANGE_INPUT)
export const selectLoginType = createAction(SELECT_LOGIN_TYPE)
export const localLoginUser = createAction(LOCAL_LOGIN_USER, AuthAPI.localLoginUser)
export const localLoginSeller = createAction(LOCAL_LOGIN_SELLER, AuthAPI.localLoginSeller)
export const providerLogin = createAction(PROVIDER_LOGIN, (provider) => social[provider](), provider => provider)
export const socialLogin = createAction(SOCIAL_LOGIN, AuthAPI.socialLogin)
export const initialize = createAction(INITIALIZE)

// initial state
const initialState = Map({
  form: Map({
    email: '',
    password: ''
  }),
  loginType: 'user',
  socialInfo: null,
  result: null,
  error: null,
  redirectToRegister: false
})

// reducer
export default handleActions({
  [INITIALIZE]: (state, action) => initialState,
  [CHANGE_INPUT]: (state, action) => {
    const { name, value } = action.payload
    return state.setIn(['form', name], value)
  },
  [SELECT_LOGIN_TYPE]: (state, action) => {
    const value = action.payload
    return state.set('loginType', value)
  },
  ...pender({
    type: LOCAL_LOGIN_USER,
    onSuccess: (state, action) => {
      const { data: user } = action.payload
      return state.set('result', user)
    },
    onFailure: (state, action) => {
      const { status } = action.payload.response

      if (status === 400) return state.set('error', '잘못된 입력 값입니다.')
      if (status === 403) return state.set('error', '이메일 또는 비밀번호가 잘못되었습니다.')
      if (status === 500) return state.set('error', '서버 에러! 다시 시도해주시기 바랍니다.')
    }
  }),
  ...pender({
    type: LOCAL_LOGIN_SELLER,
    onSuccess: (state, action) => {
      const { data: seller } = action.payload
      return state.set('result', seller)
    },
    onFailure: (state, action) => {
      const { status } = action.payload.response

      if (status === 400) return state.set('error', '잘못된 입력 값입니다.')
      if (status === 403) return state.set('error', '이메일 또는 비밀번호가 잘못되었습니다.')
      if (status === 500) return state.set('error', '서버 에러! 다시 시도해주시기 바랍니다.')
    }
  }),
  ...pender({
    type: PROVIDER_LOGIN,
    onSuccess: (state, action) => {
      const {
        payload: accessToken,
        meta: provider
      } = action

      return state.set('socialInfo', Map({
        accessToken,
        provider
      }))
    }
  }),
  ...pender({
    type: SOCIAL_LOGIN,
    onSuccess: (state, action) => {
      const { data: loginResult } = action.payload
      if (action.payload.status === 204) {
        return state.set('redirectToRegister', true)
      }
      return state.set('result', loginResult)
    }
  })
}, initialState)