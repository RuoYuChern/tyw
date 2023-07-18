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
    vol:    number;
    hot:   number;
    hotDays:number;    
    lowday: string;
    highday: string;

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
            title: '热度值',
            dataIndex: 'hot',
        },                
        {
            title: '开始',
            dataIndex: 'lowday',
            sorter: (a:any, b:any) => { return a.lowday.localeCompare(b.lowday)}
        },{
            title: '最后',
            dataIndex: 'highday',
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