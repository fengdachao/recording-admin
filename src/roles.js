const roles = {
  admin: [
    ['recording', ['recording-list']],
    ['video', ['video-call', 'video-list']],
    ['config', ['config-list']],
    ['user', ['user-list']]
  ],
  user: [
    ['recording', ['recording-list']],
    ['video', ['video-call', 'video-list']],
  ]
}

export default roles
