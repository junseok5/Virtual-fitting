import React, { Component } from 'react'
import Header from 'components/common/Header'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as baseActions from 'store/modules/base'

class HeaderContainer extends Component {
  handleOpenSide = () => {
    const { BaseActions } = this.props
    BaseActions.showSidebar()
  }

  handleCloseSide = () => {
    const { BaseActions } = this.props
    BaseActions.hideSidebar()
  }

  handleToggleSide = () => {
    const { visibleSidebar } = this.props
    const { handleOpenSide, handleCloseSide} = this
    if (visibleSidebar) return handleCloseSide()
    handleOpenSide()
  }

  handleOpenSearch = () => {
    const { BaseActions } = this.props
    BaseActions.showSearchbar()
  }

  handleCloseSearch = () => {
    const { BaseActions } = this.props
    BaseActions.hideSearchbar()
  }

  handleToggleSearch = () => {
    const { visibleSearchbar } = this.props
    const { handleOpenSearch, handleCloseSearch } = this
    if (visibleSearchbar) return handleCloseSearch()
    handleOpenSearch()
  }

  handleChangeSearchInput = (value) => {
    const { BaseActions } = this.props
    BaseActions.setSearchInput(value)
  }

  render () {
    const {
      handleToggleSide,
      handleToggleSearch,
      handleChangeSearchInput
    } = this
    const {
      visibleSearchbar,
      searchbox,
      user,
      seller
    } = this.props

    let loginType = null
    if (user) loginType = 'user'
    else if (seller) loginType = 'seller'

    return (
      <Header
        onToggleSide={handleToggleSide}
        onToggleSearch={handleToggleSearch}
        onChangeSearchInput={handleChangeSearchInput}
        actionSearch={visibleSearchbar}
        searchbox={searchbox}
        loginType={loginType}
        user={user}
        seller={seller}
      />
    )
  }
}

export default connect(
  (state) => ({
    visibleSidebar: state.base.getIn(['sidebar', 'visible']),
    visibleSearchbar: state.base.getIn(['searchbar', 'visible']),
    searchbox: state.base.get('searchbox'),
    user: state.user.get('user'),
    seller: state.seller.get('seller')
  }),
  (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(HeaderContainer)