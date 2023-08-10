<template>
     <a-row class="opt-row">
        <a-form layout="inline" :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
            <a-form-item>
                <a-input v-model:value="formState.orderDay" placeholder="20230804">
                    <template #prefix><CalendarOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" :disabled="formState.orderDay === ''">
                    <template #icon><LikeOutlined /></template>
                    Go
                </a-button>
            </a-form-item>             
        </a-form>
    </a-row>    
    <a-row :gutter="8">
        <a-col span="12">
            <a-table :dataSource="upSource" :columns="columns" :pagination="pagination" size="small" class="data-row">
                <template #bodyCell="{ column, text }">
                    <template v-if="column.dataIndex === 'name'">
                        <a :href="`/symbol?q=${text}`" target="_blank">{{ text }}</a>
                    </template>
                    <template v-if="column.dataIndex === 'flag'">涨停</template>                    
                </template>
            </a-table>
        </a-col>
        <a-col span="12">
            <a-table :dataSource="downSource" :columns="columns" :pagination="pagination" size="small" class="data-row">
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
import type { FormProps } from 'ant-design-vue';
import { CalendarOutlined, LikeOutlined} from '@ant-design/icons-vue';

import { HttpGet } from '@/utils/Axios';
import { defineComponent, reactive, ref, type Ref, type UnwrapRef} from 'vue';
interface FormState {
  orderDay: string;
}

interface DataItem {
    symbol: string;
    name:   string;
    close:  number;
    preClose:  number;
    pctChange:  number;
    day:    string;
    flag:   number;        
} 

export default defineComponent({
    components:{
        CalendarOutlined,
        LikeOutlined 
    },
    setup(){
        const pagination = {
            pageSizeOptions: ['20']
        };
        const columns = [
            {
            title: '股票',
            dataIndex: 'name',
            },{
            title: '编码',
            dataIndex: 'symbol',
            },{
            title: '今收',
            dataIndex: 'close',
            },{
            title: '昨收',
            dataIndex: 'preClose',
            },{
            title: '涨(跌)幅',
            dataIndex: 'pctChange',
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
        const formState: UnwrapRef<FormState> = reactive({orderDay: ''}); 
            const handleFinish: FormProps['onFinish'] = () => {
            const day = formState.orderDay
            const apiUrl = `/taiyi/hq/get-up-down?orderDay=${day}`
            HttpGet(apiUrl, (rsp:any)=>{
                upSource.value.length = 0
                downSource.value.length = 0
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                rsp.forEach((val:any, _idx:number, _array:[]) => {
                    val.pctChange = val.pctChange.toFixed(2)
                    if(val.flag === 1){
                        upSource.value.push(val)
                    }else{
                        downSource.value.push(val)                   
                    }
                })
            })            
        };
        const handleFinishFailed: FormProps['onFinishFailed'] = () => {

        };             
        return {
            pagination,
            formState,
            columns,
            upSource,
            downSource,
            handleFinish,
            handleFinishFailed
        }        
    },
    beforeMount() {
        const keys = selectKeysStore()
        keys.setKeys(['UpDown'])
        const apiUrl = '/taiyi/hq/get-up-down'
        HttpGet(apiUrl, (rsp:any)=>{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            rsp.forEach((val:any, _idx:number, _array:[]) => {
                val.pctChange = val.pctChange.toFixed(2)
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
.opt-row{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: end;
    background-color: #FFF;
    height: 60px;
}
.data-row{
    background-color: #FFF;
    margin-top: 10px;
}
</style>