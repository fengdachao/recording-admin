import React, { useEffect } from 'react'
import { Form, Input, Button } from 'antd'

const Edit = ({ initialValues, onSave }) => {
  const [form] = Form.useForm()
  useEffect(() => {
    form?.setFieldsValue(initialValues)
  }, [initialValues, form])

  const handleSave = () => {
    onSave({
      ...form.getFieldsValue(),
      id: initialValues.id,
    })
  }

  return <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
    <Form.Item label="地点" name="place">
      <Input value="123" />
    </Form.Item>
    <Form.Item label="图像帧抽取算法参数" name="params">
      <Input value="abc" />
    </Form.Item>
    <Form.Item label="删除时间" name="deleteDuration">
      <Input />
    </Form.Item>
    <Form.Item label="端口号" name="port">
      <Input />
    </Form.Item>
    <Form.Item wrapperCol={{ offset: 4 }}>
      <Button type="primary" onClick={handleSave}>保存</Button>
      <Button type="link" href="/config-list">返回</Button>
    </Form.Item>
  </Form>
}

export default Edit
