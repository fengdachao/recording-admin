import React, { useEffect, useState, useRef } from "react"
import { Input, Checkbox, Button, Row, Col, Space } from "antd"

const VideoClient = ({ localStream, clientName, stream }) => {
  const videoRef = useRef()
  useEffect(() => {
    console.log('video stream:', stream)
    if (stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className="video-container">
      <video className="video" ref={videoRef} autoPlay></video>
      <p className="invite-user">{clientName}</p>
    </div>
  )
}

export default VideoClient
