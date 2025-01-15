import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { HOST } from './constant'

// const domain = 'http://api-server:3001'
const domain = `http://${HOST}:3001`

export const getList = async (params) => {
  const res = await axios.get(`${domain}/api/list`, { params })
  return res.data.data
}

export const deleteItem = async (id, path) => {
  await axios.delete(`${domain}/api/remove`, { data: { id, path }})
}

export const deleteFromList = async (query) => {
  await axios.delete(`${domain}/api/list/remove`, { data: query })
}

export const getConfigData = async () => {
  const res = await axios.get(`${domain}/api/config/list`)
  return res.data
}

export const getConfigParam = async () => {
  const res = await axios.get(`${domain}/api/config/param`)
  return res.data
}

export const getConfigById = async (id) => {
  const res = await axios.get(`${domain}/api/config/one`, { params: { id } })
  return res.data
}

export const addConfigData = async (config) => {
  await axios.post(`${domain}/api/config/add`, {
    ...config,
    id: uuidv4(),
  })
}

export const updateConfig = async (config) => {
  await axios.put(`${domain}/api/config/update`, config)
}

export const updateConfigParam = async (config) => {
  await axios.put(`${domain}/api/config/param/update`, config)
}

export const removeConfig = async (id) => {
  await axios.delete(`${domain}/api/config/remove`, { params: {id}})
}

export const getUserList = async () => {
  return await axios.get(`${domain}/api/user/list`)
}

export const getUserById = async (id) => {
  const res = await axios.get(`${domain}/api/user/one`, { params: { id } })
  return res.status === 200 ? res.data : null
}

export const validate = async (name, password) => {
  const res = await axios.post(`${domain}/api/user/validate`, { name, password })
  return { success: res.data.validate === 'success', role: res.data.role }
}

export const addUser = async (user) => {
  const params = {
    ...user,
    time: new Date().toLocaleString(),
  }
  const res = await axios.post(`${domain}/api/user/add`, params)
  return res
}

export const updateUser = async (user) => {
  const params = {
    ...user,
    time: new Date().toLocaleString(),
  }
  const res = await axios.put(`${domain}/api/user/update`, params)
  return res
}

export const deleteUser = async (id) => {
  await axios.delete(`${domain}/api/user/delete?id=${id}`)
}

export const batchDownload = async (fileUrls) => {
  const res = await axios.post(`${domain}/api/list/batch-download`, fileUrls)
  console.log('res:', res)
  return res.data
}