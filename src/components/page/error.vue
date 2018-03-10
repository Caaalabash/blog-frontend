<template>
<h1>
  {{type}}
</h1>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from 'vue-property-decorator'

@Component
export default class error extends Vue{
  @Prop()
    type:string = ''
}
</script>


