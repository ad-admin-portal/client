import Vue from "vue";
import VueToastify from "vue-toastify";

Vue.use(VueToastify, {
    position: "top-right",
    theme: 'light',
    // customNotifications: {
    //     success: {
    //         body: "You did it!",
    //         defaultTitle: false,
    //         icon: '<svg width="50" height="50">\n' +
    //             '<rect width="50" height="50" style="fill:rgb(0,0,255);" />\n' +
    //             '</svg> ',
    //         canTimeout: false
    //     }
    // }
});