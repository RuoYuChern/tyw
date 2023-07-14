<template>This is up down</template>

<script lang="ts">
import { selectKeysStore } from '@/stores/stores';
import { defineComponent} from 'vue';
export default defineComponent({
    beforeCreate() {
        const keys = selectKeysStore()
        keys.setKeys(['UpDown'])
    },
})
</script>