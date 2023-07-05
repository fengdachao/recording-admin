import React, { useEffect, useState } from 'react'
import { Form, Input, Button } from 'antd'

const Edit = ({ initialValues, onSave }) => {
  const [form] = Form.useForm()
  const [count, setCount] = useState(0)
  useEffect(() => {
    form?.setFieldsValue(initialValues)
  }, [initialValues, form])

  const handleSave = () => {
    const values = form.getFieldsValue()
    console.log('values:', values)
    onSave({
      ...values,
      id: initialValues.id,
    })
  }

  const handleAdd = () => {
    setCount((count) => count + 1)
  } 

  return <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
    <Form.Item label="项目编号" name="number">
      <Input />
    </Form.Item>
    <Form.Item label="地点" name="place">
      <Input />
    </Form.Item>
    <Form.Item label="硬盘录像机" name="recordingDevice">
      <Input />
    </Form.Item>
    <Form.List name="list">
      {(fields) => {
          const list = fields.map((field, index) => {
            console.log('fields:', field)
            return (<>
              <Form.Item name={[field.name, 'name']} key={`name-${index+1}`} label={`摄像头#名称${index + 1}`}>
                <Input />
              </Form.Item>
              <Form.Item name={[field.name, 'ip']} key={`ip-${index+1}`} label={`摄像头#IP${index + 1}`}>
                <Input />
              </Form.Item>
              <Form.Item name={[field.name, 'port' ]} key={`port-${index+1}`} label={`端口#${index + 1}`}>
                <Input />
              </Form.Item>
            </>)
          }) 
          return list
        }
      }
    </Form.List>
    <Form.Item wrapperCol={{ offset: 4 }}>
      <Button onClick={() => form.setFieldValue('list', [...form.getFieldValue('list') ?? [], { ip: '', port: '' }])}>+</Button>
    </Form.Item>
   <Form.Item wrapperCol={{ offset: 4 }}>
      <Button type="primary" onClick={handleSave}>保存</Button>
      <Button type="link" href="/config-list">返回</Button>
    </Form.Item>
  </Form>
}

export default Edit
