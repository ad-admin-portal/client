<script>
export default {
    name: "Nav",
    data() {
        return {};
    },
    computed: {
        sidebarItems() {
            const nav = {
                _name: "CSidebarNav",
                _children: this.$store.state.menu.menus
                    .filter((menu) => menu.parentId === 1)
                    .map((menu) => {
                        const menuItem = {
                            _name: "CSidebarNavDropdown",
                            name: menu.name,
                            route: menu.path,
                            icon: menu.icon,
                            id: menu.id,
                            items: this.$store.state.menu.menus
                                .filter((childMenu) => childMenu.parentId === menu.id)
                                .map((childMenu) => {
                                    return {
                                        name: childMenu.name,
                                        to: menu.path + childMenu.path,
                                    };
                                }),
                        };
                        if (menuItem.items.length === 0) {
                            menuItem._name = "CSidebarNavItem";
                            menuItem.to = menuItem.route;
                        }
                        return menuItem;
                    }),
            };
            return [nav];
        },
        // sidebarItems() {
        //     return [
        //         {
        //             _name: "CSidebarNav",
        //             _children: [
        //                 {
        //                     _name: "CSidebarNavDropdown",
        //                     name: "Dashboard",
        //                     route: "/dashboard",
        //                     icon: "cil-speedometer",
        //                     items: [
        //                         {
        //                             name: "센터별 평가 점수",
        //                             to: "/dashboard/score",
        //                         },
        //                         {
        //                             name: "보종/상품별 경가 진행",
        //                             to: "/dashboard/product",
        //                         },
        //                         {
        //                             name: "평가사별 평가율",
        //                             to: "/dashboard/evaluator",
        //                         },
        //                     ],
        //                 },
        //                 {
        //                     _name: "CSidebarNavDropdown",
        //                     name: "배분",
        //                     icon: "cil-cursor",
        //                     items: [
        //                         {
        //                             name: "자동평가 배분 모니터링",
        //                             to: "/allocate/monitoring",
        //                         },
        //                         {
        //                             name: "평가 진행률",
        //                             to: "/allocate/rate",
        //                         },
        //                         {
        //                             name: "평가 처리 상세",
        //                             to: "/allocate/detail",
        //                         },
        //                     ],
        //                 },
        //                 {
        //                     _name: "CSidebarNavDropdown",
        //                     name: "계약체결",
        //                     route: "/target",
        //                     icon: "cil-code",
        //                     items: [
        //                         {
        //                             name: "계약체결 sub1",
        //                             to: "/target/target1",
        //                             icon: "cil-code",
        //                         },
        //                         {
        //                             name: "계약체결 sub2",
        //                             to: "/target/target2",
        //                             icon: "cil-justify-left",
        //                         },
        //                         {
        //                             name: "계약체결 sub3",
        //                             to: "/target/target3",
        //                             icon: "cil-justify-left",
        //                         },
        //                     ],
        //                 },
        //                 {
        //                     _name: "CSidebarNavDivider",
        //                     _class: "m-2",
        //                 },
        //                 {
        //                     _name: "CSidebarNavDropdown",
        //                     name: "TA엔진관리",
        //                     route: "/taengine",
        //                     icon: "cil-notes",
        //                     items: [
        //                         {
        //                             name: "TA엔진관리 sub1",
        //                             to: "/taengine/ta1",
        //                         },
        //                         {
        //                             name: "TA엔진관리 sub2",
        //                             to: "/taengine/ta2",
        //                         },
        //                         {
        //                             name: "TA엔진관리 sub3",
        //                             to: "/taengine/ta3",
        //                         },
        //                     ],
        //                 },
        //                 {
        //                     _name: "CSidebarNavDropdown",
        //                     name: "정보관리",
        //                     icon: "cil-book",
        //                     items: [
        //                         {
        //                             name: "사용자 관리",
        //                             to: "/management/user",
        //                         },
        //                         {
        //                             name: "사용자 메뉴 권한 관리",
        //                             to: "/management/role",
        //                         },
        //                         {
        //                             name: "코드 관리",
        //                             to: "/management/code",
        //                         },
        //                         {
        //                             name: "휴일 관리",
        //                             to: "/management/holiday",
        //                         },
        //                         {
        //                             name: "상품 코드 관리",
        //                             to: "/management/product",
        //                         },
        //                         {
        //                             name: "평가자 자동배분 관리",
        //                             to: "/management/allocation",
        //                         },
        //                     ],
        //                 },
        //                 {
        //                     _name: "CSidebarNavDropdown",
        //                     name: "시스템관리",
        //                     route: "/system",
        //                     icon: "cil-settings",
        //                     items: [
        //                         {
        //                             name: "권한 관리",
        //                             to: "/system/role",
        //                         },
        //                         {
        //                             name: "메뉴 관리",
        //                             to: "/system/menu",
        //                         },
        //                     ],
        //                 },
        //                 {
        //                     _name: "CSidebarNavDropdown",
        //                     name: "모니터링",
        //                     route: "/monitoring",
        //                     icon: "cil-monitor",
        //                     items: [
        //                         {
        //                             name: "실시간 평가 모니터링",
        //                             to: "/monitoring/realtime",
        //                         },
        //                     ],
        //                 },
        //                 {
        //                     _name: "CSidebarNavDropdown",
        //                     name: "일배치Job",
        //                     route: "/batch",
        //                     icon: "cil-history",
        //                     items: [
        //                         {
        //                             name: "일배치Job sub1",
        //                             to: "/batch/batch1",
        //                         },
        //                         {
        //                             name: "일배치Job sub2",
        //                             to: "/batch/batch2",
        //                         },
        //                         {
        //                             name: "일배치Job sub3",
        //                             to: "/batch/batch3",
        //                         },
        //                     ],
        //                 },
        //             ],
        //         },
        //     ];
        // },
    },
};
</script>
