<template>
    <div style="width: 200px">
        <a-button type="primary" style="margin-bottom: 16px" @click="toggleCollapsed">
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
        </a-button>
        <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys.keys" mode="inline" theme="light" :inline-collapsed="collapsed" @select="subMenuSelect">
            <a-menu-item key="DashBoard">
                <template #icon>
                    <DashboardOutlined />
                </template>
                <router-link to="/dashboard">Dashboard</router-link>
            </a-menu-item>
            <a-menu-item key="Signal">
                <template #icon>
                    <AlertOutlined />
                </template>
                <router-link to="/signal">发现信号</router-link>
            </a-menu-item>
            <a-menu-item key="Trend">
                <template #icon>
                    <RiseOutlined />
                </template>
                <router-link to="/trend">趋势</router-link>
            </a-menu-item>  
            <a-menu-item key="TrendCmp">
                <template #icon>
                    <BarChartOutlined />
                </template>
                <router-link to="/double-trend">趋势对比</router-link>
            </a-menu-item>  
            <a-menu-item key="HotSymbol">
                <template #icon>
                    <FireOutlined />
                </template>
                <router-link to="/hot-symbol">热股</router-link>
            </a-menu-item>              
            <a-menu-item key="UpDown">
                <template #icon>
                    <LikeOutlined />
                </template>
                <router-link to="/up-down">涨跌停</router-link>
            </a-menu-item> 
            <a-menu-item key="TradeStudy">
                <template #icon>
                    <FlagFilled />
                </template>
                <router-link to="/trade-study">交易研究</router-link>
            </a-menu-item>                                                                     
        </a-menu>
   </div>
</template>


<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  AlertOutlined,
  RiseOutlined,
  BarChartOutlined,
  FlagFilled,
  LikeOutlined,
  FireOutlined
} from '@ant-design/icons-vue';
import {selectKeysStore} from '../stores/stores'

export default defineComponent({
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    AlertOutlined,
    RiseOutlined,
    BarChartOutlined,
    FlagFilled,
    LikeOutlined,
    FireOutlined
  },
  setup() {
    const state = reactive({
      collapsed: false,
      selectedKeys: selectKeysStore(),
      openKeys: [],
      preOpenKeys: [],
    });
    
    watch(
      () => state.openKeys,
      (_val, oldVal) => {
        state.preOpenKeys = oldVal;
      },
    );
    const toggleCollapsed = () => {
      state.collapsed = !state.collapsed;
      state.openKeys = state.collapsed ? [] : state.preOpenKeys;
    };

    return {
      ...toRefs(state),
      toggleCollapsed,
    };
  },
  methods:{
    subMenuSelect(e:any){
      this.selectedKeys.setKeys(e.selectedKeys)
    }
  }
});
</script>../stores/stores