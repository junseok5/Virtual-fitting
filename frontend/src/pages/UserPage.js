import React from 'react'
import PageTemplate from 'components/common/PageTemplate'
import MainWrapper from 'components/common/MainWrapper'
import Category from 'components/common/Category'
import ContentWrapper from 'components/common/ContentWrapper'
import UserInfo from 'components/user/UserInfo'
import AskLeaveModalContainer from 'containers/modal/AskLeaveModalContainer'
import ErrorMessageModalContainer from 'containers/modal/ErrorMessageModalContainer'

const UserPage = () => {
  return (
    <PageTemplate>
      <MainWrapper>
        <Category />
        <ContentWrapper>
          <UserInfo />
        </ContentWrapper>
        <AskLeaveModalContainer />
        <ErrorMessageModalContainer />
      </MainWrapper>
    </PageTemplate>
  )
}

export default UserPage