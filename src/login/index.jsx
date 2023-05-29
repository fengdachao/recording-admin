import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { TITLE } from '../constant'
import * as api from '../api'

import './index.css'

const Login = () => {
  const onFinish = (values) => {
    const { userName: inputName, password: inputPassword } = values
    api.validate(inputName, inputPassword)
      .then(({ success, role }) => {
        if (success) {
          document.cookie = 'isAuthUnsafe=true'
          document.cookie = `role=${role}`
          document.cookie = `user=${inputName}`
          document.location.assign('/recording-list')
        }
      })
  };

  return (
    <>
      <h1>{TITLE}</h1>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="userName"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
          
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;