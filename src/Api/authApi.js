
import axiosInstance from './axiosInstance'

export const loginApi = (data) => {
  return axiosInstance.post('/api/auth/login', data)
}

export const registerApi = (data) => {
  return axiosInstance.post('/api/auth/register', data)
}

export const forgotPasswordApi = (data) => {
  return axiosInstance.post('/api/auth/forgot-password', data)
}
