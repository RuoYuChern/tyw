<template>
    <a-row class="kline-row">
        <a-col span="12">
            <div id="prcieChart" v-if="priceSeries.length > 0">
                <apexchart type="line" height="350" :options="chartLineOpt" :series="priceSeries"></apexchart>
            </div>
        </a-col>
        <a-col span="12">
            <div id="mtnChart" v-if="mtnSeries.length > 0">
                <apexchart type="line" height="350" :options="chartLineOpt" :series="mtnSeries"></apexchart>
            </div>            
        </a-col>       
    </a-row>
    <a-row class="kline-row">
        <a-col span="24">
            <div id="maChart" v-if="maSeries.length > 0">
                <apexchart type="line" height="350" :options="chartLineOpt" :series="maSeries"></apexchart>
            </div>
        </a-col> 
    </a-row>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref,} from 'vue';
import VueApexCharts from "vue3-apexcharts";
import {HttpGet} from '../utils/Axios'
import {toLinOption, toSeries, NamedSeries} from '../utils/ChartDatas'

export default defineComponent({
    props: {
        foo: String
    },
    components:{
        apexchart: VueApexCharts
    },
    setup(){
        const chartLineOpt = ref(toLinOption(""))
        const priceSeries:Ref<NamedSeries[]> = ref([])
        const maSeries:Ref<NamedSeries[]> = ref([])
        const mtnSeries:Ref<NamedSeries[]> = ref([])
        return{
            chartLineOpt,
            priceSeries,
            maSeries,
            mtnSeries 
        };
    },
    beforeMount(){
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //let stock = formState.stock
        let stock = this.foo
        let apiUrl = `/taiyi/hq/get-trend?stock=${stock}`
        console.log("created")
        HttpGet(apiUrl, (rsp:any)=>{
            let lablas:string [] = []
            const openList = toSeries("开盘价","line");
            const close    = toSeries("收盘价","line");
            const high     = toSeries("最高","line");
            const low      = toSeries("最低","line");
            const vol      = toSeries("成交量","column");
            const hld      = toSeries("高低差","line");
            const lsma     = toSeries("SMA-10","line");
            const ssma     = toSeries("SMA-8","line");
            const mtn      = toSeries("动量","line"); 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            rsp.forEach((val:any, _idx:number, _array:[]) =>{
                lablas.push(val.day)
                openList.data.push(val.open)
                close.data.push(val.close)
                high.data.push(val.high)
                low.data.push(val.low)
                vol.data.push(val.vol)
                hld.data.push(val.hld)
                lsma.data.push(val.lsma)
                ssma.data.push(val.ssma)
                mtn.data.push(val.mtn)
            })
            this.chartLineOpt.xaxis.categories = lablas
            this.priceSeries.length = 0
            this.priceSeries.push(openList)
            this.priceSeries.push(close)
            this.priceSeries.push(high)
            this.priceSeries.push(low)
            this.priceSeries.push(lsma)
            this.priceSeries.push(ssma)
            this.maSeries.length = 0
                //maSeries.value.push(close)
                //maSeries.value.push(high)
                //maSeries.value.push(lsma)
                //maSeries.value.push(ssma)
            this.maSeries.push(vol)
            this.mtnSeries.length = 0
            this.mtnSeries.push(hld)
            this.mtnSeries.push(mtn)
        })
    },    
    methods:{
    }
})
</script>

<style scoped lang="css">
.kline-row{
    margin-top: 5px;
    background-color: #FFF;
}
</style>
