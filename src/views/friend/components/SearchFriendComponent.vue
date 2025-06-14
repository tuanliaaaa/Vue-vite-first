<template>
  <div>
    <input v-model="searchForm.full_name" placeholder="Full Name" />
    <button @click="searchFriend">Search</button>
    <button @click="showSaveDialog = true">Add</button>

    <CreateFriendComponent
      v-if="showSaveDialog"
      :showDialog="showSaveDialog"
      @update:showDialog="updateShowSaveDialog"
      @save-friend="handleSaveFriend"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CreateFriendComponent from './CreateFriendComponent.vue'
import type { Friend } from '@/services/friend-service'

// Emits
const emit = defineEmits<{
  (e: 'search-friend', filters: { full_name: string }): void
  (e: 'save-friend', newFriend: Friend): void
}>()

// State
const searchForm = ref<{ full_name: string }>({ full_name: '' })
const showSaveDialog = ref(false)

// Methods
const searchFriend = () => {
  emit('search-friend', { ...searchForm.value })
}
const handleSaveFriend = (data: Friend) => {
  updateShowSaveDialog(false);
  emit('save-friend', data)
}
const updateShowSaveDialog = (data:boolean)=>{
  showSaveDialog.value=data;
}
</script>

<style scoped>
div {
  margin-bottom: 16px;
}

input {
  margin-right: 10px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
