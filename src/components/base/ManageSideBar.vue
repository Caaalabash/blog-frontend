<template>
  <div class="sidebar">
    <router-link to="new-idea" tag="h3">发布文章</router-link>
    <router-link to="ideas" tag="h3">管理文章</router-link>
    <router-link to="setting" tag="h3">个人设置</router-link>
    <router-link :to="`/${user}`" tag="h3">返回首页</router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default{
  name:'ManageSideBar',
  props:['user']
}
</script>
