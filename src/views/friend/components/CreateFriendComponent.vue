<template>
  <div v-if="showDialog" class="dialog-overlay">
    <div class="dialog">
      <h3>Create New Friend</h3>
      <input v-model="friendForm.full_name" placeholder="Full Name" />
      <p v-if="fieldErrors.full_name" class="field-error">{{ fieldErrors.full_name }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <div class="actions">
        <button @click="submitCreateFriend">Save</button>
        <button @click="cancelCreateFriend">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as FriendService from '@/services/friend-service'
import { object, string } from '@/utils/validation-util'
import type { Friend } from '@/services/friend-service'

const props = defineProps<{
  showDialog: boolean
}>()

const emit = defineEmits<{
  (e: 'save-friend', friend: Friend): void
  (e: 'update:showDialog', value: boolean): void
}>()

const errorMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})

const friendForm = ref<Partial<Friend>>({
  full_name: ''
})

const formFriendValidate = object({
  full_name: string().required().min(6)
})

const submitCreateFriend = async () => {
  errorMessage.value = ''
  fieldErrors.value = {}

  const errors = formFriendValidate.validate(friendForm.value)
  if (Object.keys(errors).length !== 0) {
    for (const field in errors) {
      fieldErrors.value[field] = Array.isArray(errors[field])
        ? errors[field][0]
        : errors[field]
    }
    return
  }

  try {
    const response = await FriendService.createFriend(friendForm.value)
    emit('save-friend', response)
    emit('update:showDialog', false)
  } catch (err: any) {
    const status = err.status
    const errors = err.data

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

const cancelCreateFriend = () => {
  emit('update:showDialog', false)
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1001;
}

.dialog input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.actions {
  text-align: right;
}

.actions button {
  margin-left: 10px;
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:hover {
  background-color: #0056b3;
}
</style>
