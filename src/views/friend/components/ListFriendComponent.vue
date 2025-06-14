<template>
  <div>
    <table v-if="!loading" border="1" cellspacing="0" cellpadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="friend in lstFriend"
          :key="friend.id"
          @click="openEditDialog(friend)"
        >
          <td>{{ friend.id }}</td>
          <td>{{ friend.full_name }}</td>
          <td>
            <button @click.stop="deleteFriend(friend.id)">Xoá</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>Đang tải dữ liệu...</div>

    <EditFriendComponent
      v-if="showEditDialog"
      :friend="friendToEdit"
      @close-edit="showEditDialog = false"
      @edit-friend="handleEditFriend"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EditFriendComponent from '@/views/friend/components/EditFriendComponent.vue'
import * as FriendService from '@/services/friend-service'
import type { Friend } from '@/services/friend-service'

defineProps<{
  lstFriend: Friend[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'delete-friend', id: number): void
  (e: 'edit-friend', friend: Friend): void
}>()

const showEditDialog = ref(false)
const friendToEdit = ref<Friend>()

const openEditDialog = (friend: Friend) => {
  friendToEdit.value = { ...friend }
  showEditDialog.value = true
}

const deleteFriend = async (id: number) => {
  try {
    await FriendService.deleteFriend(id)
    emit('delete-friend', id)
  } catch (error) {
    console.error('Detete Fail:', error)
  }
}

const handleEditFriend = (editFriend: Friend) => {
  showEditDialog.value = false
  emit('edit-friend', editFriend)
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f0f0f0;
}

button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
