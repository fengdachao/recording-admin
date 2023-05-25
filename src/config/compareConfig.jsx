import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Input, Radio, Space, Button } from 'antd'

import * as api from '../api'

const CompareConfig = () => {
  const [form] = Form.useForm()
  const [algorithmParam, setAlgorithmParam] = useState(1)
  const onChange = () => {
    console.log('form:', form.getFieldsValue())
  }
  const onRadioChange = (value) => {
    setAlgorithmParam(value)
  }
  const onSave = () => {
    const payload = form.getFieldsValue()
    api.updateConfigParam({
      algorithm: payload.algorithm === 2 ? 'hash' : 'ssim',
      param: payload.param ? payload.param : payload.hashParam,
      duration: payload.duration,
    })
  }
  useEffect(() => {
    api.getConfigParam().then((data) => {
      if (!data) return
      console.log(data)
      const { algorithm, duration, param } = data
      const paramConfig = algorithm === 'hash' ? 2 : 1
      form.setFieldsValue({
        duration,
        algorithm: algorithm === 'hash' ? 2 : 1,
        param: algorithm !== 'hash' ? param : undefined,
        hashParam: algorithm === 'hash' ? param : undefined,
      })
      setAlgorithmParam(paramConfig)
    })
  }, [])
  console.log('algorithmParam:', algorithmParam)
  return <div>
      <h2>监控视频帧抽取算法</h2>
      <Form form={form} onChange={onChange}>
        <Form.Item name="duration" label="抽取间隙">
          <Input />
        </Form.Item>
        <h4 style={{marginBottom: '20px'}}>算法选择及参数配置</h4>
        <Row>
          <Col>
            <Form.Item noStyle name="algorithm">
              <Radio.Group onChange={onRadioChange}>
                <Space direction="vertical" size="middle">
                  <Radio value={1} style={{marginTop: '5px', marginBottom: '10px'}}>帧间差算法</Radio>
                  <Radio value={2}>感知哈希算法</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col>
            {/* <Space direction='vertical'>
              <Form.Item label="阀值" noStyle name="param">
                <Input />
              </Form.Item>
              <Form.Item label="阀值" noStyle name="param">
                <Input />
              </Form.Item>
            </Space> */}
            <Row gutter={[8, 8]} align='middle' style={{marginBottom: '15px'}}>
              <Col>阀值</Col>
              <Col>
                <Form.Item label="阀值" noStyle name="param">
                  <Input disabled={algorithmParam === 2} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 8]} align='middle'>
              <Col>阀值</Col>
              <Col>
                <Form.Item label="阀值" noStyle name="hashParam">
                  <Input disabled={algorithmParam === 1} />
                </Form.Item>
              </Col>
            </Row>

          </Col>
        </Row>
        <Form.Item>
          <Space size="large" style={{ margin: '20px 0'}}>
            <Button type="primary" onClick={onSave}>保存</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
}

export default CompareConfig
