import React, { useEffect, useState } from "react"
import { Input, Checkbox, Button, Row, Col, Space } from "antd"

// import { connect, startMeeting } from "./lib/meeting-client"
import "./lib/meeting.css"

var userName = "监控中心"

var myHostname = window.location.hostname

var clientID = 0

var connectionList = []
var myPeerConnectionList = {}

var mediaConstraints = {
  audio: true, // We want an audio track
  video: {
    aspectRatio: {
      ideal: 1.333333, // 3:2 aspect is preferred
    },
  },
}

var myUsername = null
var targetUsername = null // To store username of other peer
var myPeerConnection = null // RTCPeerConnection
var transceiver = null // RTCRtpTransceiver
var webcamStream = null // MediaStream from webcam

var webcamStreamMap = {}

const VideoCall = () => {
  const [onlineUsers, setOnlineUsers] = useState([])
  const [recordingUrl, setRecordingUrl] = useState(null)
  const [inviteUsers, setInviteUsers] = useState([])

  const recorderMap = {}
  const recordingMap = {}

  const handleUserCheck = (e) => (user) => {
    if (e.target.checked) {
      setInviteUsers([
        ...inviteUsers,
        user
      ])
    } else {
      setInviteUsers(inviteUsers.filter((item) => {
        return item !== user
      }))
    }
  }
 
  function log_error(text) {
    var time = new Date()

    console.trace("[" + time.toLocaleTimeString() + "] " + text)
  }


  function sendToServer(msg) {
    var msgJSON = JSON.stringify(msg)
    console.log("sending to server count:", connectionList)
    connectionList.forEach(function (c) {
      c.send(msgJSON)
    })
  }

  function setUsername(name) {
    // myUsername = document.getElementById("name").value;
    myUsername = name
    sendToServer({
      name: myUsername,
      date: Date.now(),
      id: clientID,
      type: "username",
    })
  }

  function connect(name, userListCallback) {
    // var name = 'local-' + new Date().getTime()
    var connection = null
    var serverUrl
    var scheme = "ws"

    // If this is an HTTPS connection, we have to use a secure WebSocket
    // connection too, so add another "s" to the scheme.

    if (document.location.protocol === "https:") {
      scheme += "s"
    }
    serverUrl = scheme + "://" + myHostname + ":6503"

    connection = new WebSocket(serverUrl, "json")

    connection.onopen = function (evt) {
      // document.getElementById("text").disabled = false
      // document.getElementById("send").disabled = false
    }

    connection.onerror = function (evt) {
      console.dir(evt)
    }

    connection.onmessage = function (evt) {
      var chatBox = document.querySelector(".chatbox")
      var text = ""
      var msg = JSON.parse(evt.data)
      console.dir(msg)
      var time = new Date(msg.date)
      var timeStr = time.toLocaleTimeString()

      switch (msg.type) {
        case "id":
          clientID = msg.id
          setUsername(name)
          break

        case "username":
          text =
            "<b>User <em>" +
            msg.name +
            "</em> signed in at " +
            timeStr +
            "</b><br>"
          break

        case "message":
          text =
            "(" + timeStr + ") <b>" + msg.name + "</b>: " + msg.text + "<br>"
          break

        case "rejectusername":
          myUsername = msg.name
          text =
            "<b>Your username has been set to <em>" +
            myUsername +
            "</em> because the name you chose is in use.</b><br>"
          break

        case "userlist": // Received an updated user list
          // handleUserlistMsg(msg)
          console.log('user list:', msg.users)
          setOnlineUsers(msg.users)
          // userListCallback(msg.users)
          break

        // Signaling messages: these messages are used to trade WebRTC
        // signaling information during negotiations leading up to a video
        // call.

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

        // Unknown message; output to console for debugging.

        default:
          log_error("Unknown message received:")
          log_error(msg)
      }

      // If there's text to insert into the chat buffer, do so now, then
      // scroll the chat panel so that the new text is visible.

      if (text.length) {
        // chatBox.innerHTML += text
        // chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight
      }
    }

    connectionList.push(connection)
  }

  async function startMeeting() {
    let timeout = 0
    // const meetingPanel = document.querySelector('.meeting')
    // ;[1, 2, 3, 4, 5, 6].forEach((item) => {
    //   const videoContainer = createVideoElement(item, null)
    //   meetingPanel.appendChild(videoContainer)
    // })
    
    for (var i = 0; i < inviteUsers.length; i++) {
      if (inviteUsers[i] === userName) continue
      (function (index) {
        setTimeout(function () {
          console.log("invite user index########################:", onlineUsers[index])
          invite(inviteUsers[index])
        }, timeout)
        timeout += 5000
      })(i)
    }
  }

  function handleSendButton() {
    var msg = {
      text: document.getElementById("text").value,
      type: "message",
      id: clientID,
      date: Date.now(),
    }
    sendToServer(msg)
    document.getElementById("text").value = ""
  }

  function handleKey(evt) {
    if (evt.keyCode === 13 || evt.keyCode === 14) {
      if (!document.getElementById("send").disabled) {
        handleSendButton()
      }
    }
  }

  async function createPeerConnection() {
    myPeerConnection = new RTCPeerConnection({
      iceServers: [
        // Information about ICE servers - Use your own!
        {
          urls: "turn:" + myHostname, // A TURN server
          username: "webrtc",
          credential: "turnserver",
        },
      ],
    })

    // Set up event handlers for the ICE negotiation process.

    myPeerConnection.onicecandidate = handleICECandidateEvent
    myPeerConnection.oniceconnectionstatechange =
      handleICEConnectionStateChangeEvent
    myPeerConnection.onicegatheringstatechange =
      handleICEGatheringStateChangeEvent
    myPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent
    myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent
    myPeerConnection.ontrack = handleTrackEvent
    // 添加peer connection列表
    console.log("peer connection user name:", myUsername, targetUsername)
    myPeerConnectionList[targetUsername] = myPeerConnection
    myPeerConnection = null
  }

  async function handleNegotiationNeededEvent() {
    var myPeerConnection = myPeerConnectionList[targetUsername]

    try {
      const offer = await myPeerConnection.createOffer()

      // If the connection hasn't yet achieved the "stable" state,
      // return to the caller. Another negotiationneeded event
      // will be fired when the state stabilizes.

      if (myPeerConnection.signalingState != "stable") {
        return
      }

      // Establish the offer as the local peer's current
      // description.

      await myPeerConnection.setLocalDescription(offer)

      // Send the offer to the remote peer.

      sendToServer({
        name: myUsername,
        target: targetUsername,
        type: "video-offer",
        sdp: myPeerConnection.localDescription,
      })
    } catch (err) {
      reportError(err)
    }
  }

  const createVideoElement = (videoId, stream) => {
    var video = document.createElement("video")
    video.className = "video"
    video.id = videoId
    video.autoplay = true
    video.muted = true
    video.srcObject = stream

    // videoPanel.appendChild(video)
    var videoContainer = document.createElement("div")
    var nameLabel = document.createElement("p")
    nameLabel.innerText = targetUsername
    nameLabel.className = "invite-user"
    videoContainer.className = "video-container"
    videoContainer.appendChild(video)
    videoContainer.appendChild(nameLabel)
    return videoContainer
  }

  var remoteVideoIds = []
  function handleTrackEvent(event) {
    console.log("Track event:", event)
    var videoId = event.streams[0].id
    console.log("video id:", videoId)
    var videoElement = document.getElementById(videoId)
    var videoPanel = document.querySelector(".meeting")
    if (!remoteVideoIds.includes(videoId)) {
      remoteVideoIds.push(videoId)
      const videoContainer = createVideoElement(videoId, event.streams[0])
      videoPanel.appendChild(videoContainer)
      // document.getElementById("received_video_1").srcObject = event.streams[0];
      // remoteVideoIds.push(videoId)
    }
    // document.getElementById("hangup-button").disabled = false
  }

  function handleICECandidateEvent(event) {
    if (event.candidate) {
      sendToServer({
        type: "new-ice-candidate",
        target: targetUsername,
        candidate: event.candidate,
      })
    }
  }

  function handleICEConnectionStateChangeEvent(event) {
    switch (myPeerConnectionList[targetUsername].iceConnectionState) {
      case "closed":
      case "failed":
      case "disconnected":
        closeVideoCall()
        break
    }
  }

  function handleSignalingStateChangeEvent(event) {
    switch (myPeerConnectionList[targetUsername].signalingState) {
      case "closed":
        closeVideoCall()
        break
    }
  }

  function handleICEGatheringStateChangeEvent(event) {
  }

  function handleUserlistMsg(msg) {
    var i
    var listElem = document.querySelector(".userlistbox")
    var onlineUsers = document.getElementById("onlineusers")

    // Remove all current list members. We could do this smarter,
    // by adding and updating users instead of rebuilding from
    // scratch but this will do for this sample.

    while (listElem.firstChild) {
      listElem.removeChild(listElem.firstChild)
    }

    while (onlineUsers.firstChild) {
      onlineUsers.removeChild(onlineUsers.firstChild)
    }

    // Add member names from the received list.

    msg.users.forEach(function (username) {
      if (username === myUsername) return
      
    })


    console.log("msg users:", msg.users)
  }

  function closeVideoCall() {
    var localVideo = document.getElementById("local_video")
    if (myPeerConnection) {
      myPeerConnection.ontrack = null
      myPeerConnection.onnicecandidate = null
      myPeerConnection.oniceconnectionstatechange = null
      myPeerConnection.onsignalingstatechange = null
      myPeerConnection.onicegatheringstatechange = null
      myPeerConnection.onnotificationneeded = null
      
      myPeerConnection.getTransceivers().forEach((transceiver) => {
        transceiver.stop()
      })

      if (localVideo.srcObject) {
        localVideo.pause()
        localVideo.srcObject.getTracks().forEach((track) => {
          track.stop()
        })
      }

      myPeerConnection.close()
      myPeerConnection = null
      webcamStream = null
    }

    // Disable the hangup button

    // document.getElementById("hangup-button").disabled = true
    targetUsername = null
  }

  function handleHangUpMsg(msg) {
    var userCheckbox = document.getElementById(msg.name)
    if (userCheckbox) {
      userCheckbox.checked = false
    }
    closeVideoCall()
  }

  function hangUpCall() {
    closeVideoCall()

    sendToServer({
      name: myUsername,
      target: targetUsername,
      type: "hang-up",
    })
  }

  async function invite(userName) {
    var clickedUsername = userName //evt.target.textContent;

    // Record the username being called for future reference

    targetUsername = clickedUsername

    // Call createPeerConnection() to create the RTCPeerConnection.
    // When this returns, myPeerConnection is our RTCPeerConnection
    // and webcamStream is a stream coming from the camera. They are
    // not linked together in any way yet.

    createPeerConnection()

    // Get access to the webcam stream and attach it to the
    // "preview" box (id "local_video").

    try {
      webcamStreamMap[targetUsername] =
        await navigator.mediaDevices.getUserMedia(mediaConstraints)
      document.getElementById("local_video").srcObject =
        webcamStreamMap[targetUsername]
    } catch (err) {
      handleGetUserMediaError(err)
      return
    }
    // await connectLocalVideo()

    // Add the tracks from the stream to the RTCPeerConnection

    try {
      console.log("webcam tracks:", webcamStreamMap[targetUsername].getTracks())
      webcamStreamMap[targetUsername]
        .getTracks()
        .forEach(
          (transceiver = (track) =>
            myPeerConnectionList[targetUsername].addTransceiver(track, {
              streams: [webcamStreamMap[targetUsername]],
            }))
        )
    } catch (err) {
      handleGetUserMediaError(err)
    }
  }

  async function handleVideoOfferMsg(msg) {
    targetUsername = msg.name
    console.log("recv message web stream map:", webcamStreamMap, targetUsername)
    console.log("recv message peer connection map:", myPeerConnectionList)
    // var myPeerConnection = myPeerConnectionList[targetUsername]
    var webcamStream = webcamStreamMap[targetUsername]

    // If we're not already connected, create an RTCPeerConnection
    // to be linked to the caller.

    // log("Received video chat offer from " + targetUsername);
    console.log("handle video offer message:", msg)
    if (!myPeerConnectionList[targetUsername]) {
      createPeerConnection()
    }

    // We need to set the remote description to the received SDP offer
    // so that our local WebRTC layer knows how to talk to the caller.

    var desc = new RTCSessionDescription(msg.sdp)

    // If the connection isn't stable yet, wait for it...

    if (myPeerConnectionList[targetUsername].signalingState != "stable") {

      // Set the local and remove descriptions for rollback; don't proceed
      // until both return.
      await Promise.all([
        myPeerConnectionList[targetUsername].setLocalDescription({
          type: "rollback",
        }),
        myPeerConnectionList[targetUsername].setRemoteDescription(desc),
      ])
      return
    } else {
      await myPeerConnectionList[targetUsername].setRemoteDescription(desc)
    }

    // Get the webcam stream if we don't already have it

    if (!webcamStream) {
      try {
        webcamStream = webcamStreamMap[targetUsername] =
          await navigator.mediaDevices.getUserMedia(mediaConstraints)
      } catch (err) {
        handleGetUserMediaError(err)
        return
      }

      document.getElementById("local_video").srcObject = webcamStream

      // Add the camera stream to the RTCPeerConnection

      try {
        webcamStream
          .getTracks()
          .forEach(
            (transceiver = (track) =>
              myPeerConnectionList[targetUsername].addTransceiver(track, {
                streams: [webcamStream],
              }))
          )
      } catch (err) {
        handleGetUserMediaError(err)
      }
    }


    await myPeerConnectionList[targetUsername].setLocalDescription(
      await myPeerConnectionList[targetUsername].createAnswer()
    )

    sendToServer({
      name: myUsername,
      target: targetUsername,
      type: "video-answer",
      sdp: myPeerConnectionList[targetUsername].localDescription,
    })
  }

  // Responds to the "video-answer" message sent to the caller
  // once the callee has decided to accept our request to talk.

  async function handleVideoAnswerMsg(msg) {

    // Configure the remote description, which is the SDP payload
    // in our "video-answer" message.

    console.log("answer msg:", msg)

    var desc = new RTCSessionDescription(msg.sdp)
    await myPeerConnectionList[targetUsername]
      .setRemoteDescription(desc)
      .catch(reportError)

    var onlineUser = document.getElementById(msg.name)
    if (onlineUser) {
      onlineUser.checked = true
    }
  }

  // A new ICE candidate has been received from the other peer. Call
  // RTCPeerConnection.addIceCandidate() to send it along to the
  // local ICE framework.

  async function handleNewICECandidateMsg(msg) {
    var candidate = new RTCIceCandidate(msg.candidate)

    try {
      await myPeerConnectionList[targetUsername].addIceCandidate(candidate)
    } catch (err) {
      reportError(err)
    }
  }

  function handleGetUserMediaError(e) {
    log_error(e)
    switch (e.name) {
      case "NotFoundError":
        alert(
          "Unable to open your call because no camera and/or microphone" +
            "were found."
        )
        break
      case "SecurityError":
      case "PermissionDeniedError":
        // Do nothing; this is the same as the user canceling the call.
        break
      default:
        alert("Error opening your camera and/or microphone: " + e.message)
        break
    }

    // Make sure we shut down our end of the RTCPeerConnection so we're
    // ready to try again.

    closeVideoCall()
  }

  // Handles reporting errors. Currently, we just dump stuff to console but
  // in a real-world application, an appropriate (and user-friendly)
  // error message should be displayed.

  function reportError(errMessage) {
    log_error(`Error ${errMessage.name}: ${errMessage.message}`)
  }

  const handleRecording = () => {
    const keys = Object.keys(webcamStreamMap)
    console.log('recording:', webcamStreamMap)
    keys.forEach((name) => {
      const recorder = new MediaRecorder(webcamStreamMap[name])
      const chunk = []
      recorder.start()
      recorder.onstop = (e) => {
        const blob = new Blob(chunk)
        const videoUrl = URL.createObjectURL(blob)
        // setRecordingUrl(videoUrl)
        recordingMap[name] = videoUrl
      }
      recorder.ondataavailable = (e) => {
        chunk.push(e.data)
      }
      recorderMap[name] = recorder 
      
    })
  }

  const handleStopRecording = () => {
    const keys = Object.keys(recorderMap)
    keys.forEach((recorder) => {
      recorder.stop()
    })
  }

  useEffect(() => {
    
  }, [])

  return (<>
    <Row gutter={[10, 24]}>
      <Col>当前用户: <span>{userName}</span></Col>
    </Row>
    <Row>
      <Col span={20} className="meeting">
        <div className="video-container">
            <video id="local_video" className="video" autoPlay muted></video>
            <p className="invite-user">{userName}</p>
        </div>
      </Col>
      <Col span={4}>
        <Space direction="vertical">
          <Button onClick={() => connect(userName)}>连接</Button>
          <Button onClick={startMeeting}>开启会议</Button>
          <Button onClick={handleRecording}>录像</Button>
          <Button onClick={handleStopRecording}>播放录像</Button>
        </Space>
        <ul>
          {onlineUsers.filter((item) => item !== userName).map((user, index) => (
            <li key={index}>
              <Checkbox onChange={(e) => handleUserCheck(e)(user)}>{user}</Checkbox>
            </li>
          ))}
        </ul>
      </Col>
    </Row>
  </>)
}

export default VideoCall
