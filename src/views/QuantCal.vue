<template>
    <a-row justify="start" class="row-item" :gutter="[10,10]">
        <a-col :span="6">
            <a-form :model="quatnItem" name="tradeing-form" @finish="onFinish" @finishFailed="onFinishFailed">
                <a-form-item label="股票" name="stock" :rules="[{ required: true, message: '输入股票名称!' }]">
                    <a-input v-model:value="quatnItem.stock" />
                </a-form-item>
                <a-form-item label="策略" name="method" :rules="[{ required: true, message: '选择策略名称!' }]">
                    <a-select ref="select" v-model:value="quatnItem.method" style="width: 120px" @focus="focus" @change="handleChange">
                        <a-select-option v-for="(item,index) in methodItems" :key="index" :value="item">{{item}}</a-select-option>
                    </a-select>
                </a-form-item> 
                <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
                    <a-button type="primary" html-type="submit">预测</a-button>
                </a-form-item>                                                
            </a-form>
        </a-col>
        <a-col :span="6">
            <a-button type="primary" @click="onUpdate">刷新</a-button>
        </a-col>
    </a-row>
    <a-table class="row-table" :columns="columns" :data-source="dataSource" size="middle">
        <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'symbol'">
                <a href="javascript:;">{{ text }}</a>
            </template>
        </template>
    </a-table>  
</template>
<script lang="ts">
import { DoAuthPost, HttpGet } from '@/utils/Axios';
import { defineComponent, reactive, ref, type Ref } from 'vue';

interface QuantItem{
    stock:string;
    method:string;
}
interface QuantResult{
    status:number;
    msg:string;
    tid:string;
    method:string;
    symbol:string;
    name:string;
    day:string;
    action:string;
}
export default defineComponent({
    setup(){
        const quatnItem = reactive<QuantItem>({stock: '',method:""});
        const methodItems = ['BASE','LG','MACD','HL','DP'];
        const focus = () => {};
        const columns = [{title:'单据', dataIndex:'tid', key:"tid"},
        {title:'股票', dataIndex:'name', key:"name"},
        {title:'代码', dataIndex:'symbol', key:"symbol"},
        {title:'策略', dataIndex:'method', key:"method"},
        {title:'状态', dataIndex:'status', key:"status"},
        {title:'信息', dataIndex:'msg', key:"msg"},
        {title:'建议动作', dataIndex:'action', key:"action"},
        {title:'日期', dataIndex:'day', key:"day"}];
        const dataSource: Ref<QuantResult[]> =ref([]);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const onFinish = (_: any) => {
            const apiUrl = `/taiyi/hq/do-quant?stock=${quatnItem.stock}&method=${quatnItem.method}`
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            DoAuthPost(apiUrl,"" , function cb(_rsp:any){
                quatnItem.stock = ''
                quatnItem.method = ''
                console.log('do quant sucessfully');
            })
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handleChange = (_value: string) => {};        
        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };  
        const onUpdate = ()=>{
            const apiUrl = '/taiyi/hq/get-quant-cb'
            HttpGet(apiUrl, (rsp:any)=>{
                if (rsp.length == 0){
                    return
                }
                dataSource.value.length = 0
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                rsp.forEach((val:any, _idx:number, _array:[]) =>{
                    dataSource.value.push(val)
                })
            })
            console.log("onupdate")
        }       
        return{
            quatnItem,
            methodItems,
            focus,
            onFinish,
            onFinishFailed,
            handleChange,
            columns,
            dataSource,
            onUpdate 
        }
    }
})
</script>

<style lang="less" scoped>
.row-item{
    padding: 1rem;
    background-color: #FFF; 
}

.row-table{
    margin-top: 1rem;
    background-color: #FFF; 
}
</style>