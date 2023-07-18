<template>
    <a-row class="kline-row">
        <a-col span="8">
            <div id="moodChart" v-if="moodSeries.length > 0">
                <apexchart type="line" height="350" :options="chartLineOpt" :series="moodSeries"></apexchart>
            </div>
            <div id="moodChart" v-else>No Data</div>        
        </a-col>         
        <a-col span="8">
            <div id="upDownChart" v-if="upDownSeries.length > 0">
                <apexchart type="line" height="350" :options="chartLineOpt" :series="upDownSeries"></apexchart>
            </div>
            <div id="upDownChart" v-else>No Data</div>            
        </a-col> 
        <a-col span="8">
            <div id="limitChart" v-if="limitSeries.length > 0">
                <apexchart type="line" height="350" :options="chartLineOpt" :series="limitSeries"></apexchart>
            </div>
            <div id="limitChart" v-else>No Data</div>            
        </a-col>                    
    </a-row>
    <a-row class="kline-row">
        <a-col span="8">
            <div id="volChart" v-if="volSeries.length > 0">
                <apexchart type="line" height="350" :options="mixLineOpt" :series="volSeries"></apexchart>
            </div>
            <div id="volChart" v-else>No Data</div>                  
        </a-col>
        <a-col span="8">
            <div id="topVolChart" v-if="topSeries.length > 0">
                <apexchart type="line" height="350" :options="chartLineOpt" :series="topSeries"></apexchart>
            </div>
            <div id="topVolChart" v-else>No Data</div>                  
        </a-col>                 
    </a-row>    
</template>

<script lang="ts">
import { selectKeysStore } from '@/stores/stores';
import { NamedSeries, toLinOption, toMixOption, toSeries } from '@/utils/ChartDatas';
import { type Ref, defineComponent, ref, shallowRef} from 'vue';
import VueApexCharts from "vue3-apexcharts";
import {HttpGet} from '../utils/Axios'
export default defineComponent({
    components:{
        apexchart: VueApexCharts
    },
    setup(){
        const mixLineOpt = shallowRef(toMixOption("大盘"))
        const chartLineOpt = shallowRef(toLinOption("大盘"))
        const volSeries:Ref<NamedSeries[]> = ref([])
        const upDownSeries:Ref<NamedSeries[]> = ref([])
        const limitSeries:Ref<NamedSeries[]> = ref([])
        const moodSeries:Ref<NamedSeries[]> = ref([])
        const topSeries:Ref<NamedSeries[]> = ref([])
        return{
            mixLineOpt,
            chartLineOpt,
            volSeries,
            topSeries,
            upDownSeries,
            limitSeries,
            moodSeries
        }        
    },
    created() {
        const keys = selectKeysStore()
        keys.setKeys(['DashBoard'])
        const apiUrl = "/taiyi/hq/get-dash" 
        HttpGet(apiUrl, (rsp:any)=>{
            const lablas:string [] = []
            const amount    = toSeries("成交额(千万)","column");
            const vol    = toSeries("总成交量(万手)","line");
            const topVol = toSeries("Top20成交量(万手)","line");
            const downStocks = toSeries("下跌股票","line");
            const upStocks = toSeries("上涨股票","line");
            const upLimit = toSeries("涨停","line");
            const downLimit = toSeries("跌停","line");
            const mood = toSeries("情绪","line");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            rsp.forEach((val:any, _idx:number, _array:[]) =>{
                lablas.push(val.day)
                amount.data.push(val.amount)
                vol.data.push(val.vol)
                topVol.data.push(val.topVol)
                downStocks.data.push(val.upStocks)
                upStocks.data.push(val.downStocks)
                upLimit.data.push(val.upLimit)
                downLimit.data.push(val.downLimit)
                mood.data.push(val.mood)
            })
            this.chartLineOpt.xaxis.categories = lablas
            this.mixLineOpt.labels = lablas
            this.mixLineOpt.yaxis[0].title.text = "成交额(千万)"
            this.mixLineOpt.yaxis[1].title.text = "成交量(万手)"

            this.volSeries.length = 0
            this.volSeries.push(amount)
            this.volSeries.push(vol)

            this.topSeries.length = 0
            this.topSeries.push(topVol)
            this.topSeries.push(vol)

            this.upDownSeries.length = 0
            this.upDownSeries.push(downStocks)
            this.upDownSeries.push(upStocks) 
            
            this.limitSeries.length = 0
            this.limitSeries.push(upLimit)
            this.limitSeries.push(downLimit)  
            
            this.moodSeries.length = 0
            this.moodSeries.push(mood)            

        }) 
    },
})
</script>

<style scoped lang="css">
.kline-row{
    margin-top: 5px;
    background-color: #FFF;
}
</style>