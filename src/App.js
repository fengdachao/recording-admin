import React, { useState, useEffect } from "react"
import "antd/dist/antd.min.css"
import "./index.css"
import {
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons"
import { Layout, Menu } from "antd"
import { Link, Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout
const App = () => {
  const [selectedKey, setSelectedKey] = useState("recording-list")
  const [openKey, setOpenKey] = useState('')
  const onSelect = (item) => {
    console.log('on select:', item)
    setSelectedKey(item.key)
  }
  const onOpenChange = (items) => {
    console.log('open keys:', items)
    setOpenKey(items[1]) 
  }

  const location = useLocation()
  

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
      user: [
        "user-list",
      ],
    }
    setSelectedKey(path)
    const menuKeys = Object.keys(menus)
    for(let i = 0; i< menuKeys.length; i++) {
      if (menus[menuKeys[i]].includes(path)) {
        setOpenKey(menuKeys[i])
        break
      }
    }

  }, [location.pathname])
  
  console.log('location:', location)
  console.log('selected key:', selectedKey)
  console.log('open key:', openKey)
  
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
        trigger={null}
      >
        <div className="logo">
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={[openKey]}
          onSelect={onSelect}
          onOpenChange={onOpenChange}
          items={[
            {
              key: "recording",
              icon: <VideoCameraOutlined />,
              label: "监控查询",
              children: [{
                key: "recording-list",
                icon: <VideoCameraOutlined />,
                label: <Link to="/recording-list">列表</Link>,
              }]
            },
            {
              key: "video",
              icon: <VideoCameraOutlined />,
              label: "视频会议",
              children: [{
                key: "video-call",
                icon: <VideoCameraOutlined />,
                label: <Link to="video-call">会议开启</Link>,
              }, {
                key: "video-list",
                icon: <VideoCameraOutlined />,
                label: <Link to="video-list">会议查询</Link>,
              }]
            },
            {
              key: "user",
              icon: <UserOutlined />,
              label: "用户管理",
              children: [{
                key: "user-list",
                icon: <UserOutlined />,
                label: <Link to="user-list">用户列表</Link>,
              }]
            },
          ]}
        >
      </Menu>
      </Sider>
      <Layout className="site-layout" style={{ height: '100vh' }}>
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            marginLeft: 200,
            textAlign: 'center',
          }}
        >
          <h3>视频图片采集系统</h3>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 680,
            marginLeft: 200,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
