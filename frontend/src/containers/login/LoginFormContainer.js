import React, { Component } from 'react'
import LoginForm from 'components/login/LoginForm'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from 'store/modules/auth'
import * as userActions from 'store/modules/user'
import * as sellerActions from 'store/modules/seller'
import * as baseActions from 'store/modules/base'

import { withRouter } from 'react-router'
import regex from 'lib/regex'

class LoginFormContainer extends Component {

  componentDidMount () {
    const { AuthActions } = this.props
    AuthActions.initialize()
  }

  handleChangeInput = (e) => {
    const { AuthActions } = this.props
    const { name, value } = e.target

    AuthActions.changeInput({ name, value })
  }

  handleSelectLoginType = (type) => {
    const { AuthActions } = this.props
    AuthActions.selectLoginType(type)
  }

  handleKeyPress = (e) => {
    if (e.key !== 'Enter') return
    this.handleLogin()
  }

  handleLogin = async () => {
    const {
      AuthActions,
      UserActions,
      SellerActions,
      BaseActions,
      form,
      loginType
    } = this.props

    const {
      email,
      password
    } = form.toJS()

    // validation
    if (!regex.email.test(email)) {
      BaseActions.setModalMessage({
        modalName: 'error',
        modalMessage: '잘못된 이메일 형식입니다.'
      })
      return
    } else if (!regex.password.test(password)) {
      BaseActions.setModalMessage({
        modalName: 'error',
        modalMessage: '비밀번호는 6자 이상 30자 이하입니다.'
      })
      return
    }

    // 로그인 타입에 따른 로그인 요청
    try {
      if (loginType === 'user') {
        await AuthActions.localLoginUser({
          email, password
        })

        const { result } = this.props
        UserActions.setUser(result)
        localStorage.logged = 'user'
      } else if (loginType === 'seller') {
        await AuthActions.localLoginSeller({
          email, password
        })
        const { result } = this.props
        SellerActions.setSeller(result)
        localStorage.logged = 'seller'
      }

      const { history } = this.props
      history.push('/')
    } catch (e) {
      const { error } = this.props
      if (error) {
        BaseActions.setModalMessage({
          modalName: 'error',
          modalMessage: error
        })
      }
    }
  }

  handleSocialLogin = async (provider) => {
    const { AuthActions, UserActions } = this.props

    try {
      await AuthActions.providerLogin(provider)

      const { socialInfo } = this.props

      await AuthActions.socialLogin({
        provider,
        accessToken: socialInfo.get('accessToken')
      })

      const { redirectToRegister, history } = this.props

      if (redirectToRegister) {
        setTimeout(() => {
          history.push('/register/added')
        }, 400)
        return
      }

      const { loginResult } = this.props
      UserActions.setUser(loginResult)
      localStorage.logged = 'user'

      history.push('/')
    } catch (e) {
      return
    }
  }

  render () {
    const { form, loginType } = this.props
    const {
      handleChangeInput,
      handleSelectLoginType,
      handleKeyPress,
      handleLogin,
      handleSocialLogin
    } = this

    return (
      <LoginForm
        loginType={loginType}
        forms={form}
        onChangeInput={handleChangeInput}
        onSelectLoginType={handleSelectLoginType}
        onKeyPress={handleKeyPress}
        onLogin={handleLogin}
        onSocialLogin={handleSocialLogin}
      />
    )
  }
}

export default connect(
  (state) => ({
    form: state.auth.get('form'),
    loginType: state.auth.get('loginType'),
    result: state.auth.get('result'),
    error: state.auth.get('error'),
    socialInfo: state.auth.get('socialInfo'),
    loginResult: state.auth.get('loginResult'),
    redirectToRegister: state.auth.get('redirectToRegister')
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch),
    SellerActions: bindActionCreators(sellerActions, dispatch),
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(withRouter(LoginFormContainer))