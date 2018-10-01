<template>
  <div class="observer"></div>
</template>

<script>
  export default {
    props: ['options', 'handleInterSection'],
    data: () => ({
      observer: null,
    }),
    mounted() {
      const options = this.options || {};
      this.observer = new IntersectionObserver(([entry]) => {
        if (entry && entry.isIntersecting) {
          this.handleInterSection()
        }
      }, options);

      this.observer.observe(this.$el);
    },
    destroyed() {
      this.observer.disconnect();
    },
  };
</script>

<style scoped>
  .observer {
    height: 1px;
  }
</style>