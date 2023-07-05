import React from 'react'
import { v4 } from 'uuid'

import ConfigForm from './configForm'
import * as api from '../api'

const Add = () => {
  const onSave = (formData) => {
    const list = formData.list?.map((item) => ({ ...item, id: v4() }))
    const deviceList = formData.list?.map((item) => item.ip)
    const addConfig = {
      ...formData,
      deviceList,
      list,
    }
    api.addConfigData(addConfig)
      .then(() => {
        document.location.href = '/config-list'
        console.log('Add new successfully')
      })
  }
  return <ConfigForm initialValues={{deviceList: ['', '', '', '', '', '']}} onSave={onSave} />
}

export default Add
