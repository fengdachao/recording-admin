import React, { useState, useEffect } from 'react'
import { Table, Button, Row, Col, Modal } from 'antd'

import * as api from '../api'

const Config = () => {
  const [configData, setConfigData] = useState([])
  const load = () => {
    api.getConfigData()
      .then((data) => {
        setConfigData(data)
      })
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = (key) => {
    Modal.confirm({
      content: '确认删除该项配置吗?',
      title: '删除',
      onCancel: (close) => close(),
      onOk: (close) => {
        api.removeConfig(key).then(() => {
          load()
          close()
        })
      }
    })
    
  }

  const columns = [
    {
      dataIndex: 'place',
      title: '地点',
    }, {
      dataIndex: 'algorithm',
      title: '算法',
    }, {
      dataIndex: 'params',
      title: '图像帧抽取算法参数',
    }, {
      dataIndex: 'deleteDuration',
      title: '删除时间',
    }, {
      dataIndex: 'port',
      title: '端口号',
    }, {
      title: '操作',
      render: (ignore, record) => {
        return (<>
          <Button type="link" href={`/config-edit/${record.id}`}>编辑</Button>
          <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>
        </>)
      }
    }
  ]
  return <>
    <Row justify='end'>
      <Col>
        <Button type="link" href="/config/add">添加配置</Button>
      </Col>
    </Row>
    <Table rowKey="_id" dataSource={configData} columns={columns} />
  </>
}

export default Config



