import {
  UserOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  ReadOutlined,
} from "@ant-design/icons"
import { Link } from "react-router-dom";

const menus = {
  admin: [
    {
      key: 'preview',
      label: <a href="http://192.168.3.8" target="_blank">视频监控</a>,
    },
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
      children: [
        {
        key: "video-call",
        icon: <VideoCameraOutlined />,
        label: <Link to="video-call">会议开启</Link>,
        }, 
        // {
        //   key: "video-list",
        //   icon: <VideoCameraOutlined />,
        //   label: <Link to="video-list">会议查询</Link>,
        // }
      ]
    },
    {
      key: "config",
      icon: <VideoCameraOutlined />,
      label: "参数配置",
      children: [
        {
          key: "config-list",
          icon: <ReadOutlined />,
          label: <Link to="config-list">工程项目</Link>,
        },
        // {
        //   key: "project",
        //   // icon: 
        //   label: <Link to="/config-project">工程项目</Link>
        // },
        {
          key: "algorithm",
          icon:  <SettingOutlined />,
          label: <Link to="/config-algorithm">帧抽取算法</Link>
        }
      ]
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
  ],
  user: [
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
  ]
}
export default menus
