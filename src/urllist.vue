<template>
  <div>
    <ul v-for="item in listdata">
      <li >
        {{ item.title }} : {{ item.url }}
      </li>
    </ul>
  </div>
</template>

<script>
var alldata = [{
  title:"GitHub",
  url:"https://github.com/"
},
{
  title:"CodeSandbox",
  url:"https://codesandbox.io/"
}]




export default {
  name: 'urllist',
  data() {
    return {
      listdata: localStorage.dailyitems
    }
  }
}
</script>
