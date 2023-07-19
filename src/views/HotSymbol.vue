<template>
     <a-table :dataSource="hotSource" :columns="columns" :pagination="pagination" class="data-row">
        <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'name'">
                <a :href="`/symbol?q=${text}`" target="_blank">{{ text }}</a>
            </template>
        </template>
    </a-table>
</template>


<script lang="ts">
import { selectKeysStore } from '@/stores/stores';
import { HttpGet } from '@/utils/Axios';
import { defineComponent, ref, type Ref} from 'vue';
interface DataItem {
    symbol: string;
    name:   string;
    day:    string; 
    vol:    number;
    open:   number;
    close:  number;
}

export default defineComponent({
    setup(){
        const pagination = {
            pageSizeOptions: ['10']
        };
        const columns = [
        {
            title: '股票',
            dataIndex: 'name',
        },{
            title: '编码',
            dataIndex: 'symbol',
        },{
            title: '交易量(手)',
            dataIndex: 'vol',
        },{
            title: '开盘价',
            dataIndex: 'open',
        },{
            title: '收盘价',
            dataIndex: 'close',
        },{
            title: '交易日',
            dataIndex: 'day',
            sorter: (a:any, b:any) => { return a.day.localeCompare(b.day)}
        }
        ];  
        const hotSource:Ref<DataItem[]> =ref([]);              
        return{
            pagination,
            columns,
            hotSource
        }        
    },
    beforeMount() {
        const keys = selectKeysStore()
        keys.setKeys(['HotSymbol'])
        const apiUrl = '/taiyi/hq/get-hot' 
        HttpGet(apiUrl, (rsp:any)=>{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            rsp.forEach((val:any, _idx:number, _array:[]) => {
                this.hotSource.push(val)
            })
        })       
    }
})

</script>