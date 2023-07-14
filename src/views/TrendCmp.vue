<template>This is double trend</template>

<script lang="ts">
import { selectKeysStore } from '@/stores/stores';
import { defineComponent} from 'vue';
export default defineComponent({
    beforeCreate() {
        const keys = selectKeysStore()
        keys.setKeys(['TrendCmp'])
    },
})
</script>