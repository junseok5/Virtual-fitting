import React, { Component } from 'react'
import ProductEdit from 'components/product/ProductEdit'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as baseActions from 'store/modules/base'
import * as productActions from 'store/modules/product'

import { withRouter } from 'react-router'

import regex from 'lib/regex'

class ProductEditContainer extends Component {

  state = {
    initEdit: true
  }

  getProductInfo = async () => {
    const { ProductActions, id } = this.props // product_id
    await ProductActions.getProduct(id)
  }

  componentDidMount () {
    const { ProductActions, id } = this.props
    ProductActions.initialize()
    if (id) this.getProductInfo()
  }

  handleChangeInput = (e) => {
    const { ProductActions } = this.props
    const { name, value } = e.target

    ProductActions.changeInput({ name, value })
  }

  handleChangeInputPhoto = (e, type) => {
    e.preventDefault()
    const file = e.target.files[0]
    if (!file) return

    const { ProductActions } = this.props
    ProductActions.changeInputPhoto({ type, file })

    // 이미지 미리보기 설정
    const url = window.URL.createObjectURL(file)
    ProductActions.setPreviewImage({ type, url })
  }

  handleSubmitProduct = async () => {
    const { ProductActions, BaseActions, form } = this.props
    const {
      productName,
      price,
      salesLink,
      category,
      subCategory,
      targetGender,
      freeShipping,
      modelPhotoFile,
      productPhotoFile
    } = form.toJS()

    // validation
    if (!regex.productName.test(productName)) {
      BaseActions.setModalMessage({
        modalName: 'error',
        modalMessage: '잘못된 상품 이름입니다.'
      })
      return
    } else if (price < 0) {
      BaseActions.setModalMessage({
        modalName: 'error',
        modalMessage: '상품 가격은 0원 이상이어야 합니다.'
      })
      return
    } else if (!salesLink) {
      BaseActions.setModalMessage({
        modalName: 'error',
        modalMessage: '잘못된 판매 링크입니다.'
      })
      return
    } else if (!regex.category.test(category)) {
      BaseActions.setModalMessage({
        modalName: 'error',
        modalMessage: '잘못된 카테고리 이름입니다.'
      })
      return
    } else if (!regex.subCategory.test(subCategory)) {
      BaseActions.setModalMessage({
        modalName: 'error',
        modalMessage: '잘못된 하위 카테고리 이름입니다.'
      })
      return
    } else if (!regex.gender.test(targetGender)) {
      BaseActions.setModalMessage({
        modalName: 'error',
        modalMessage: '잘못된 유형의 성별입니다.'
      })
      return
    } else if (!modelPhotoFile) {
      BaseActions.setModalMessage({
        modalName: 'error',
        modalMessage: '모델 사진이 필요합니다'
      })
      return
    } else if (!productPhotoFile) {
      BaseActions.setModalMessage({
        modalName: 'error',
        modalMessage: '상품 사진이 필요합니다'
      })
      return
    }

    try {
      await ProductActions.writeProduct({
        productName,
        price,
        salesLink,
        category,
        subCategory,
        targetGender,
        freeShipping,
        modelPhotoFile,
        productPhotoFile
      })

      const { history, seller } = this.props
      const { _id } = seller.toJS()

      history.push(`/manage/${_id}/1`)
    } catch (e) {
      const { error } = this.props
      BaseActions.setModalMessage({
        modalName: 'eror',
        modalMessage: error
      })
    }
  }

  handleInitEdit = (patch) => {
    console.log('hi')
    const { ProductActions } = this.props
    const { name, value } = patch

    this.setState({ initEdit: false })
    ProductActions.changeInput({ name, value })
  }

  render () {
    const {
      form,
      previewImage,
      id: productId,
      product: product
    } = this.props
    const { initEdit } = this.state
    const {
      handleChangeInput,
      handleChangeInputPhoto,
      handleSubmitProduct,
      handleInitEdit
    } = this

    return (
      <ProductEdit
        productId={productId}
        forms={form}
        productInfo={product}
        initEdit={initEdit}
        previewImage={previewImage}
        onChangeInput={handleChangeInput}
        onChangeInputPhoto={handleChangeInputPhoto}
        onSubmitProduct={handleSubmitProduct}
        onInitEdit={handleInitEdit}
      />
    )
  }
}

export default connect(
  (state) => ({
    form: state.product.get('form'),
    previewImage: state.product.get('previewImage'),
    result: state.product.get('result'),
    error: state.product.get('error'),
    seller: state.seller.get('seller'),
    product: state.product.get('product')
  }),
  (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch),
    ProductActions: bindActionCreators(productActions, dispatch)
  })
)(withRouter(ProductEditContainer))