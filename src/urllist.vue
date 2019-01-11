<template>
  <div>
    <ul v-for="item in listdata">
      <li>
        <img :src='item.favIconUrl' width="16px" height="16px" />
        <a href="{{ item.url }}">{{ item.title }}</a>
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
      listdata: JSON.parse(localStorage.dailyitems)
    }
  }
}
</script>
