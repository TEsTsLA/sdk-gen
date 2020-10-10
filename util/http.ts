import axios from 'axios'
export default axios.create({
  baseURL: 'https://localhost:3000',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
})