<template>
  <!--
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <div id="app">
    <MyComponent />
  </div>
  -->
  <div id="app">
    <AgComponentEl />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import MyComponent from './components/MyComponent.vue'
import AgComponentEl from './components/AgComponentEl.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    // MyComponent,
    AgComponentEl
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
