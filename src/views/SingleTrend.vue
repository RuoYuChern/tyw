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
        <a-col span="24">
            <div id="prcieChart" v-if="priceSeries.length > 0">
                <apexchart type="line" height="350" :options="chartLineOpt" :series="priceSeries"></apexchart>
            </div>
            <div id="prcieChart" v-else>No Data</div>            
        </a-col>
        <!-- <a-col span="12">
            <div id="mtnChart" v-if="mtnSeries.length > 0">
                <apexchart type="line" height="350" :options="chartLineOpt" :series="mtnSeries"></apexchart>
            </div>
            <div id="mtnChart" v-else>No Data</div>            
        </a-col>        -->
    </a-row>
    <a-row class="kline-row">
        <a-col span="24">
            <div id="volChart" v-if="volSeries.length > 0">
                <apexchart type="line" height="350" :options="mixLineOpt" :series="volSeries"></apexchart>
            </div>
            <div id="volChart" v-else>No Data</div>
        </a-col>
        <!-- <a-col span="12">
            <div id="fundInChart" v-if="fundInSeries.length > 0">
                <apexchart type="line" height="350" :options="mixLineOpt" :series="fundInSeries"></apexchart>
            </div>
            <div id="fundInChart" v-else>No Data</div>
        </a-col>           -->
    </a-row>
</template>


<script lang="ts">
import { defineComponent, shallowRef, reactive, ref, type Ref, type UnwrapRef } from 'vue';
import type { FormProps } from 'ant-design-vue';
import {EditOutlined, LikeOutlined} from '@ant-design/icons-vue';
import VueApexCharts from "vue3-apexcharts";
import {HttpGet} from '../utils/Axios'
import {toLinOption, toSeries, NamedSeries, toMixOption} from '../utils/ChartDatas'
import { selectKeysStore } from '@/stores/stores';

interface FormState {
  stock: string;
}

export default defineComponent({
    components:{
        EditOutlined,
        LikeOutlined,
        apexchart: VueApexCharts
    },
    setup(){
        const formState: UnwrapRef<FormState> = reactive({stock: ''});
        const openList = toSeries("开盘价","line");
        const close    = toSeries("收盘价","line");
        const vol      = toSeries("成交量","column");
        const hld      = toSeries("高低差","column");
        const lsma     = toSeries("SMA-10","line");
        const ssma     = toSeries("SMA-8","line");
        const fund     = toSeries("资金流向","line");
        const mtn      = toSeries("动量","column"); 
        const chartLineOpt = shallowRef(toLinOption(""))
        const mixLineOpt = shallowRef(toMixOption(""))
        const priceSeries:Ref<NamedSeries[]> = ref([])
        const volSeries:Ref<NamedSeries[]> = ref([])
        const mtnSeries:Ref<NamedSeries[]> = ref([])
        const fundInSeries:Ref<NamedSeries[]> = ref([])
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handleFinish: FormProps['onFinish'] = _values => {
            const stock = formState.stock
            const apiUrl = `/taiyi/hq/get-trend?stock=${stock}`
            HttpGet(apiUrl, (rsp:any)=>{
                if (rsp.length == 0){
                    return
                }
                openList.data.length = 0
                close.data.length = 0
                vol.data.length = 0
                hld.data.length = 0
                lsma.data.length = 0
                ssma.data.length = 0
                mtn.data.length = 0
                const lablas:string [] = []
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                rsp.forEach((val:any, _idx:number, _array:[]) =>{
                    lablas.push(val.day)
                    openList.data.push(val.open)
                    close.data.push(val.close)
                    vol.data.push(val.vol)
                    hld.data.push(val.hld)
                    lsma.data.push(val.lsma)
                    ssma.data.push(val.ssma)
                    mtn.data.push(val.mtn)
                    fund.data.push(val.fundIn)
                })
                const lineOpt = toLinOption("")
                lineOpt.xaxis.categories = lablas
                lineOpt.title.text = stock

                const mixOpt = toMixOption("")
                mixOpt.labels = lablas
                mixOpt.title.text = stock
                mixOpt.yaxis[0].title.text = "成交量(万手)"
                mixOpt.yaxis[1].title.text = "价格/资金(千万)"

                chartLineOpt.value = lineOpt
                mixLineOpt.value = mixOpt

                priceSeries.value.length = 0
                priceSeries.value.push(openList)
                priceSeries.value.push(close)
                priceSeries.value.push(lsma)
                priceSeries.value.push(ssma)
                //priceSeries.value.push(mtn)

                volSeries.value.length = 0
                volSeries.value.push(vol)
                volSeries.value.push(close)

                fundInSeries.value.length = 0
                fundInSeries.value.push(vol)
                fundInSeries.value.push(fund)

                mtnSeries.value.length = 0
                mtnSeries.value.push(close)
                mtnSeries.value.push(hld)
                mtnSeries.value.push(mtn)
            })
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handleFinishFailed: FormProps['onFinishFailed'] = _errors => {
            
        };
        return{
            formState,
            handleFinish,
            handleFinishFailed,
            openList,
            close,
            vol,
            hld,
            lsma,
            ssma,
            mtn,
            chartLineOpt,
            mixLineOpt,
            priceSeries,
            volSeries,
            mtnSeries,
            fundInSeries 
        };
    },
    beforeCreate() {
        const keys = selectKeysStore()
        keys.setKeys(['Trend'])
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
.kline-row{
    margin-top: 5px;
    background-color: #FFF;
}
</style>