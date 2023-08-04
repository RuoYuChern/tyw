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
        <a-col span="8">
            <div id="szChart" v-if="szSeries.length > 0">
                <apexchart type="line" height="350" :options="chartSzOpt" :series="szSeries"></apexchart>
            </div>
            <div id="szChart" v-else>No Data</div>                  
        </a-col>                         
    </a-row>    
</template>

<script lang="ts">
import { selectKeysStore } from '@/stores/stores';
import { NamedSeries, toLinOption, toSeries } from '@/utils/ChartDatas';
import { type Ref, defineComponent, ref, shallowRef} from 'vue';
import VueApexCharts from "vue3-apexcharts";
import {HttpGet} from '../utils/Axios'
export default defineComponent({
    components:{
        apexchart: VueApexCharts
    },
    setup(){
        const mixLineOpt = shallowRef(toLinOption("A股指数-成交量(万手)"))
        const chartLineOpt = shallowRef(toLinOption("大盘"))
        const chartSzOpt = shallowRef(toLinOption("A股指数-价格"))
        const volSeries:Ref<NamedSeries[]> = ref([])
        const upDownSeries:Ref<NamedSeries[]> = ref([])
        const limitSeries:Ref<NamedSeries[]> = ref([])
        const moodSeries:Ref<NamedSeries[]> = ref([])
        const topSeries:Ref<NamedSeries[]> = ref([])
        const szSeries:Ref<NamedSeries[]> = ref([])
        return{
            mixLineOpt,
            chartLineOpt,
            volSeries,
            topSeries,
            upDownSeries,
            limitSeries,
            moodSeries,
            chartSzOpt,
            szSeries
        }        
    },
    created() {
        const keys = selectKeysStore()
        keys.setKeys(['DashBoard'])
        const apiUrl = "/taiyi/hq/get-dash" 
        HttpGet(apiUrl, (rsp:any)=>{
            const lablas:string [] = []
            const vol    = toSeries("总成交量(万手)","line");
            const topVol = toSeries("Top20成交量(万手)","line");
            const downStocks = toSeries("下跌股票","line");
            const upStocks = toSeries("上涨股票","line");
            const upLimit = toSeries("涨停","line");
            const downLimit = toSeries("跌停","line");
            const mood = toSeries("情绪","line");
            const szDaily = toSeries("深圳成指","line");
            const szVol = toSeries("深圳成指","line");
            const shDaily = toSeries("上证指数","line");
            const shVol = toSeries("上证指数","line");
            const hs300 = toSeries("沪深300","line");
            const hsVol = toSeries("沪深300","line");
            const daily = rsp.daily 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            daily.forEach((val:any, _idx:number, _array:[]) =>{
                lablas.push(val.day)
                vol.data.push(val.vol)
                topVol.data.push(val.topVol)
                downStocks.data.push(val.upStocks)
                upStocks.data.push(val.downStocks)
                upLimit.data.push(val.upLimit)
                downLimit.data.push(val.downLimit)
                mood.data.push(val.mood)
            })

            const szLablas:string [] = []
            const sz_data = rsp.sz_daily
            const wanShou = 10000*100
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            sz_data.forEach((val:any, _idx:number, _array:[]) =>{
                szLablas.push(val.day)
                szDaily.data.push(val.ma_price5)
                const n = Number(val.ma_volume5/wanShou)
                szVol.data.push(Number(n.toFixed(4)))
            })

            const sh_data = rsp.sh_daily
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            sh_data.forEach((val:any, _idx:number, _array:[]) =>{
                shDaily.data.push(val.ma_price5)
                const n = Number(val.ma_volume5/wanShou)
                shVol.data.push(Number(n.toFixed(4)))
            })

            const hs_300_data = rsp.hs_daily
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            hs_300_data.forEach((val:any, _idx:number, _array:[]) =>{
                hs300.data.push(val.ma_price5)
                const n = Number(val.ma_volume5/wanShou)
                hsVol.data.push(Number(n.toFixed(4)))
            })

            this.mixLineOpt.xaxis.categories = szLablas
            this.volSeries.length = 0
            this.volSeries.push(szVol)
            this.volSeries.push(shVol)
            this.volSeries.push(hsVol)

            this.chartLineOpt.xaxis.categories = lablas
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
            
            this.chartSzOpt.xaxis.categories = szLablas
            this.szSeries.length = 0
            this.szSeries.push(shDaily)
            this.szSeries.push(szDaily)
            this.szSeries.push(hs300)

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