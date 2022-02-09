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
    {{tableContent}}
    <!-- {{bb}} -->
    <!-- <template v-for="(e,index) in bb"> -->
      <v-excel v-model="tableContent"   @cellMousedownHandler="mousedown"></v-excel>
    <!-- </template> -->

  </div>
</template>

<script>
  import VExcel from './components/Excel.vue'
  export default {
    name: 'app',
    methods: {
      mousedown(row, col, e) {
        console.log(row)
        console.log(col)
        console.log(e)
      }
    },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        bb: [{
          ss: {"0":{"0":{"width":" 118px","textAlign":" center","text":"订单编号","fontWeight":"bold","align":"center"},"1":{"width":" 125px","textAlign":" center","text":"商品名称","align":"center","fontWeight":"bold"},"2":{"width":" 66px","textAlign":" center","text":"分类","fontWeight":"bold","align":"center"},"3":{"width":" 35px","textAlign":" center","text":"数量","fontWeight":"bold","align":"center"},"4":{"width":" 78px","textAlign":" center","text":"客户名称","fontWeight":"bold","align":"center"},"5":{"width":" 48px","textAlign":" center","text":"收件人","fontWeight":"bold","align":"center"},"6":{"width":" 43px","textAlign":" center","text":"收件地","fontWeight":"bold","align":"center"},"7":{"width":" 76px","textAlign":" center","text":"收件地址","align":"center","fontWeight":"bold"},"8":{"width":" 120px","textAlign":" center","text":"下单时间","fontWeight":"bold","align":"center"},"9":{"width":" 86px","textAlign":" center","text":"状态","fontWeight":"bold","align":"center"}},"1":{"0":{"width":" 118px","rowspan":4,"text":"ON2018090300127"},"1":{"width":" 125px","textAlign":" center","text":"夏士莲修护焗油洗发水   "},"2":{"width":" 66px","textAlign":" center","text":"洗涤日化"},"3":{"borderBottom":" 2px solid rgb(33, 133, 208)","width":" 35px","textAlign":" center","questionid":"q-6e401d58-c9be-4a33-978e-a6b0a542b2ae","text":""},"4":{"width":" 78px","textAlign":" center","rowspan":4,"text":"bd49004902"},"5":{"rowspan":4,"text":"江服靖"},"6":{"width":" 43px","textAlign":" center","borderBottom":" 2px solid rgb(33, 133, 208)","rowspan":4,"questionid":"q-52b52582-145c-40e7-ab62-386ec42d2222","text":""},"7":{"width":" 76px","textAlign":" center","rowspan":4,"text":"鹤林路17号"},"8":{"width":" 120px","textAlign":" center","rowspan":4,"text":"2018-09-03 21:19:20"},"9":{"rowspan":4,"text":"完成"}},"2":{"0":{"width":" 118px","display":" none","text":"力士水润丝滑润发素"},"1":{"width":" 125px","textAlign":" center","text":"","questionid":"q-3f8cf34d-870b-6bd3-61ec-14acb0aa4bd8","borderBottom":" 2px solid rgb(33, 133, 208)"},"2":{"width":" 66px","textAlign":" center","borderBottom":" 2px solid rgb(33, 133, 208)","questionid":"q-9390ecb9-f988-4b0a-8e1d-f78dfce75e62","text":""},"3":{"width":" 35px","textAlign":" center","text":"8"},"4":{"width":" 78px","textAlign":" center","display":" none","text":""},"5":{"width":" 48px","textAlign":" center","display":" none","text":""},"6":{"width":" 43px","textAlign":" center","display":" none","text":""},"7":{"width":" 76px","textAlign":" center","display":" none","text":""},"8":{"width":" 120px","textAlign":" center","display":" none","text":""},"9":{"width":" 86px","textAlign":" center","display":" none","text":""}},"3":{"0":{"width":" 118px","display":" none","text":"力士恒久嫩肤沐浴露     "},"1":{"width":" 125px","textAlign":" center","text":"","questionid":"q-c9a8f2a6-359c-dffc-e1c0-37bb337d4217","borderBottom":" 2px solid rgb(33, 133, 208)"},"2":{"width":" 66px","textAlign":" center","text":"","questionid":"q-4a41052f-3d0d-b599-5089-7c9763f2890a","borderBottom":" 2px solid rgb(33, 133, 208)"},"3":{"width":" 35px","textAlign":" center","text":"3"},"4":{"width":" 78px","textAlign":" center","display":" none","text":""},"5":{"width":" 48px","textAlign":" center","display":" none","text":""},"6":{"width":" 43px","textAlign":" center","display":" none","text":""},"7":{"width":" 76px","textAlign":" center","display":" none","text":""},"8":{"width":" 120px","textAlign":" center","display":" none","text":""},"9":{"width":" 86px","textAlign":" center","display":" none","text":""}},"4":{"0":{"text":"奥妙净蓝全效洗衣粉"},"1":{"text":"","questionid":"q-6c074500-01eb-3430-50dc-5bcadfb87c23","borderBottom":" 2px solid rgb(33, 133, 208)"},"2":{"width":" 66px","textAlign":" center","borderBottom":" 2px solid rgb(33, 133, 208)","questionid":"q-a98ffb3b-e001-460a-97f3-de9cc17338ef","text":""},"3":{"borderBottom":" 2px solid rgb(33, 133, 208)","width":" 35px","textAlign":" center","text":""},"4":{"width":" 78px","display":" none","textAlign":" center","text":""},"5":{"width":" 48px","display":" none","textAlign":" center","text":""},"6":{"width":" 43px","display":" none","textAlign":" center","text":""},"7":{"width":" 76px","display":" none","textAlign":" center","text":""},"8":{"width":" 120px","display":" none","textAlign":" center","text":""},"9":{"width":" 86px","display":" none","textAlign":" center","text":""}},"rows":[{"height":"40px"},{"height":"40px"},{"height":"40px"},{"height":"40px"},{"height":"40px"}],"cols":[{"width":145,"index":0},{"width":180,"index":1},{"width":110,"index":2},{"width":90,"index":3},{"width":113,"index":4},{"width":83,"index":5},{"width":98,"index":6},{"width":93,"index":7},{"width":154,"index":8},{"width":56,"index":9}]}
        }],
        tableContent: {
        	//     0: {
        	//         0: {
        	//             text: "ss",
        	//             canedit: true
        	//         },
        	//         1: {
        	//             text: "bb",
        	//             canedit: false
        	//         }
        	//     },
        	rows: [{
        			height: 40
        		},
        		{
        			height: 40
        		},
        		{
        			height: 40
        		},
        		{
        			height: 40
        		},
        		{
        			height: 40
        		}
        	],
        	cols: [{
        			index: 0,
        			width: 90
        		},
        		{
        			index: 1,
        			width: 90
        		},
        		{
        			index: 2,
        			width: 90
        		},
        		{
        			index: 3,
        			width: 90
        		},
        		{
        			index: 4,
        			width: 90
        		}
        	]
        }
      }
    },
    components: {
      VExcel
    },
    watch: {
      bb(val, newval) {
        console.log('-----------------------')
        console.log(newval)
      },
      deep: true
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
