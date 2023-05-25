import React, { useState, useEffect } from "react"
import "antd/dist/antd.min.css"
import "./index.css"
import {
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons"
import { Layout, Menu, Button, Row, Col } from "antd"
import { Link, Outlet, useLocation } from "react-router-dom";

import Menus from './Menus'
import { TITLE } from './constant'

const { Header, Sider, Content } = Layout
const App = () => {
  const [selectedKey, setSelectedKey] = useState("")
  const [openKey, setOpenKey] = useState('')
  const [userInfo, setUserInfo] = useState({})
  const menuItems = Menus[userInfo?.role] ?? []
  const onSelect = (item) => {
    console.log('on select:', item)
    setSelectedKey(item.key)
  }
  const onOpenChange = (items) => {
    console.log('open keys:', items)
    setOpenKey(items[1]) 
  }
  const handleLogout = () => {
    document.cookie = "isAuthUnsafe=false"
    document.location.assign('/login')
  }

  const location = useLocation()

  useEffect(() => {
    console.log('select key:', selectedKey)
  }, [selectedKey])

  useEffect(() => {
    const cookies = document.cookie.split(';').map((item) => item.split('='))
    const isAuth = cookies.find(item => item[0].trim() === 'isAuthUnsafe')
    const roleCookie = cookies.find(item => item[0].trim() === 'role')
    const userCookie = cookies.find(item => item[0].trim() === 'user')
    if (roleCookie) {
      setUserInfo({
        role: roleCookie[1],
        loginUser: userCookie[1]
      })
    }
    console.log('cookies:', cookies, isAuth)
    if (!Array.isArray(isAuth) || isAuth[1] !== 'true') {
      document.location.href = '/login'
    }
  }, [])

  useEffect(() => {
    const path = location.pathname.replace(/^\/(.*)/, "$1")
    const menus = {
      recording: [
        "recording-list",
      ],
      video: [
        "video-call",
        "video-list",
      ],
      config: [
        "config-list",
        "config-edit",
      ],
      user: [
        "user-list",
      ],
    }
    // setSelectedKey(path)
    const menuKeys = Object.keys(menus)
    for(let i = 0; i< menuKeys.length; i++) {
      if (menus[menuKeys[i]].includes(path)) {
        setOpenKey(menuKeys[i])
        break
      }
    }

  }, [location.pathname])
  
  return (
    <Layout>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        width={240}
        trigger={null}
      >
        <p className="logo">{TITLE}</p>
        <Menu
          theme="dark"
          mode="inline"
          multiple
          selectedKeys={[selectedKey]}
          openKeys={[openKey]}
          onSelect={onSelect}
          onOpenChange={onOpenChange}
          items={menuItems}
        >
      </Menu>
      </Sider>
      <Layout className="site-layout" style={{ height: '100vh' }}>
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            marginLeft: 240,
            textAlign: 'center',
          }}
        >
          <Row>
            <Col flex={1}>
              {/* <h3>视频图片采集系统</h3> */}
            </Col>
            <Col flex={0}>
              <span>{userInfo.loginUser}</span>
              <Button type="link" style={{ margin: "0 20px 0 5px" }} onClick={handleLogout}>登出</Button>
            </Col>
          </Row>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 680,
            marginLeft: 240,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
