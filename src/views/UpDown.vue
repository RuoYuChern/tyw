<template>
    <a-row :gutter="8">
        <a-col span="12">
            <a-table :dataSource="upSource" :columns="columns" :pagination="pagination" class="data-row">
                <template #bodyCell="{ column, text }">
                    <template v-if="column.dataIndex === 'name'">
                        <a :href="`/symbol?q=${text}`" target="_blank">{{ text }}</a>
                    </template>
                    <template v-if="column.dataIndex === 'flag'">涨停</template>                    
                </template>
            </a-table>
        </a-col>
        <a-col span="12">
            <a-table :dataSource="downSource" :columns="columns" :pagination="pagination" class="data-row">
                <template #bodyCell="{ column, text }">
                    <template v-if="column.dataIndex === 'name'">
                        <a :href="`/symbol?q=${text}`" target="_blank">{{ text }}</a>
                    </template>
                    <template v-if="column.dataIndex === 'flag'">跌停</template>                     
                </template>
            </a-table>
        </a-col> 
    </a-row>   
</template>

<script lang="ts">
import { selectKeysStore } from '@/stores/stores';
import { HttpGet } from '@/utils/Axios';
import { defineComponent, ref, type Ref} from 'vue';
interface DataItem {
    symbol: string;
    name:   string;
    day:    string;
    flag:   number;        
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
            title: '交易日',
            dataIndex: 'day',
            },{
            title: '涨(跌)停',
            dataIndex: 'flag',
            }
        ]; 
        const upSource:Ref<DataItem[]> =ref([]);
        const downSource:Ref<DataItem[]> =ref([]);
        return {
            pagination,
            columns,
            upSource,
            downSource,
        }        
    },
    beforeMount() {
        const keys = selectKeysStore()
        keys.setKeys(['UpDown'])
        const apiUrl = '/taiyi/hq/get-up-down'
        HttpGet(apiUrl, (rsp:any)=>{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            rsp.forEach((val:any, _idx:number, _array:[]) => {
                if(val.flag === 1){
                    this.upSource.push(val)
                }else{
                    this.downSource.push(val)                   
                }
            });                          
        })        
    },
})
</script>

<style scoped lang="css">
</style>