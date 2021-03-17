export default {
    // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
    ssr: false,

    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        title: "AD Admin Portal",
        meta: [
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { hid: "description", name: "description", content: "" },
        ],
        link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [{ src: "~/assets/scss/style.scss", lang: "scss" }],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [{ src: "~/plugins/coreui", mode: "client" }, "~/plugins/axios", { src: "~/plugins/persistedState.js" },{ src:"~/plugins/toastify" }],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        // https://go.nuxtjs.dev/eslint
        "@nuxtjs/eslint-module",
        [
            "@nuxtjs/fontawesome",
            {
                component: "fa",
                suffix: true,
                icons: {
                    solid: ["faUndo", "faBan", "faPlus", "faHammer", "faArchive"],
                    regular: [
                        "faTrashAlt",
                        "faEdit",
                        "faSave",
                        "faPlusSquare",
                        "faMinusSquare",
                        "faFile",
                        "faFolder",
                        "faFolderOpen",
                    ],
                },
            },
        ],
    ],

    primevue: {
        theme: "saga-blue",
        ripple: true,
        components: [
            "Button",
            "Card",
            "Column",
            "DataTable",
            "Dropdown",
            "InputText",
            "Menu",
            "Menubar",
            "OrderList",
            "Panel",
            "PanelMenu",
            "Sidebar",
            "Toast",
            "TreeTable",
        ],
    },

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        // https://go.nuxtjs.dev/axios
        "@nuxtjs/axios",
        "primevue/nuxt",
    ],

    // Axios module configuration (https://go.nuxtjs.dev/config-axios)
    axios: {
        proxy: true,
    },
    proxy: {
        "/api": "http://localhost:7001",
    },

    styleResources: {
        scss: "./assets/scss/style.scss",
    },

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {},

    router: {
        middleware: "authenticated",
    },
};
