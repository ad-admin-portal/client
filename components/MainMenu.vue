<template>
  <CNav>
    <CNavItem active>
      <nuxt-link to="/dashboard" class="nav">Dashboard</nuxt-link>
    </CNavItem>
    <CNavItem>
      <nuxt-link to="/users" class="nav">Users</nuxt-link>
    </CNavItem>
    <CNavItem>
      <nuxt-link to="/settings" class="nav">Settings</nuxt-link>
    </CNavItem>
  </CNav>
</template>

<script>
export default {
  data() {
    return {
      navbarText: false
    }
  }
}
</script>