<template>
    <CSidebar
        style="background: #2ac1bc"
        :minimize="minimize"
        :show="show"
        @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
    >
        <CSidebarBrand class="d-md-down-none" to="/">
            <img src="/logo.png" class="c-sidebar-brand-full" />
            <img src="/logo_s.png" class="c-sidebar-brand-minimized" />
        </CSidebarBrand>
        <CRenderFunction flat :content-to-render="sidebarItems" />
        <CSidebarMinimizer
            class="c-d-md-down-none"
            @click.native="$store.commit('sidebar/toggle', 'sidebarMinimize')"
        />
    </CSidebar>
</template>

<script>
import SidebarItems from "./SidebarItems";
export default {
    name: "TheSidebar",
    extends: SidebarItems,
    computed: {
        show() {
            return this.$store.state.sidebar.sidebarShow;
        },
        minimize() {
            return this.$store.state.sidebar.sidebarMinimize;
        },
    },
};
</script>

<style scoped>
</style>
