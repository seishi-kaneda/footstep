<template>
  <div id="app">
    <InputArea></InputArea>
    <ListArea></ListArea>
    <button @click="clearAll">クリア</button>
    <button @click="openNewTab">タブで開く</button>
    <button @click="btDebug">デバッグ</button>
  </div>
</template>

<script>
import ListArea from './coms/ListArea';
import InputArea from './coms/InputArea';


export default {
  name: 'app',
  components: {
    InputArea,
    ListArea
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    clearAll: function() {
      localStorage.clear();
      localStorage.counter = 0;
    },
    openNewTab: function() {
      chrome.tabs.create({url: "index.html"});
    },
    btDebug: function() {
      console.log("localStorage:");
      console.log(localStorage.getItem("dailyitems"));
    }
  }
}




</script>

<style>
body {
  min-width: 600px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}



a {
  color: #42b983;
}
</style>
