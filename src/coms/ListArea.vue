<template>
  <div>
    <table>
      <tr v-for="item in listdata">
        <td>footcount time</td>
        <td><img :src='item.favIconUrl' width="16px" height="16px" /></td>
        <td align="left"><p class="overflow"><a href="{{ item.url }}" target="_blank">{{ item.title }}</a></p></td>
      </tr>
    </table>
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
  name: 'ListArea',
  data() {
    return {
      listdata: JSON.parse(localStorage.dailyitems)
    }
  }
}
</script>
