import React, { useState, useEffect } from 'react'
import { Table, Button, Row, Col, Space, Modal } from 'antd'

import * as api from '../api'

const List = () => {
  const [list, setList] = useState([])

  const onDelete = (id, name) => {
    Modal.confirm({
      title: '删除确认',
      content: `确定删除用户${name}`,
      onOk: () => {
        api.deleteUser(id)
        load()
      }
    })
  }

  const columns = [
    {
      title: '名字',
      dataIndex: 'name'
    }, {
      title: '角色',
      dataIndex: 'role'
    }, {
      title: '最后修改时间',
      dataIndex: 'time'
    },
    {
      title: '操作',
      render: (ignore, record) => (
        <Space>
          <Button type="link" href={`/dashboard/user/edit/${record._id}`}>编辑</Button>
          <Button type="link" onClick={() => onDelete(record._id, record.name)} >删除</Button>
        </Space>
      )
    }
  ]

  const load = async () => {
    api.getUserList()
    .then(({ data }) => {
      console.log('data:', data)
      setList(data)
    })
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <Row justify="end">
        <Col>
          {/* <Button type="link" href="/user/add">添加用户</Button> */}
        </Col>
      </Row>
      <Table rowKey="name" dataSource={list} columns={columns} />
    </>
  )
}

export default List
