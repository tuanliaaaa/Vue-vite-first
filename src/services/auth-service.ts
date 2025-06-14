import api, { type CustomAxiosRequestConfig } from '@/utils/rest-util'
export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  data: {
    access_token: string
    refresh_token: string
  }
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/login', payload, {
      useToken: false
    }as CustomAxiosRequestConfig)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}
