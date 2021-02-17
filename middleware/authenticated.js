export default function (context) {
    // $axios, $config, app, redirect, route, store
    if (context.route.path !== "/login") {
        if (!context.store.state.account.userInfo.token) {
            return context.redirect("/login");
        }
    }
}
