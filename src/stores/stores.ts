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
