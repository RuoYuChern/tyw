<template>
    <a-row class="kline-row">
        <a-col span="8">
            <div id="amountChart" v-if="amountSeries.length > 0">
                <apexchart type="bar" height="350" :options="chartAmountOpt" :series="amountSeries"></apexchart>
            </div>
            <div id="amountChart" v-else>No Data</div>        
        </a-col>
        <a-col span="8">
            <div id="countChart" v-if="countSeries.length > 0">
                <apexchart type="bar" height="350" :options="chartCountOpt" :series="countSeries"></apexchart>
            </div>
            <div id="countChart" v-else>No Data</div>        
        </a-col> 
        <a-col span="8">
            <div id="pireChart" v-if="pieSeries.length > 0">
                <apexchart type="pie" height="350" :options="chartPieOpt" :series="pieSeries"></apexchart>
            </div>
            <div id="pireChart" v-else>No Data</div>        
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
import { selectKeysStore } from '@/stores/stores';
import VueApexCharts from "vue3-apexcharts";
import {HttpGet} from '../utils/Axios'
import {type Ref, defineComponent, ref, shallowRef} from 'vue';
import { NamedSeries, toColumOption, toPieOption, toSeries } from '@/utils/ChartDatas';

interface DataItem {
    symbol: string;
    name: string;
    orderPrice: string;
    buyPrice: string;
    sellPrice: string; 
    price:string; 
    status: string;
    orderDate: string;
    buyDate:string;
    sellDate:string;
    flag:string;      
} 

export default defineComponent({
    components:{
        apexchart: VueApexCharts
    },
    setup(){
        const chartAmountOpt = shallowRef(toColumOption("盈亏情况"))
        const chartCountOpt = shallowRef(toColumOption("订单"))
        const chartPieOpt = shallowRef(toPieOption())
        const amountSeries: Ref<NamedSeries[]> = ref([])
        const countSeries:Ref<NamedSeries[]> = ref([])
        const pieSeries:Ref<Number[]>= ref([])
        const pagination = {pageSizeOptions: ['5']}
        const columns = [
            {
            title: '股票',
            dataIndex: 'name',
            },{
            title: '编码',
            dataIndex: 'symbol',
            },{
            title: '下单价',
            dataIndex: 'orderPrice',
            },{
            title: '买价',
            dataIndex: 'buyPrice',
            },{
            title: '卖价',
            dataIndex: 'sellPrice',
            },{
            title: '现价',
            dataIndex: 'price',
            },{
            title: '下单日',
            dataIndex: 'orderDate',
            },{
            title: '购买日',
            dataIndex: 'buyDate',
            },{
            title: '清仓日',
            dataIndex: 'sellDate',
            },{
            title: '状态',
            dataIndex: 'status',
            },{
            title: '盈亏',
            dataIndex: 'flag',
            },
        ]; 
        const dataSource: Ref<DataItem[]> =ref([]);           
        return{
            chartAmountOpt,
            chartCountOpt,
            chartPieOpt,
            amountSeries,
            countSeries,
            pieSeries,
            pagination,
            columns,
            dataSource
        } 
    },
    created() {
        const keys = selectKeysStore()
        keys.setKeys(['TradeStudy'])
        const apiUrl = "/taiyi/trade/get-trading-stat"
        HttpGet(apiUrl, (rsp:any)=>{
            const amount    = toSeries("金额(元)","column");
            const amountLables:string [] = ["总金额","盈亏"]
            amount.data.push(rsp.amount)
            amount.data.push(rsp.pnl)
            this.chartAmountOpt.xaxis.categories = amountLables
            this.amountSeries.push(amount)
            const countData = toSeries("订单","column");
            const countLables:string [] = ["总订单","盈利","亏损","取消"]
            countData.data.push(rsp.vol)
            countData.data.push(rsp.success)
            countData.data.push(rsp.failed)
            countData.data.push(rsp.cancel)
            this.chartCountOpt.xaxis.categories = countLables
            this.countSeries.push(countData)

            const pieLables:string [] = ["下单中","盈利","亏损","取消"]
            this.chartPieOpt.labels = pieLables
            const pieData:Number[] = []
            pieData.push(rsp.vol - (rsp.success + rsp.failed + rsp.cancel))
            pieData.push(rsp.success)
            pieData.push(rsp.failed)
            pieData.push(rsp.cancel)
            this.pieSeries = pieData

            const orders = rsp.orders
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            orders.forEach((val:any, _idx:number, _array:[]) => {this.dataSource.push(val)})
        }) 
    },
})
</script>
<style scoped lang="css">
.kline-row{
    margin-top: 5px;
    background-color: #FFF;
}
.data-row{
    background-color: #FFF;
    margin-top: 10px;
}
</style>