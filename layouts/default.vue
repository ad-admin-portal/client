<template>
    <div>
        <div class="c-app" :class="{ 'c-dark-theme': this.$store.state.sidebar.darkMode }">
            <TheSidebar />
            <CWrapper>
                <TheHeader />
                <div class="c-body">
                    <main class="c-main">
                        <CContainer fluid class="h-100">
                            <transition name="fade" mode="out-in">
                                <nuxt />
                            </transition>
                        </CContainer>
                    </main>
                </div>
                <TheFooter />
            </CWrapper>
        </div>
    </div>
</template>

<script>
import { iconsSet as icons } from "@/assets/icons/icons.js";

export default {
    created() {
        this.$root.$options.icons = icons;
        this.initRoles();
        this.initDepartments();
        this.initMenus();
        this.initCodes();
    },
    methods: {
        initRoles() {
            this.$axios.get("/api/system/role").then((response) => {
                this.$store.commit("role/set", response.data);
            });
        },
        initDepartments() {
            this.$axios.get("/api/group").then((response) => {
                this.$store.commit("group/set", response.data);
            });
        },
        initMenus() {
            this.$axios.get("/api/menu").then((response) => {
                if (response.status === 200) {
                    this.$store.commit("menu/set", response.data);
                }
            });
        },
        initCodes() {
            this.$axios.get("/api/code").then((response) => {
                if (response.status === 200) {
                    this.$store.commit("code/set", response.data);
                }
            });
        },
    },
};
</script>

<style>
button:disabled {
    cursor: not-allowed;
    /* pointer-events: all !important; */
}
</style>
