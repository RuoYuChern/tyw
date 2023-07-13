<template>
    <a-row class="opt-row">
        <a-form layout="inline" :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
            <a-form-item>
                <a-input v-model:value="formState.stock" placeholder="中国平安">
                    <template #prefix><EditOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" :disabled="formState.stock === ''">
                    <template #icon><LikeOutlined /></template>
                    Go
                </a-button>
            </a-form-item>            
        </a-form>
    </a-row>
    <a-row class="kline-row">
        <a-col span="8">
            <a-card title="价格趋势">
            <!-- <div id="chart">
                <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
            </div> -->
            </a-card>
        </a-col>
        <a-col span="8">
            <a-card title="MA-成交量">
            <!-- <div id="chart">
                <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
            </div> -->
            </a-card>
        </a-col>
        <a-col span="8">
            <a-card title="LH-动量">
            <!-- <div id="chart">
                <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
            </div> -->
            </a-card>
        </a-col>        
    </a-row>
</template>


<script lang="ts">
import { defineComponent, reactive, ref, type Ref, type UnwrapRef } from 'vue';
import type { FormProps } from 'ant-design-vue';
import {EditOutlined, LikeOutlined} from '@ant-design/icons-vue';
import ApexCharts from 'apexcharts'
import {HttpGet} from '../utils/Axios'

interface FormState {
  stock: string;
}

export default defineComponent({
    components:{
        EditOutlined,
        LikeOutlined,
        apexchart: ApexCharts
    },
    setup(){
        const formState: UnwrapRef<FormState> = reactive({stock: ''});
        const dayList: Ref<string[]> =ref([]);
        const openList: Ref<number[]> =ref([]);
        const close: Ref<number[]> =ref([]);
        const high: Ref<number[]> =ref([]);
        const low: Ref<number[]> =ref([]);  
        const vol: Ref<number[]> =ref([]);
        const hld: Ref<number[]> =ref([]);
        const lsma: Ref<number[]> =ref([]); 
        const ssma: Ref<number[]> =ref([]);  
        const mtn: Ref<number[]> =ref([]);    
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handleFinish: FormProps['onFinish'] = _values => {
            let stock = formState.stock
            let apiUrl = `/taiyi/hq/get-trend?stock=${stock}`
            HttpGet(apiUrl, (rsp:any)=>{
                dayList.value.length = 0
                openList.value.length = 0
                close.value.length = 0
                close.value.length = 0
                console.log("len:", rsp.length)
            })
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handleFinishFailed: FormProps['onFinishFailed'] = _errors => {
            
        };
        return{
            formState,
            handleFinish,
            handleFinishFailed,
            dayList,
            openList,
            close,
            high,
            low,
            vol,
            hld,
            lsma,
            ssma,
            mtn 
        };
    },
})
</script>

<style lang="css">
.opt-row{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: end;
    background-color: #FFF;
    height: 60px;
}
.kline-row{
    margin-top: 10px;
}
</style>