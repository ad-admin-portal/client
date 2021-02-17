<template>
  <!-- <CRow>
    <CCol col="12" class="m-0">
      <CNav vertical="lg" pills >
        <CNavItem active><nuxt-link to="/dashboard" class="nav">Dashboard</nuxt-link></CNavItem>
        <CNavItem><nuxt-link to="/distribution" class="nav">배분</nuxt-link></CNavItem>
        <CNavItem>계약체결</CNavItem>
        <CNavItem>TA엔진관리</CNavItem>
        <CNavItem>정보관리</CNavItem>
        <CNavItem>시스템관리</CNavItem>
        <CNavItem>일배치Job</CNavItem>
      </CNav>
    </CCol>
  </CRow> -->
  <CSidebar
    :minimize="minimize"
    unfoldable
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <CIcon
        class="c-sidebar-brand-full"
        name="logo"
        size="custom-size"
        :height="35"
        view-box="0 0 642 134"
      />
      <CIcon
        class="c-sidebar-brand-minimized"
        name="logo"
        size="custom-size"
        :height="35"
        view-box="0 0 110 134"
      />
    </CSidebarBrand>
    <CCol col="12" class="m-0">
      <CNav vertical="lg" pills>
        <CNavItem active>
          <nuxt-link to="/dashboard" class="nav" color="white">
            Dashboard
          </nuxt-link>
        </CNavItem>
        <CNavItem
          ><nuxt-link to="/distribution" class="nav">배분</nuxt-link></CNavItem
        >
        <CNavItem>계약체결</CNavItem>
        <CNavItem>TA엔진관리</CNavItem>
        <CNavItem>정보관리</CNavItem>
        <CNavItem>시스템관리</CNavItem>
        <CNavItem>일배치Job</CNavItem>
      </CNav>
    </CCol>
    <CSidebarMinimizer
      class="c-d-md-down-none"
      @click.native="$store.commit('toggle', 'sidebarMinimize')"
    />
  </CSidebar>
</template>

<script>
export default {
  computed: {
    show() {
      return this.$store.state.sidebarShow;
    },
    minimize() {
      return this.$store.state.sidebarMinimize;
    },
  },
};
</script>

<style></style>
