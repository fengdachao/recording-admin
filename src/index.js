import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import RecordingList from './recording/list'
import VideoCall from './video-call/call'
import VideoList from './video-call/list'
import UserList from './user/list'

import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // loader: rootLoader,
    children: [
      {
        path: "recording-list",
        element: <RecordingList />,
        // loader: teamLoader,
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
        path: 'user-list',
        element: <UserList />
      }
    ],
  },
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
