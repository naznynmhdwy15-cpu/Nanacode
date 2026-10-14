
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})


axiosInstance.interceptors.request.use(
  (config) => {
   
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(

(response) => response,
(error) => {
  if (!error.response) {
    console.error('Network error:', error.message)
  } else {
    console.error(
      'API error:',
      error.response.status,
      JSON.stringify(error.response.data, null, 2)
    )
  }

  return Promise.reject(error)
}

  
)

export default axiosInstance
