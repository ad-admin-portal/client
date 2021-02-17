<template>
  <nuxt/>
</template>

<script>
import {iconsSet as icons} from "~/assets/icons/icons";

export default {
  name: "LoginLayout",
  created() {
    this.$root.$options.icons = icons
  },
}
</script>

<style scoped>

</style>
