import {
  FileSearchOutlined,
  UserOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  ReadOutlined,
  PhoneOutlined,
  CloudServerOutlined,
  LinkOutlined,
  AimOutlined,
  TableOutlined,
  UnorderedListOutlined,
  UserAddOutlined,
} from "@ant-design/icons"
import { Link } from "react-router-dom";

import { RECORDINGLIST } from "./constant";

const menus = {
  admin: [
    {
      key: 'preview',
      icon: <CloudServerOutlined />,
      label: '现场硬盘录像机',
      children: RECORDINGLIST.map(({ ip, name }) => ({
        key: 'zhoushan',
        icon: <LinkOutlined />,
        label: <a href={`http://${ip}`} target="_blank">{name}</a>,
      }))
    },
    {
      key: "recording",
      icon: <FileSearchOutlined />,
      label: "监控查询",
      children: [{
        key: "recording-list",
        icon: <TableOutlined />,
        label: <Link to="/recording-list">列表</Link>,
      }]
    },
    {
      key: "video",
      icon: <PhoneOutlined />,
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
      icon: <AimOutlined />,
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
      children: [
        {
          key: "user-list",
          icon: <UnorderedListOutlined />,
          label: <Link to="user-list">用户列表</Link>,
        },
        {
          key: "user-add",
          icon: <UserAddOutlined />,
          label: <Link to="user/add">添加用户</Link>,
        }
      ]
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
