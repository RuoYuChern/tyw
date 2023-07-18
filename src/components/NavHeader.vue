<template>
  <a-menu mode="horizontal" :default-selected-keys="['1']">
    <a-menu-item key="do-trading"><RouterLink to="/do-trading">跟进</RouterLink></a-menu-item>
    <a-menu-item key="user-register" :disabled=true><RouterLink to="/user-register">注册</RouterLink></a-menu-item>
    <a-menu-item key="user-login" :disabled=true><RouterLink to="/user-login">登录</RouterLink></a-menu-item>
    <a-menu-item key="4" :disabled=true>个人中心</a-menu-item>
  </a-menu>
</template>

<script lang="ts" setup>

</script>
<style scoped lang="less">
</style>