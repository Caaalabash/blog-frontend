import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { isEmpty } from '@/utils'

export const useUserStore = defineStore('user', () => {
  const user = ref({})

  const userName = computed(() => user.value.userName)
  const isLogin = computed(() => !isEmpty(userName))

  const setUser = (payload) => user.value = payload

  return { user, userName, isLogin, setUser }
})
