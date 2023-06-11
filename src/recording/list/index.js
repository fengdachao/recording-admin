import React, { useEffect, useState } from "react"
import { Table, Form, Row, Col, Input, DatePicker, Button, Modal, Select } from "antd"
import moment from 'moment'
import { v4 as uuidV4 } from 'uuid'

import { HOST } from '../../constant'
// import { DeleteOutlined } from '@ant-design/icons'
import * as api from '../../api'

// const ImageServer = 'http://localhost:8080'
const ImageServer = `http://${HOST}:8080`

const List = () => {
  const [dataSource, setDataSource] = useState([])
  const [showImage, setShowImage] = useState(false)
  const [viewUrl, setViewUrl] = useState('')
  const [placeList, setPlaceList] = useState([])
  const [form] = Form.useForm()
  const columns = [
    {
      title: "来源",
      dataIndex: "place",
      key: "place",
      // render: (text) => {
      //   const place = placeList.find(item => item.id === text)
      //   if (place) return place.name
      //   return ""
      // }
    },
    // {
    //   title: "名称",
    //   dataIndex: "name",
    //   key: "name",
    // },
    {
      title: '缩略图',
      dataIndex: 'relativePath',
      render: (src) => <img alt="" style={{ width: '50px' }} src={`${ImageServer}/${src}`} />,
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
          {/* <a href={`${ImageServer}/${record.relativePath}`} download={`${record.relativePath}`}>下载</a> */}
          <Button type="link" onClick={() => download(`${ImageServer}/${record.relativePath}`, record.relativePath)}>下载</Button>
          <Button type="link" onClick={() => onDelete(record)}>删除</Button>
        </>
      )
    }
  ]

  const download = (url, filename) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    })
    .catch(console.error);
  }

  const load = (params = {}) => {
    console.log('params:', params)
    api.getList(params).then(data => {
      console.log('get list:', data)
      setDataSource(data)
    })
  }

  const onSearch = () => {
    const { name, place, date=[] } = form.getFieldsValue()
    load({
      name: name ? name : undefined,
      place: place !== 'all' ? place : undefined,
      startDate: date[0]?.valueOf(),
      endDate: date[1]?.valueOf(),
    })
  }

  const onView = (path) => {
    const url = `${ImageServer}/${path}`
    console.log('view path:', url)
    setViewUrl(url)
    setShowImage(true)
  }

  const onDelete = (record) => {
    console.log('record:', record)
    Modal.confirm({
      content: '确认删除这条记录吗?',
      onOk: (close) => api.deleteItem(record.id, record.physicalPath)
        .then(() => {
          const { name, place, date=[] } = form.getFieldsValue()
          load({
            name: name ? name : undefined,
            place: place !== 'all' ? place : undefined,
            startDate: date[0]?.valueOf(),
            endDate: date[1]?.valueOf(),
          })
        })
        .finally(() => close()),
      okText: '是',
      cancelText: '否',
    })
  }

  useEffect(() => {
    api.getConfigData()
      .then((data) => {
        setPlaceList(data.map(({ place }) => place))
      })
  }, [])

  return (
    <>
      <Form form={form} initialValues={{place: 'all', date: [moment().subtract(7, 'days'), moment()]}}>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item
              name="place"
              label="施工现场"
            >
              <Select width={200}>
                <Select.Option value="all">所有</Select.Option>
                {
                  placeList.map((item) => <Select.Option value={item} key={item}>{item}</Select.Option>)
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="name"
              label="名称"
            >
              <Input placeholder="名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="date"
              label="日期"
            >
              <DatePicker.RangePicker
                name="date"
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
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
      <Table rowKey="name" columns={columns} dataSource={dataSource} />
      <Modal
        open={showImage}
        width="50%"
        onOk={() => setShowImage(false)}
        closable={false}
        onCancel={() => setShowImage(false)}
        footer={
          <Button type="primary" onClick={() => setShowImage(false)}>OK</Button>
        }
      >
        <img src={viewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain'}} />
      </Modal>
    </>
  )
}

export default List
