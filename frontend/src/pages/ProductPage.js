import React from 'react'
import PageTemplate from 'components/common/PageTemplate'
import MainWrapper from 'components/common/MainWrapper'
import Category from 'components/common/Category'
import ContentWrapper from 'components/common/ContentWrapper'
import Product from 'components/product/Product'
import Base from 'containers/common/Base'

const ProductPage = () => {
  return (
    <PageTemplate>
      <Base />
      <MainWrapper>
        <Category />
        <ContentWrapper>
          <Product />
        </ContentWrapper>
      </MainWrapper>
    </PageTemplate>
  )
}

export default ProductPage