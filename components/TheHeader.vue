<template>
    <CHeader with-subheader>
        <CToggler in-header class="ml-3 d-lg-none" @click="$store.commit('sidebar/toggleSidebarMobile')" />
        <CToggler in-header class="ml-3 d-md-down-none" @click="$store.commit('sidebar/toggleSidebarDesktop')" />
        <CHeaderBrand class="mx-auto d-lg-none" to="/">
            <CIcon name="logo" height="48" alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav class="ml-auto">
            <!-- <CHeaderNavItem class="px-3 c-d-legacy-none">
        <button class="c-header-nav-btn" @click="() => $store.commit('sidebar/toggle', 'darkMode')">
          <CIcon v-if="$store.state.darkMode" name="cil-sun" />
          <CIcon v-else name="cil-moon" />
        </button>
      </CHeaderNavItem> -->
            <CAccountDropdown />
        </CHeaderNav>
    </CHeader>
</template>

<script>
export default {
    methods: {},
};
</script>
