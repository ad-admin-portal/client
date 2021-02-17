<template>
  <CBreadcrumb v-bind="props">
    <slot></slot>
  </CBreadcrumb>
</template>

<script>
// import CBreadcrumb from './CBreadcrumb'

export default {
  name: 'CBreadcrumbRouter2',
  // components: {
  //   CBreadcrumb
  // },
  props: {
    addClasses: [String, Array, Object],
    addLinkClasses: [String, Array, Object],
    addLastItemClasses: [String, Array, Object]
  },
  computed: {
    items () {
      const routes = this.$route.path.split('/')
      return routes.map(route => {
        return {
          to: '/' + route,
          text: route
        }
      })
    },
    props () {
      return {
        items: this.items,
        addClasses: this.addClasses,
        addLinkClasses: this.addLinkClasses,
        addLastItemClasses: this.addLastItemClasses
      }
    }
  }
}
</script>


<style>

</style>
