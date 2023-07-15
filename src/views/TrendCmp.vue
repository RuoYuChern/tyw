<template>
    <a-row class="opt-row">
        <a-form layout="inline" :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
            <a-form-item>
                <a-input v-model:value="formState.first" placeholder="大华股份">
                    <template #prefix><EditOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-input v-model:value="formState.second" placeholder="海康威视">
                    <template #prefix><EditOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                </a-input>
            </a-form-item>            
            <a-form-item>
                <a-button type="primary" html-type="submit" :disabled="formState.first === '' || formState.second === ''">
                    <template #icon><LikeOutlined /></template>
                    Go
                </a-button>
            </a-form-item>            
        </a-form>
    </a-row>
    <a-row class="kline-row">
        <a-col span="12">
            <div id="prcieChart" v-if="priceSeries.length > 0">
                <apexchart type="line" height="350" :options="chartLineOpt" :series="priceSeries"></apexchart>
            </div>
            <div id="prcieChart" v-else>No Data</div>
        </a-col>
        <a-col span="12">
            <div id="mtnChart" v-if="mtnSeries.length > 0">
                <apexchart type="line" height="350" :options="chartLineOpt" :series="mtnSeries"></apexchart>
            </div>
            <div id="mtnChart" v-else>No Data</div>            
        </a-col>       
    </a-row>
    <a-row class="kline-row">
        <a-col span="24">
            <div id="volChart" v-if="volSeries.length > 0">
                <apexchart type="line" height="350" :options="mixLineOpt" :series="volSeries"></apexchart>
            </div>
            <div id="volChart" v-else>No Data</div>
        </a-col> 
    </a-row>
</template>

<script lang="ts">
import type { FormProps } from 'ant-design-vue';
import {EditOutlined, LikeOutlined} from '@ant-design/icons-vue';
import VueApexCharts from "vue3-apexcharts";
import { selectKeysStore } from '@/stores/stores';
import { defineComponent, reactive, ref, shallowRef, type Ref, type UnwrapRef} from 'vue';
import { toLinOption, toMixOption, NamedSeries, toSeries } from '@/utils/ChartDatas';
import { HttpGet } from '@/utils/Axios';

interface FormState {
  first: string;
  second: string;
}

export default defineComponent({
    components:{
        EditOutlined,
        LikeOutlined,
        apexchart: VueApexCharts
    },

    setup(){
        const formState: UnwrapRef<FormState> = reactive({first: '', second:''});
        const chartLineOpt = shallowRef(toLinOption(""))
        const mixLineOpt = shallowRef(toMixOption(""))
        const priceSeries:Ref<NamedSeries[]> = ref([])
        const volSeries:Ref<NamedSeries[]> = ref([])
        const mtnSeries:Ref<NamedSeries[]> = ref([])            
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handleFinish: FormProps['onFinish'] = _values => {
            const first = formState.first
            const second = formState.second
            let apiUrl = `/taiyi/hq/get-pair-trend?first=${first}&second=${second}`
            HttpGet(apiUrl, (rsp:any)=>{
                if (rsp.length == 0){
                    return
                }
                const fclose    = toSeries(`${first}-收盘价`,"line");
                const fvol      = toSeries(`${first}-成交量`,"column");
                const fmtn      = toSeries(`${first}-动量`,"column"); 
                const flsma    = toSeries(`${first}-SMA-10`,"line");
                const fssma    = toSeries(`${first}-SMA-8`,"line");

                const sclose    = toSeries(`${second}-收盘价`,"line");
                const svol      = toSeries(`${second}-成交量`,"column");
                const smtn      = toSeries(`${second}-动量`,"column"); 
                const slsma    = toSeries(`${second}-SMA-10`,"line");
                const sssma    = toSeries(`${second}-SMA-8`,"line");

                const lablas:string [] = []
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                rsp.forEach((val:any, _idx:number, _array:[]) =>{
                    lablas.push(val.day)

                    fclose.data.push(val.fClose)
                    fvol.data.push(val.fVol)
                    fmtn.data.push(val.fMtn)
                    flsma.data.push(val.fLsma)
                    fssma.data.push(val.fSsma)

                    sclose.data.push(val.sClose)
                    svol.data.push(val.sVol)
                    smtn.data.push(val.sMtn)
                    slsma.data.push(val.sLsma)
                    sssma.data.push(val.sSsma)
                });
                const lineOpt = toLinOption("")
                lineOpt.xaxis.categories = lablas
                lineOpt.title.text = `${first}.VS.${second}`

                const mixOpt = toMixOption("")
                mixOpt.labels = lablas
                mixOpt.title.text = `${first}.VS.${second}`
                mixOpt.yaxis[0].title.text = "vol"
                mixOpt.yaxis[1].title.text = "价格"

                chartLineOpt.value = lineOpt
                mixLineOpt.value = mixOpt

                priceSeries.value.length = 0
                priceSeries.value.push(fclose)
                priceSeries.value.push(sclose)
                priceSeries.value.push(flsma)
                priceSeries.value.push(slsma)
                priceSeries.value.push(fmtn)
                priceSeries.value.push(smtn)

                volSeries.value.length = 0
                volSeries.value.push(fvol)
                volSeries.value.push(svol)
                volSeries.value.push(fclose)
                volSeries.value.push(sclose)

                mtnSeries.value.length = 0
                mtnSeries.value.push(fclose)
                mtnSeries.value.push(sclose)
                mtnSeries.value.push(fmtn)
                mtnSeries.value.push(smtn)
            })
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handleFinishFailed: FormProps['onFinishFailed'] = _errors => {
            
        };        
        return{
            formState,
            handleFinish,
            handleFinishFailed,
            chartLineOpt,
            mixLineOpt,
            priceSeries,
            volSeries,
            mtnSeries
        }
    },

    beforeCreate() {
        const keys = selectKeysStore()
        keys.setKeys(['TrendCmp'])
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