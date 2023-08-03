<template>
    <a-row class="kline-row">
        <a-col span="8">
            <div id="amountChart" v-if="amountSeries.length > 0">
                <apexchart type="line" height="350" :options="chartAmountOpt" :series="amountSeries"></apexchart>
            </div>
            <div id="amountChart" v-else>No Data</div>        
        </a-col>
        <a-col span="8">
            <div id="countChart" v-if="countSeries.length > 0">
                <apexchart type="line" height="350" :options="chartCountOpt" :series="countSeries"></apexchart>
            </div>
            <div id="countChart" v-else>No Data</div>        
        </a-col> 
        <a-col span="8">
            <div id="pireChart" v-if="pieSeries.length > 0">
                <apexchart type="line" height="350" :options="chartPieOpt" :series="pieSeries"></apexchart>
            </div>
            <div id="pireChart" v-else>No Data</div>        
        </a-col>                           
    </a-row>
</template>


<script lang="ts">
import { selectKeysStore } from '@/stores/stores';
import VueApexCharts from "vue3-apexcharts";
import {HttpGet} from '../utils/Axios'
import {type Ref, defineComponent, ref, shallowRef} from 'vue';
import { NamedSeries, toBarOption, toPieOption, toSeries } from '@/utils/ChartDatas';
export default defineComponent({
    components:{
        apexchart: VueApexCharts
    },
    setup(){
        const chartAmountOpt = shallowRef(toBarOption())
        const chartCountOpt = shallowRef(toBarOption())
        const chartPieOpt = shallowRef(toPieOption())
        const amountSeries: Ref<NamedSeries[]> = ref([])
        const countSeries:Ref<NamedSeries[]> = ref([])
        const pieSeries:Ref<Number[]>= ref([])
        return{
            chartAmountOpt,
            chartCountOpt,
            chartPieOpt,
            amountSeries,
            countSeries,
            pieSeries
        } 
    },
    created() {
        const keys = selectKeysStore()
        keys.setKeys(['TradeStudy'])
        const apiUrl = "/taiyi/trade/get-trading-stat"
        HttpGet(apiUrl, (rsp:any)=>{
            const amount    = toSeries("金额(元)","column");
            const amountLablas:string [] = ["总金额","盈亏"]
            amount.data.push(rsp.amount)
            amount.data.push(rsp.pnl)
            this.chartAmountOpt.xaxis.categories = amountLablas
            this.amountSeries.push(amount)
            const countData = toSeries("订单","column");
            const countLablas:string [] = ["总订单","盈利","亏损","取消"]
            countData.data.push(rsp.vol)
            countData.data.push(rsp.success)
            countData.data.push(rsp.failed)
            countData.data.push(rsp.cancel)
            this.chartCountOpt.xaxis.categories = countLablas
            this.countSeries.push(countData)
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