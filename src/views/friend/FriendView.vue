<template>
  <div id="page-content-friend">
    <div id="page-search-friend">
      <SearchFriendComponent 
        @search-friend="handleSearchFriend" 
        @save-friend="handleSaveFriend" 
      />
    </div>
    <div id="page-data-friend">
      <ListFriendComponent 
        :lstFriend="lstFriend" 
        :loading="loading" 
        @delete-friend="handleDeleteFriend" 
        @edit-friend="handleEditFriend" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SearchFriendComponent from '@/views/friend/components/SearchFriendComponent.vue'
import ListFriendComponent from '@/views/friend/components/ListFriendComponent.vue'
import * as FriendService from '@/services/friend-service'
import type { Friend } from '@/services/friend-service'

const lstFriend = ref<Friend[]>([])

const loading = ref<boolean>(true)

// Load list friend
const loadFriends = async (filters: Record<string, any> = {}) => {
  loading.value = true
  try {
    const res = await FriendService.getListFriend(filters)
    lstFriend.value = res
  } catch (err) {
    console.error('Fetch friends error:', err)
  } finally {
    loading.value = false
  }
}

const refreshFriend = (filters: Record<string, any> = {}) => {
  loadFriends(filters)
}

const handleSearchFriend = (filterData: Record<string, any>) => {
  refreshFriend(filterData)
}

const handleDeleteFriend = () => {
  refreshFriend()
}

const handleSaveFriend = () => {
  refreshFriend()
}

const handleEditFriend = () => {
  refreshFriend()
}

onMounted(() => {
  loadFriends()
})
</script>

<style scoped>
#page-content-friend {
  margin-top: 10px;
}
</style>
