<template>
  <div class="thanks">
    <!-- <iframe
      src="https://apk.neters.club"
      id="apidoc"
      scrolling="no"
      frameborder="0"
      style="width:100%;"
    ></iframe> -->

    <iframe
      src="https://apk.neters.club"
      scrolling="auto"
      id="apidoc"
      width="100%"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "APIDoc",
  data() {
    return {};
  },
  mounted() {
    /**
     * iframe-宽高自适应显示
     */
    function changeMobsfIframe() {
      const apidoc = document.getElementById("apidoc");
      const deviceWidth = document.body.clientWidth;
      const deviceHeight = document.body.clientHeight;
      //   apidoc.style.width = Number(deviceWidth) - 120 + "px"; //数字是页面布局宽度差值
      apidoc.style.height = Number(deviceHeight) - 128 + "px"; //数字是页面布局高度差
    }

    changeMobsfIframe();

    window.onresize = function() {
      changeMobsfIframe();
    };
  }
};
</script>

<style scoped>
.thanks {
  text-align: center;
  font-size: 30px;
  color: darkgray;
}
</style>
