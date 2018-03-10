<template>
  <div class="index-header">
    <a :href="`/${user}`">{{user}}</a>
  </div>
</template>

<script lang='ts'>
  import Vue from "vue";
  import Component from "vue-class-component";
  import { Prop , Watch } from 'vue-property-decorator'
  import { State, Action, Getter ,Mutation} from "vuex-class";
  @Component
  export default class BlogHeader extends Vue{
    @Prop()
      user:any
    @Prop()
      users:any
  }
</script>

