import React from 'react'
import { Form, Button, Input, Select } from 'antd'

import * as api from '../api'

const AddUser = () => {
  const [form] = Form.useForm()
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
    console.log('values:', values)
    api.addUser(values).then(() => window.location.assign('/user-list'))
  }
  return (
    <Form form={form} onFinish={onSave} wrapperCol={{ span: 4 }}>
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
        <Button type="primary" onClick={() => form.submit()}>保存</Button>
      </Form.Item>
    </Form>
  )
}

export default AddUser
