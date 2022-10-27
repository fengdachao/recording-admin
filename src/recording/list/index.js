import React, { useState } from "react"
import { Table, Form, Row, Col, Input, DatePicker, Button, Modal, Select } from "antd"
import moment from 'moment'
// import { DeleteOutlined } from '@ant-design/icons'
import * as api from '../../api'

const ImageServer = 'http://localhost:8080'

const placeList = [
  {
    id: 1,
    name: "施工现场1"
  },
  {
    id: 2,
    name: "施工现场2"
  }
]

const List = () => {
  const [dataSource, setDataSource] = useState([])
  const [showImage, setShowImage] = useState(false)
  const [viewUrl, setViewUrl] = useState('')
  const columns = [
    {
      title: "来源",
      dataIndex: "place",
      key: "place",
      render: (text) => {
        const place = placeList.find(item => item.id === text)
        if (place) return place.name
        return ""
      }
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "创建日期",
      dataIndex: "date",
      key: "date",
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: "操作",
      key: "operation",
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => onView(record.relativePath)}>查看</Button>
          {/* <DeleteOutlined onClick={() => onDelete(record._id)} /> */}
          <Button type="link" onClick={() => onDelete(record)}>删除</Button>
        </>
      )
    }
  ]

  const load = () => {
    api.getList().then(data => {
      console.log('get list:', data)
      setDataSource(data)
    })
  }

  const onSearch = () => {
    load()
  }

  const onView = (path) => {
    const url = `${ImageServer}/${path}`
    console.log('view path:', url)
    setViewUrl(url)
    setShowImage(true)
  }

  const onDelete = (record) => {
    console.log('record:', record)
    api.deleteItem(record._id, record.physicalPath).then(() => {
      load()
    })
  }

  return (
    <>
      <Form>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="place"
              label="施工现场"
            >
              <Select defaultValue={"all"} width={200}>
                <Select.Option value="all">所有</Select.Option>
                {
                  placeList.map((item) => <Select.Option value={item.id}>{item.name}</Select.Option>)
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="name"
              label="名称"
              rules={[
                {
                  required: true,
                  message: "Input something!",
                },
              ]}
            >
              <Input placeholder="名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="date"
              label="日期"
            >
              <DatePicker.RangePicker
                name="date"
              ></DatePicker.RangePicker>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} justify="end">
          <Col>
            <Form.Item>
              <Button type="primary" onClick={onSearch}>查询</Button>
            </Form.Item> 
          </Col>
        </Row>
      </Form>
      <Table rowKey="name" columns={columns} dataSource={dataSource} rowKey={(record) => record._id } />
      <Modal
        open={showImage}
        onOk={() => setShowImage(false)}
      >
        <img src={viewUrl} alt="" style={{width: '100%'}} />
      </Modal>
    </>
  )
}

export default List
