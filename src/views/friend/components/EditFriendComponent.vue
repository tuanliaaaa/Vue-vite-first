<template>
  <div class="dialog-overlay">
    <div class="dialog">
      <h3>Sửa Thông Tin Bạn Bè</h3>
      <input v-model="localFriend.full_name" placeholder="Tên đầy đủ" />
      <p v-if="fieldErrors.full_name" class="field-error">
        {{ fieldErrors.full_name }}
      </p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <div class="actions">
        <button @click="saveEdit">Sửa</button>
        <button @click="closeDialog">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import * as FriendService from '@/services/friend-service'
import { object, string } from '@/utils/validation-util'
import type { Friend } from '@/services/friend-service'

// Props & Emits
const props = defineProps<{
  friend: Friend
}>()

const emit = defineEmits<{
  (e: 'edit-friend', data: Friend): void
  (e: 'close-edit'): void
}>()

// State
const localFriend = ref<Friend>({ ...props.friend })
const errorMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})

// Validation schema
const formFriendValidate = object({
  full_name: string().required().min(6),
})

// Watch when friend prop changes
watch(
  () => props.friend,
  (newVal) => {
    localFriend.value = { ...newVal }
  }
)

// Save edit handler
const saveEdit = async () => {
  errorMessage.value = ''
  fieldErrors.value = {}

  const errors = formFriendValidate.validate(localFriend.value)
  if (Object.keys(errors).length > 0) {
    for (const field in errors) {
      fieldErrors.value[field] = Array.isArray(errors[field])
        ? errors[field][0]
        : errors[field]
    }
    return
  }

  try {
    const response = await FriendService.updateFriend(props.friend.id, {
      ...localFriend.value,
    })
    emit('edit-friend', { ...response })
  } catch (err: any) {
    const status = err?.status
    const errors = err?.data

    if (status === 400 && typeof errors === 'object') {
      for (const field in errors) {
        fieldErrors.value[field] = Array.isArray(errors[field])
          ? errors[field][0]
          : errors[field]
      }
    } else {
      errorMessage.value = err?.message || 'Đã xảy ra lỗi'
    }
  }
}

// Close dialog
const closeDialog = () => {
  emit('close-edit')
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.dialog {
  background: white;
  padding: 20px 30px;
  border-radius: 10px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dialog input {
  width: 100%;
  padding: 8px 10px;
  margin: 15px 0;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.actions button {
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.actions button:first-child {
  background-color: #28a745;
  color: white;
}

.actions button:first-child:hover {
  background-color: #218838;
}

.actions button:last-child {
  background-color: #dc3545;
  color: white;
}

.actions button:last-child:hover {
  background-color: #c82333;
}
</style>
