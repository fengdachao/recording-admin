import React, { useEffect, useState, useRef, useCallback } from "react"
import { Input, Checkbox, Button, Row, Col, Space, Divider } from "antd"

import SocketClient from './socket-client'
import VideoClient from './VideoClient'

import "./lib/meeting.css"

let peerConnList = {}
let webcamStreams = {}

const Meeting = () => {
  const localUser = '监控中心'
  const [localStream, setLocalStream] = useState(null)
  const [localStreams, setLocalStreams] = useState({})
  const [userList, setUserList] = useState([])
  const [inviteList, setInviteList] = useState([])
  // const [webcamStreams, setWebcamStreams] = useState({})

  const localVideoRef = useRef()

  const socketClient = SocketClient
  socketClient.onmessage = (evt) => {
    var text = ""
    var msg = JSON.parse(evt.data)
    console.dir(msg)
    var time = new Date(msg.date)
    var timeStr = time.toLocaleTimeString()

    switch (msg.type) {
      case "id":
        console.log('id:', msg.id)
        sendToServer({
          name: localUser,
          date: Date.now(),
          id: msg.id,
          type: "username",
        })
        break
      case 'username':
        console.log('username msg:', msg)
        break
      case "userlist":
        console.log('user list:', msg.users)
        setUserList(msg.users)
        break
      case "video-offer": // Invitation and offer to chat
        handleVideoOfferMsg(msg)
        break

      case "video-answer": // Callee has answered our offer
        handleVideoAnswerMsg(msg)
        break

      case "new-ice-candidate": // A new ICE candidate has been received
        handleNewICECandidateMsg(msg)
        break

      case "hang-up": // The other peer has hung up the call
        handleHangUpMsg(msg)
        break
      default: break
    }
  }

  const closeVideoCall = () => {
    console.log('close peer list:', peerConnList)
    Object.keys(peerConnList).forEach((key) => {
      console.log('close peer conn:', key)
      const peerConnection = peerConnList[key]
      peerConnection.ontrack = null;
      peerConnection.onnicecandidate = null;
      peerConnection.oniceconnectionstatechange = null;
      peerConnection.onsignalingstatechange = null;
      peerConnection.onicegatheringstatechange = null;
      peerConnection.onnotificationneeded = null;

      peerConnection.getTransceivers().forEach(transceiver => {
        transceiver.stop();
      });

      if (localStream) {
        // localVideo.pause();
        localStream.getTracks().forEach(track => {
          track.stop();
        });
      }

      peerConnection.close();
      // peerConnList[key] = null;
      // webcamStreams[key] = null;
    })
  }

  const sendToServer = (msg) => {
    console.log('peer list in sending:', peerConnList)
    var msgJSON = JSON.stringify(msg)
    // Object.keys(peerConnList).forEach(function (key) {
    //   peerConnList[key].send(msgJSON)
    //   console.log('peer conn send to:', msgJSON)
    // })
    socketClient.send(msgJSON)
  }

  async function handleVideoOfferMsg(msg) {
    let webcamStream = localStreams[msg.name]
    let peerConn = peerConnList[msg.name]
    if (!peerConn) {
      createPeerConnection(msg.name)
      peerConn = peerConnList[msg.name]
    }
    var desc = new RTCSessionDescription(msg.sdp)
    if (peerConn.signalingState !== "stable") {
      await Promise.all([
        peerConn.setLocalDescription({
          type: "rollback",
        }),
        peerConn.setRemoteDescription(desc),
      ])
      return
    } else {
      await peerConn.setRemoteDescription(desc)
    }

    if (!webcamStream) {
      try {
        webcamStream = await navigator.mediaDevices.getUserMedia({
          audio: true, // We want an audio track
          video: {
            aspectRatio: {
              ideal: 1.333333, // 3:2 aspect is preferred
            },
          },
        })
        setLocalStreams({
          ...localStreams,
          webcamStream,
        })
        // localVideoRef.current.srcObject = webcamStream
        setLocalStream(webcamStream)

      } catch (err) {
        return
      }

      try {
        webcamStream
          .getTracks()
          .forEach(
            ((track) =>
              peerConn.addTransceiver(track, {
                streams: [webcamStream],
              }))
          )
      } catch (err) {
        // handleGetUserMediaError(err)
      }
      // setWebcamStreams({
      //   ...webcamStreams,
      //   [localUser]: webcamStream,
      // })
    }

    await peerConn.setLocalDescription(
      await peerConn.createAnswer()
    )

    sendToServer({
      name: localUser,
      target: msg.name,
      type: "video-answer",
      sdp: peerConn.localDescription,
    })
  }

  const handleVideoAnswerMsg = async(msg) => {  
    console.log('handle video an answer:', msg.name)
    console.log('peer list:', peerConnList)
    var desc = new RTCSessionDescription(msg.sdp)
    await peerConnList[msg.name]
      .setRemoteDescription(desc)
      .catch(reportError)
  }

  const createPeerConnection = async (user) => {
    console.log('create connection:', user)
    const peerConn = new RTCPeerConnection({
      iceServers: [
        {
          urls: `turn:${window.location.hostname}`,
          username: "webrtc",
          credential: "turnserver",
        },
      ],
    })

    // Set up event handlers for the ICE negotiation process.

    peerConn.onicecandidate = (event) => {
      if (event.candidate) {
        sendToServer({
          type: "new-ice-candidate",
          target: user,
          candidate: event.candidate,
        })
      }
    }
    peerConn.onnegotiationneeded = async () => {
      const myPeerConnection = peerConnList[user]
      console.log('on negotiation need:', myPeerConnection)
      console.log('socket server:', SocketClient)
      try {
        const offer = await myPeerConnection.createOffer();
    
        // If the connection hasn't yet achieved the "stable" state,
        // return to the caller. Another negotiationneeded event
        // will be fired when the state stabilizes.
    
        if (myPeerConnection.signalingState !== "stable") {
          return;
        }
    
        // Establish the offer as the local peer's current
        // description.
    
        await myPeerConnection.setLocalDescription(offer);
    
        // Send the offer to the remote peer.
    
        sendToServer({
          name: localUser,
          target: user,
          type: "video-offer",
          sdp: myPeerConnection.localDescription
        });
      } catch(err) {
        reportError(err);
      };
    }
    peerConn.ontrack = (event) => {
      console.log('on track user:', user, event)
      // webcamStreams[user] = event.streams[0]
      webcamStreams[user] = event.streams[0]
    }
    // peerConnList[user] = peerConn
    peerConnList[user] = peerConn
    console.log('create conn:', peerConnList)
    console.log('peer conn:', peerConn)
    console.log({
      ...peerConnList,
      [user]: peerConn,
    })
  }

  async function handleNewICECandidateMsg(msg) {
    var candidate = new RTCIceCandidate(msg.candidate)

    try {
      await peerConnList[msg.name].addIceCandidate(candidate)
    } catch (err) {
    }
  }

  async function invite(userName) {
    createPeerConnection(userName)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true, // We want an audio track
        video: {
          aspectRatio: {
            ideal: 1.333333, // 3:2 aspect is preferred
          },
        },
      })
      // localVideoRef.current.srcObject = stream
      setLocalStream(stream)
      console.log('invite list:', peerConnList, userName)
      stream
        .getTracks()
        .forEach(
          ((track) =>
            peerConnList[userName].addTransceiver(track, {
              streams: [stream],
            }))
        )
      // setWebcamStreams({
      //   ...webcamStreams,
      //   [userName]: stream
      // })
      setLocalStreams({
        ...localStreams,
        [localUser]: stream,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const startMeeting = () => {
    let timeout = 0
    userList.forEach((name, i) => {
      if (name !== localUser) {
        (function (index) {
          setTimeout(function () {
            invite(name)
          }, timeout)
          timeout += 5000
        })(i)
      }
      
    })
  }
  const stopMeeting = () => {
    closeVideoCall()
    Object.keys(peerConnList).forEach((user) => {
      sendToServer({
        name: localUser,
        target: user,
        type: "hang-up"
      });
    })
    peerConnList = {}
    webcamStreams = {}
  }
  const handleUserCheck = (e) => (user) => {
    if (e.target.checked) {
      setInviteList([
        ...inviteList,
        user
      ])
    } else {
      setInviteList(inviteList.filter((item) => {
        return item !== user
      }))
    }
  }

  function handleHangUpMsg(msg) {
    closeVideoCall();
    peerConnList = {}
    webcamStreams = {}
  }

  useEffect(() => {
  }, [])

  return (<>
    <Row gutter={[10, 24]}>
      <Col>当前用户: <span>{localUser}</span></Col>
    </Row>
    <Row>
      <Col span={20} className="meeting">
        {/* <div className="video-container">
            <video ref={localVideoRef} className="video" autoPlay muted></video>
            <p className="invite-user">{localUser}</p>
        </div> */}
        <VideoClient stream={localStream} clientName={localUser} />
        {
          Object.keys(webcamStreams).map((key) => <VideoClient key={key} clientName={key} stream={webcamStreams[key]} />)
        }
      </Col>
      <Col span={4}>
        <Space direction="vertical">
          <Button onClick={startMeeting}>开启会议</Button>
          <Button onClick={stopMeeting}>结束会议</Button>
        </Space>
        <Divider type="horizontal" />
        <Space direction="vertical">
          {userList.filter((item) => item !== localUser).map((user, index) => (
            <Checkbox key={index} onChange={(e) => handleUserCheck(e)(user)}>{user}</Checkbox>
          ))}
        </Space>
      </Col>
    </Row>
  </>)
}

export default Meeting
