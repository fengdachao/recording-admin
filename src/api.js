import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

// const domain = 'http://192.168.3.2:3001'
const domain = 'http://localhost:3001'

export const getList = async (params) => {
  const res = await axios.get(`${domain}/api/list`, { params })
  return res.data.data
}

export const deleteItem = async (id, path) => {
  await axios.delete(`${domain}/api/remove`, { data: { id, path }})
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

export const removeConfig = async (id) => {
  await axios.delete(`${domain}/api/config/remove`, { params: {id}})
}

export const getUserList = async () => {
  return await axios.get(`${domain}/api/user/list`)
}

export const getUserById = async (name) => {
  const res = await axios.get(`${domain}/api/user/one`, { params: { name } })
  return res.status === 200 ? res.data : null
}

export const validate = async (name, password) => {
  const res = await axios.post(`${domain}/api/user/validate`, { name, password })
  return { success: res.data.validate === 'success', role: res.data.role }
}
