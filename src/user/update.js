import React, { useState, useEffect } from 'react'
import { Form, Button, Input, Select, Space } from 'antd'
import { useParams } from 'react-router-dom'

import * as api from '../api'

const UpdateUser = () => {
  const [form] = Form.useForm()
  const [initialValues, setInitialValues] = useState()
  const { id } = useParams()
  const roleOptions = [
    { 
      label: 'USER',
      value: 'user'
    },
    {
      label: 'ADMIN',
      value: 'admin'
    }
  ]
  const onSave = (values) => {
    console.log('update:', values)
    api.updateUser({
      ...values,
      id: initialValues._id,
    }).then(() => {
      window.location.assign('/dashboard/user-list')
    })
  }
  useEffect(() => {
    api.getUserById(id)
      .then((data) => {
        console.log('res data:', data)
        setInitialValues(data)
        form.setFieldsValue(data)
      })
  }, [id, form])
  return (
    <Form form={form} initialValues={initialValues} onFinish={onSave} wrapperCol={{ span: 4 }}>
      <Form.Item name="name" label="名字">
        <Input />
      </Form.Item>
      <Form.Item name="role" label="角色">
        <Select options={roleOptions} />
      </Form.Item>
      <Form.Item name="password" label="密码">
        <Input type="password" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" onClick={() => form.submit()}>保存</Button>
          <Button type="primary" onClick={() => window.location.assign('/dashboard/user-list')}>返回</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default UpdateUser
