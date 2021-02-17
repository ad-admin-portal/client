<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0">
    <template #toggler>
      <CHeaderNavLink>
        {{$store.state.account.userInfo.userName ? $store.state.account.userInfo.userName : 'invalid session'}}
      </CHeaderNavLink>
    </template>
    <CDropdownHeader
      tag="div"
      class="text-center"
      color="light">
      <strong>Settings</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-user" /> Profile
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-settings" /> Settings
    </CDropdownItem>
    <CDropdownDivider/>
    <CDropdownItem @click="logout">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
export default {
  name: 'CAccountDropdown',
  data () {
    return {
      itemsCount: 42
    }
  },
  methods: {
    logout() {
      this.$store.commit('account/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>
