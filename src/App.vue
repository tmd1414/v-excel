<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <template v-for="(e,index) in bb">
      <v-excel v-model="e.ss" v-bind:key="index" :tableIndex="index"  @cellMousedownHandler="mousedown" :showRowHeader="false" :showColHeader="false" :showToolBar="false"></v-excel>
    </template>

  </div>
</template>

<script>
  import VExcel from './components/Excel.vue'
  export default {
    name: 'app',
    methods:{
      mousedown(row,col,e){
        console.log(row)
        console.log(col)
        console.log(e)
      }
    },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        bb: [{
          ss: {
            0: {
              0: {
                text: "ss",
                canedit: true
              },
              1: {
                text: "bb",
                canedit: false
              }
            },
            rows: [{
                height: 22
              },
              {
                width: 200
              },
            ],
            cols: [{
                index: 0,
                width: 200
              },
              {
                index: 1,
                width: 200
              }
            ]
          }
        }, {
          ss: {
            0: {
              0: {
                text: "aa",
                canedit: true
              },
              1: {
                text: "ee",
                canedit: false
              }
            },
            rows: [{
                height: '22'
              },
              {
                width: '200px'
              },
            ],
            cols: [{
                index: 0,
                width: '200px'
              },
              {
                index: 1,
                width: '200px'
              }
            ]
          }
        }]
      }
    },
    components: {
      VExcel
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
