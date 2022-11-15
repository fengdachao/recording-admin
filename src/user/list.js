import React, { useState, useEffect } from 'react'
import { Table, Button, Row, Col } from 'antd'

import * as api from '../api'

const List = () => {
  const [list, setList] = useState([])
  const columns = [
    {
      title: '名字',
      dataIndex: 'name'
    }, {
      title: '创建时间',
      dataIndex: 'time'
    }, {
      title: '角色',
      dataIndex: 'role'
    }
  ]

  useEffect(() => {
    api.getUserList()
      .then(({ data }) => {
        console.log('data:', data)
        setList(data)
      })
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
