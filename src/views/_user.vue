<template>
  <main class='index-layout'>
    <RouterView/>
  </main>
</template>

<style lang='less' scoped>
.index-layout-content {
  box-sizing: border-box;
}
.invisible-login {
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
}
</style>