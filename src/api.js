import axios from 'axios'

const domain = 'http://localhost:3001'

export const getList = async () => {
  const res = await axios.get(`${domain}/api/list`)
  return res.data.data
}

export const deleteItem = async (id, path) => {
  await axios.delete(`${domain}/api/remove`, { data: { id, path }})
}
