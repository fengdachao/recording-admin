import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import RecordingList from './recording/list'
// import VideoCall from './video-call/call'
import VideoCall from './video-call/Meeting'
import VideoList from './video-call/list'
import UserList from './user/list'
import ConfigList from './config'
import ConfigEdit from './config/edit'
import ConfigAdd from './config/add'
import ConfigProject from './config/project'
import ConfigAlgorithm from './config/compareConfig'
import Login from './login'

import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <RecordingList />,
      },
      {
        path: "recording-list",
        element: <RecordingList />,
      },
      {
        path: "video-call",
        element: <VideoCall />
      },
      {
        path: 'video-list',
        element: <VideoList />
      },
      {
        path: 'config-list',
        element: <ConfigList />
      },
      {
        path: 'config-project',
        element: <ConfigProject />
      },
      {
        path: 'config-algorithm',
        element: <ConfigAlgorithm />
      },
      {
        path: 'config/add',
        element: <ConfigAdd />
      },
      {
        path: 'config-edit/:id',
        element: <ConfigEdit />
      },
      {
        path: 'user-list',
        element: <UserList />
      },
    ],
  },
  {
    path: 'login',
    element: <Login />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
