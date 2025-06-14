import api from '../utils/rest-util'

export interface Friend {
  id: number
  full_name: string
  [key: string]: any
}

export type FriendFilter = Record<string, any>

// Search list friend
export async function getListFriend(filters: FriendFilter = {}): Promise<Friend[]> {
  try {
    const response = await api.get<{ data: Friend[] }>('/friend', { params: filters })
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

// Create new friend
export async function createFriend(data: Partial<Friend>): Promise<Friend> {
  try {
    const response = await api.post<{ data: Friend }>('/friend', data)
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

// Update friend
export async function updateFriend(id: number, data: Partial<Friend>): Promise<Friend> {
  try {
    const response = await api.patch<{ data: Friend }>(`/friend/${id}/`, data)
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

// Delete friend
export async function deleteFriend(id: number): Promise<Friend> {
  try {
    const response = await api.delete<{ data: Friend }>(`/friend/${id}/`)
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}
