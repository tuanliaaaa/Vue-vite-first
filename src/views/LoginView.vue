<template>
  <div class="login-wrapper">
    <form class="login-form" @submit.prevent="onSubmit">
      <h2>Login</h2>

      <div class="form-group">
        <label>Username</label>
        <input
          v-model="formLogin.username"
          type="text"
          placeholder="Enter your username"
        />
        <p v-if="fieldErrors.username" class="field-error">
          {{ fieldErrors.username }}
        </p>
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          v-model="formLogin.password"
          type="password"
          placeholder="Enter your password"
        />
        <p v-if="fieldErrors.password" class="field-error">
          {{ fieldErrors.password }}
        </p>
      </div>

      <button type="submit">Login</button>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/auth-service'
import { object, string } from '@/utils/validation-util'
import type {LoginPayload} from '@/services/auth-service'


const router = useRouter()

const formLogin = reactive<LoginPayload>({
  username: '',
  password: ''
})

const errorMessage = ref('')
const fieldErrors = reactive<Partial<Record<keyof LoginPayload, string>>>({})

const formLoginValidate = object({
  username: string().required().min(6),
  password: string().required().min(6),
})

const onSubmit = async () => {
  errorMessage.value = ''
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key as keyof LoginPayload])

  const errors = formLoginValidate.validate(formLogin)
  if (Object.keys(errors).length > 0) {
    for (const field in errors) {
      fieldErrors[field as keyof LoginPayload] = Array.isArray(errors[field])
        ? errors[field][0]
        : errors[field]
    }
    return
  }

  try {
    const  data  = await login(formLogin)
    localStorage.setItem('access_token', data.data.access_token)
    localStorage.setItem('refresh_token', data.data.refresh_token)
    router.push('/friend')
  } catch (err: any) {
    const status = err?.status
    const errors = err?.data

    if (status === 400 && errors && typeof errors === 'object') {
      for (const field in errors) {
        fieldErrors[field as keyof LoginPayload] = Array.isArray(errors[field])
          ? errors[field][0]
          : errors[field]
      }
    } else {
      errorMessage.value = err?.message || 'Đã xảy ra lỗi'
    }
  }
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f7fa;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 320px;
}

h2 {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input:focus {
  border-color: #3b82f6;
  outline: none;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s;
}

button:hover {
  background: #2563eb;
}

.field-error {
  color: red;
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
