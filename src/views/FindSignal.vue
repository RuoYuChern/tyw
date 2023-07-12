<template>
    <a-table :dataSource="dataSource" :columns="columns" />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, type Ref } from 'vue';
interface DataItem {
    symbol: string;
    name: string;
    status: string;
    opt: string;
    lowday: string;
    highday: string;        
} 

export default defineComponent({
    setup(){
        const columns = [
            {
            title: '股票',
            dataIndex: 'name',
            },{
            title: '编码',
            dataIndex: 'symbol',
            },{
            title: '状态',
            dataIndex: 'status',
            },{
            title: '买/卖',
            dataIndex: 'opt',
            },{
            title: '首次',
            dataIndex: 'lowday',
            },{
            title: '最后',
            dataIndex: 'highday',
            },
        ];        
        const dataSource: Ref<DataItem[]> =ref([]);
        return{
            columns,
            dataSource
        }
    },
});   
</script>