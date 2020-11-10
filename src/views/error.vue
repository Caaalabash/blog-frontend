<template>
  <main @mousemove="handleMouseMove" @touchmove="handleTouchMove">
    <div class="text">
      <h1>{{ code }}</h1>
      <h2>Uh, Ohh</h2>
      <h3>{{ warningLabel }}</h3>
    </div>
    <div class="torch" ref="torch"></div>
  </main>
</template>

<script>
export default {
  name: 'error',
  computed: {
    code() {
      return +this.$route.query.code || 404
    },
    warningLabel() {
      switch (this.code) {
      case 404:
        return 'Sorry, we can\'t find what you are looking for, cause it\'s so dark in here'
      case 403:
        return 'Sorry you can\'t go any further, cause it\'s too dangerous for you'
      default:
        return ''
      }
    },
  },
  methods: {
    handleMouseMove(e) {
      this.$refs['torch'].style = `top:${e.pageY}px;left:${e.pageX}px`
    },
    handleTouchMove(e) {
      this.$refs['torch'].style = `top:${e.touches[0].clientY}px;left:${e.touches[0].clientX}px`
    }
  }
}
</script>

<style scoped>
  main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
  }
  .text h1 {
    color: #011718;
    margin-top: -200px;
    font-size: 15em;
    text-align: center;
    text-shadow: -5px 5px 0px rgba(0,0,0,0.7), -10px 10px 0px rgba(0,0,0,0.4), -15px 15px 0px rgba(0,0,0,0.2);
    font-family: monospace;
    font-weight: bold;
  }
  .text h2 {
    color: black;
    font-size: 5em;
    text-shadow: -5px 5px 0px rgba(0,0,0,0.7);
    text-align: center;
    margin-top: -150px;
    font-family: monospace;
    font-weight: bold;
  }
  .text h3 {
    color: white;
    margin-left: 30px;
    font-size: 2em;
    text-shadow: -5px 5px 0px rgba(0,0,0,0.7);
    margin-top: -40px;
    font-family: monospace;
    font-weight: bold;
  }
  .torch {
    margin: -150px 0 0 -150px;
    width: 200px;
    height: 200px;
    box-shadow: 0 0 0 9999em #000000f7;
    opacity: 1;
    border-radius: 50%;
    position: fixed;
    background: rgba(0,0,0,0.1);
  }
  .torch:after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    box-shadow: inset 0 0 40px 2px #000,
    0 0 20px 4px rgba(13,13,10,0.8);
  }
</style>
