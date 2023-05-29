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

  const expandRow = ({ deviceList }) => {

    const columns = deviceList.map((item, index) => ({ title: `摄像头#${index}`, dataIndex: `device${index}` }))
    const deviceData = {}
    deviceList.forEach((item, index) => {
      deviceData[`device${index}`] = item
    })
    // const data = deviceList.map((item, index) => ({ [`device${index}`]: item }))
    console.log('device:', deviceData)
    return <Table dataSource={[deviceData]} columns={columns} />
  }

  const columns = [
    {
      dataIndex: 'number',
      title: '项目编号',
    },
    {
      dataIndex: 'place',
      title: '项目名称/地点',
    },
    {
      dataIndex: 'recordingDevice',
      title: '硬盘录像机'
    },
    {
      title: '摄像头数量',
      render: (record) => record.deviceList.length,
    },
    // {
    //   dataIndex: 'algorithm',
    //   title: '算法',
    // },
    // {
    //   dataIndex: 'params',
    //   title: '图像帧抽取算法参数',
    // }, 
    // {
    //   dataIndex: 'deleteDuration',
    //   title: '删除时间',
    // },
    {
      dataIndex: 'port',
      title: '端口号',
    },
    {
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
    <Table rowKey="_id" dataSource={configData} columns={columns} expandedRowRender={expandRow} />
  </>
}

export default Config



