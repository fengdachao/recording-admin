import React from 'react'

import ConfigForm from './configForm'
import * as api from '../api'

const Add = () => {
  const onSave = (formData) => {
    api.addConfigData(formData)
      .then(() => {
        document.location.href = '/config-list'
        console.log('Add new successfully')
      })
  }
  return <ConfigForm initialValues={{}} onSave={onSave} />
}

export default Add
