<template>
    <a-row align="middle" justify="center" class="row-midle">
        <a-col>
            <a-form :model="formState" name="tradeing-form" @finish="onFinish" @finishFailed="onFinishFailed">
                <a-form-item label="股票" name="stock" :rules="[{ required: true, message: '输入股票名称!' }]">
                    <a-input v-model:value="formState.stock" />
                </a-form-item>
                <a-form-item label="价格" name="price" :rules="[{ required: true, message: '输入目标价格!' }]">
                    <a-input v-model:value="formState.price" prefix="￥" suffix="RMB" />
                </a-form-item>
                <a-form-item label="数量" name="vol" :rules="[{ required: true, message: '输入数量!' }]">
                    <a-input v-model:value="formState.vol" prefix="￥" suffix="手" />
                </a-form-item> 
                <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
                    <a-button type="primary" html-type="submit">跟进</a-button>
                </a-form-item>                                                
            </a-form>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { reactive,defineComponent } from 'vue';
import {DoGetOrderId, DoAuthPost} from '../utils/Axios'
interface FormState {
  stock: string;
  price: string;
  vol: string;
  orderId:string;
}
export default defineComponent({
    setup(){
        const formState = reactive<FormState>({stock: '',price: '',vol: '', orderId: DoGetOrderId()});
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const onFinish = (_: any) => {
            const apiUrl = "/taiyi/trade/do-trading"
            const tradeDto = {stock: formState.stock, price:Number(formState.price), vol: Number(formState.vol), orderId:formState.orderId}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            DoAuthPost(apiUrl, tradeDto, function cb(_rsp:any){
                formState.stock = ''
                formState.price = ''
                formState.vol = ''
                formState.orderId = DoGetOrderId()
                console.log('do trading sucessfully');
            })
        }
        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };        
        return{
            formState,
            onFinish,
            onFinishFailed
        }
    }
    
})
</script>
<style lang="css" scoped>
.row-midle{
    height: 100%;  
    background-color: #FFF; 
}
</style>