<template>
  <!--
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <div id="app">
    <MyComponent />
  </div>
  -->
  <diev id="app">
    <AgComponent />
  </diev>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import MyComponent from './components/MyComponent.vue'
import AgComponent from './components/AgComponent.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    // MyComponent,
    AgComponent
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
