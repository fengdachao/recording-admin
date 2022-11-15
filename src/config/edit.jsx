import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import ConfigForm from './configForm'
import * as api from '../api'

const Edit = () => {
  const { id } = useParams()
  const [initData, setInitData] = useState({})
  useEffect(() => {
    api.getConfigById(id)
      .then((data) => {
        setInitData(data)
      })
  }, [id])
  const onSave = (formData) => {
    api.updateConfig(formData)
      .then(() => {
        console.log('update successfully')
        document.location.href = '/config-list'
      })
  }
  console.log('init data:', initData)
  return <ConfigForm initialValues={initData} onSave={onSave} />
}

export default Edit
