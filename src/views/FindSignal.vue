<template>
    <a-row class="opt-row">
        <a-col :span="2">
            <h4>操作类型:</h4>
            <a-radio-group v-model:value="buyOpt" @change="buyOptChange" name="optRadioGroup">
                <a-radio :value="1">Buy</a-radio>
                <a-radio :value="2">Sell</a-radio>
            </a-radio-group>
        </a-col>
        <a-divider type="vertical" />
        <a-col :span="6">
            <h4>查询下一页:</h4>
            <a-button type="ghost" size="middle" @click="prexPageClick" :disabled="prePageBtnStatus">
                <template #icon>
                    <LeftOutlined />
                </template>
                上一页
            </a-button>
            <a-divider type="vertical" />
            <a-button type="ghost" size="middle" @click="nextPageClick" :disabled="nextPageBtnStatus">
                <template #icon>
                    <RightOutlined />
                </template>
                下一页
            </a-button>            
        </a-col>
    </a-row>
    <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" class="data-row">
        <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'name'">
                <a>{{ text }}</a>
            </template>
        </template>
    </a-table>
</template>

<script lang="ts">
import {defineComponent, ref, type Ref } from 'vue';
import {LeftOutlined, RightOutlined} from '@ant-design/icons-vue';
import {HttpGet} from '../utils/Axios'
interface DataItem {
    symbol: string;
    name: string;
    status: string;
    opt: string;
    lowday: string;
    highday: string;        
} 

export default defineComponent({
    components:{
        LeftOutlined,
        RightOutlined
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
        const dataSource: Ref<DataItem[]> =ref([]);
        const buyOpt = ref<number>(1);
        const pageNum = ref<number>(0);
        const prePageBtnStatus = ref(false);
        const nextPageBtnStatus = ref(false);
        return{
            columns,
            dataSource,
            pagination,
            buyOpt,
            pageNum,
            prePageBtnStatus,
            nextPageBtnStatus
        }
    },
    beforeMount() {
        this.getData()  
    },
    methods:{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        buyOptChange(_e:Event){
            this.getData() 
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        prexPageClick(_e:any){
            let pageNum = this.pageNum.valueOf()
            if(pageNum == 0){
                this.prePageBtnStatus = true
                return 
            }
            this.pageNum --
            this.getData()
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        nextPageClick(_e:any){
            this.prePageBtnStatus = false
            this.pageNum ++
            this.getData()
        },
        getData(){
            this.dataSource.length = 0
            let opt = ((this.buyOpt.valueOf() == 1)? "BUY":"SELL")
            let page = this.pageNum.valueOf()
            let url = `/taiyi/hq/get-stf?opt=${opt}&page=${page}`
            HttpGet(url, (rsp:any)=>{
                this.nextPageBtnStatus = (rsp.length == 0)
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
</style>