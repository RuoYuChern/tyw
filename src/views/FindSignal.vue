<template>
    <a-row class="opt-row" :gutter="16" justify="space-between" align="middle">
        <a-col :span="12">
            <div class="gutter-box">
                <a-form layout="inline" :model="optState" @finish="getData" @finishFailed="handleOptFinishFailed">
                    <a-form-item label="交易日:">
                        <a-input v-model:value="optState.orderDay" placeholder="20230801">
                            <template #prefix><CalendarOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                        </a-input>
                    </a-form-item>                    
                    <a-form-item label="信号类型:">
                        <a-radio-group v-model:value="optState.buyOpt" @change="buyOptChange" name="optRadioGroup">
                            <a-radio :value="1">Buy</a-radio>
                            <a-radio :value="2">Sell</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" html-type="submit" :disabled="optState.orderDay === ''">
                            <template #icon><LikeOutlined /></template>Go
                        </a-button>
                    </a-form-item>                      
                </a-form>
            </div>
        </a-col>
        <a-divider type="vertical" />
        <a-col span="8" class="gutter-row">
            <div class="gutter-box">
                <a-form layout="inline" :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
                    <a-form-item label="回溯月份:">
                        <a-input v-model:value="formState.month" placeholder="202308">
                            <template #prefix><CalendarOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                        </a-input>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" html-type="submit" :disabled="formState.month === ''">
                            <template #icon><LikeOutlined /></template>Go
                        </a-button>
                        <a-modal v-model:open="open" width="1000px" :title="formState.month" @ok="handleOk">
                            <a-table :dataSource="backSource" :columns="backColumns" :pagination="pagination" class="data-row"></a-table>
                        </a-modal>
                    </a-form-item>             
                </a-form>
            </div>
        </a-col>
    </a-row>
    <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" class="data-row">
        <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'name'">
                <a :href="`/symbol?q=${text}`" target="_blank">{{ text }}</a>
            </template>
        </template>
    </a-table>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, type Ref, type UnwrapRef } from 'vue';
import {CalendarOutlined, LikeOutlined} from '@ant-design/icons-vue';
import {HttpGet} from '../utils/Axios'
import {selectKeysStore} from '../stores/stores'
import type { FormProps } from 'ant-design-vue';

interface DataItem {
    symbol: string;
    name: string;
    status: string;
    opt: string;
    lowday: string;
    highday: string;        
}

interface BackDataItem{
    day:string;
    total: number;
    success: number;
    failed: number;
    rate: number;
} 

interface OptFormState{
    orderDay: string;
    buyOpt: number;
}

interface FormState {
  month: string;
}

export default defineComponent({
    components:{
        CalendarOutlined,
        LikeOutlined
    },
    setup(){
        const pagination = {
            pageSizeOptions: ['10']
        }
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
        const backColumns = [
            {
            title: '交易日',
            dataIndex: 'day',
            },{
            title: '总数',
            dataIndex: 'total',
            },{
            title: '成功数',
            dataIndex: 'success',
            },{
            title: '失败数',
            dataIndex: 'failed',
            },{
            title: '成功率(%)',
            dataIndex: 'rate',
            }
        ];    
        const dataSource: Ref<DataItem[]> =ref([]);
        const backSource: Ref<BackDataItem[]> =ref([]);
        const open = ref<boolean>(false);
        const formState: UnwrapRef<FormState> = reactive({month: ''}); 
        const optState: UnwrapRef<OptFormState> = reactive({orderDay: '', buyOpt:1});
        const handleOptFinishFailed: FormProps['onFinishFailed'] = () => {};  
        const handleFinish: FormProps['onFinish'] = () => {
            let url = `/taiyi/hq/get-forward?month=${formState.month}`
            HttpGet(url, (rsp:any)=>{
                backSource.value.length = 0
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                rsp.forEach((val:any, _idx:number, _array:[]) => {
                    if(val.total != 0){
                        val.rate = ((val.success * 100.0)/val.total).toFixed(2)
                    }else{
                        val.rate = 0
                    }
                    backSource.value.push(val)
                });
                open.value = true
            })
        } 
        const handleFinishFailed: FormProps['onFinishFailed'] = () => {};  
        return{
            columns,
            backColumns,
            dataSource,
            backSource,
            open,
            pagination,
            formState,
            optState,
            handleOptFinishFailed,
            handleFinish,
            handleFinishFailed
        }
    },
    beforeMount() {
        const keys = selectKeysStore()
        keys.setKeys(['Signal'])
        this.getData()  
    },
    methods:{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        buyOptChange(_e:Event){
            this.getData() 
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleOk(_e: MouseEvent){
            this.open = false;
        },
        getData(){
            this.dataSource.length = 0
            let opt = ((this.optState.buyOpt.valueOf() == 1)? "BUY":"SELL")
            var url:string 
            if(this.optState.orderDay !== ""){
                url = `/taiyi/hq/get-stf?opt=${opt}&page=0&orderday=${this.optState.orderDay}`
            }else{
                url = `/taiyi/hq/get-stf?opt=${opt}&page=0`
            }
            HttpGet(url, (rsp:any)=>{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                rsp.forEach((val:any, _idx:number, _array:[]) => {this.dataSource.push(val)});
            })
        }
    }
});   
</script>

<style scoped lang="css">
.opt-row{
    height: 70px;
    background-color: #FFF;
    padding-left: 5px;
    margin-bottom: 10px;
}

.data-row{
    background-color: #FFF;
    margin-top: 10px;
}

.gutter-box {
    background-color: #FFF;
    padding: 8px 0;
}
</style>