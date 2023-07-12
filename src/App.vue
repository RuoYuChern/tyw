<script setup lang="ts">
import NavHeader from './components/NavHeader.vue';
import PageSide from './components/PageSide.vue';
</script>

<template>
  <div class="container">
    <a-layout class="layout">
      <a-layout-header class="layout-header"><NavHeader/></a-layout-header>
      <a-layout class="layout-mid">
        <a-layout-sider class="layout-side">
          <PageSide/>
        </a-layout-sider>
        <a-layout-content class="layout-content"><RouterView/></a-layout-content>
      </a-layout>
      <a-layout-footer class="layout-footer">@粤ICP备2022146791号 2022-{{ new Date().getFullYear()}}</a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped lang="less">
.container{
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
}

.layout{
  height: 100%;
}

.layout-mid{
  margin: 10px;
}

.layout-side{
  width: 250px;
  background-color: #FFF;
}


.layout-content{
  margin-left: 10px;
  background-color: #FFF;
}

.layout-header {
  display: flex;
  flex-direction: column;
  align-items: end;
  margin: 0 10px;
  background-color: #FFF;
}


.layout-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  margin: 0 10px;
  background-color: #FFF;
}

</style>
