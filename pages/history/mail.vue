<template>
    <div>
        <CCard>
            <CCardBody>
                <CDataTable
                    :items="history"
                    :fields="fields"
                    items-per-page-select
                    :items-per-page="10"
                    hover
                    sorter
                    pagination
                    table-filter
                    cleaner
                    clickable-rows
                    @row-clicked="rowClicked"
                >
                    <template #details="{ item }">
                        <CCollapse :show="Boolean(item._toggled)" :duration="collapseDuration">
                            <CInput
                                placeholder="User ID"
                                :lazy="false"
                                invalid-feedback="User ID의 입력값은 4~32자 입니다."
                            />
                        </CCollapse>
                    </template>
                </CDataTable>
            </CCardBody>
        </CCard>
    </div>
</template>

<script>

export default {
    name: "Mail",
    data() {
        return {
            history: [],
            fields: [
                { key: "target", label: "ID" },
                { key: "title", label: "제목"},
                { key: "sendType", label: "유형" },
                { key: "sendDate", label: "날짜" },
                { key: "sendStatus", label: "로그" },
            ],
            
            collapseDuration: 300 
        };
    },
    computed: {

    },
     created() {
        this.$axios.get("/api/history/mail").then((response) => {
            if (response.status === 200) {
                this.history = response.data.map((history)=>{

                    return Object.assign({},history,{_toggled: false})
                })
            }
        });
    },
    methods: {
        rowClicked(item, index, column, e) {
            item._toggled = !item._toggled;
        }
    }
};
</script>

<style scoped></style>
