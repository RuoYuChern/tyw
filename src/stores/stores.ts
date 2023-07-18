import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  return { count, doubleCount, increment }
})

export const selectKeysStore = defineStore('selectKeys', ()=>{
  const keys = ref([''])
  function setKeys(newKeys:string[]) {
      keys.value = newKeys
  }
  return {keys, setKeys}
})

export const userTokenStore = defineStore('userToken', ()=>{
  const tokens = ref('')
  function setToken(token:string) {
    tokens.value = token
    sessionStorage.setItem('tyw.token', token)
  }
  function isAuth():boolean{
    if(tokens.value === ''){
        const tk = sessionStorage.getItem('tyw.token')
        if(tk !== null){
          tokens.value = tk
        }
    }
    return (tokens.value !== '')
  }
  return {tokens, isAuth, setToken} 
})
