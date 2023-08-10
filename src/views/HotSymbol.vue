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
import type { FormProps } from 'ant-design-vue';
import { CalendarOutlined, LikeOutlined} from '@ant-design/icons-vue';
import { defineComponent, reactive, ref, type Ref, type UnwrapRef} from 'vue';

interface FormState {
  orderDay: string;
}

interface DataItem {
    symbol: string;
    name:   string;
    day:    string; 
    vol:    number;
    open:   number;
    close:  number;
}

export default defineComponent({
    components:{
        CalendarOutlined,
        LikeOutlined 
    },
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
        const formState: UnwrapRef<FormState> = reactive({orderDay: ''});  
        const hotSource:Ref<DataItem[]> =ref([]);
        const handleFinish: FormProps['onFinish'] = () => {
            const day = formState.orderDay
            const apiUrl = `/taiyi/hq/get-hot?orderDay=${day}`
            HttpGet(apiUrl, (rsp:any)=>{
                hotSource.value.length = 0
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                rsp.forEach((val:any, _idx:number, _array:[]) => {
                    hotSource.value.push(val)
                })
            })            
        };
        const handleFinishFailed: FormProps['onFinishFailed'] = () => {

        };              
        return{
            pagination,
            columns,
            formState,
            handleFinish,
            handleFinishFailed,
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