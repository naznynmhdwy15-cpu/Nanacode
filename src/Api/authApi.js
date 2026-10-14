import axiosInstance from './axiosInstance'

export const loginApi = (data) =>
  axiosInstance.post('/Sign/Login', data)

export const sendVerifyMessageApi = (data) =>
  axiosInstance.post('/Sign/SendVerifyMessage', data)

export const verifyMessageApi = (data) =>
  axiosInstance.post('/Sign/VerifyMessage', data)

export const registerApi = (data) =>
  axiosInstance.post('/Sign/Register', data)

export const forgotPasswordApi = (data) =>
  axiosInstance.post('/Sign/ForgetPassword', data)

export const resetPasswordApi = (data) =>
  axiosInstance.post('/Sign/Reset', data)
