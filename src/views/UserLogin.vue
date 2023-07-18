<template>
    <a-row align="middle" justify="center" class="row-midle">
        <a-col>
            <a-form name="basic" :model="formState" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" @finish="onFinish" @finishFailed="onFinishFailed">
                <a-form-item label="Username" name="username" :rules="[{ required: true, message: '输入用户名!' }]">
                    <a-input v-model:value="formState.username" />
                </a-form-item>
                <a-form-item label="Password" name="password" :rules="[{ required: true, message: '输入密码!' }]">
                    <a-input-password v-model:value="formState.password" />
                </a-form-item>
                <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
                    <a-checkbox v-model:checked="formState.remember">记住</a-checkbox>
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                    <a-button type="primary" html-type="submit">登录</a-button>
                </a-form-item>
            </a-form>            
        </a-col>
    </a-row>
</template>
<script lang="ts">
import { reactive,defineComponent } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import {DoLogin} from '../utils/Axios'
interface FormState {
  username: string;
  password: string;
  remember: boolean;
}
export default defineComponent({
    setup(){
        const formState = reactive<FormState>({username: '',password: '',remember: true,});
        const router = useRouter();
        const route = useRoute()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const onFinish = (_: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            DoLogin(formState.username, formState.password, function cb(rsp:any) {
                if (router === undefined){
                    return 
                }
                const { redirect, ...othersQuery } = router.currentRoute.value.query;
                const to = (redirect as string) || '/'
                router.push({path:to,query: {...othersQuery,}})
            })
        }; 
        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };               
        return{
            formState,
            router,
            route,
            onFinish,
            onFinishFailed
        }
    },
    mounted() {
        
    },
})
</script>
<style lang="less" scoped>
.row-midle{
    height: 100%;  
    background-color: #FFF;  
}
</style>