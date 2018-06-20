<template>
    <div class="about">
        <word-study></word-study>
    </div>
</template>

<script>
import WordStudy from "../components/WordStudy"
export default {
  name: "About",
  components: {
      WordStudy,
  },
  data () {
      return {

      }
  },
};
</script>

<style lang="less">
.about{
    width: 100%;
    height: 100%;
}
</style>
