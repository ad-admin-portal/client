<template>
    <div>
        <CCard>
            <CCardHeader>
                <CButton
                    color="info"
                    class="float-right"
                    @click.stop="insertModal.modal=true"
                    >
                    등록
                </CButton>
            </CCardHeader>
            <CCardBody>
                <CDataTable
                    :items="mails"
                    :fields="fields"
                    items-per-page-select
                    :items-per-page="10"
                    hover
                    sorter
                    pagination
                    table-filter
                    cleaner
                >
                    <template #btn="{item}">
                        <td>
                            <CButton
                                color="success"
                                @click.stop="openUpdateModal(item)"
                                >
                              수정
                              </CButton>
                              <CButton
                                color="danger"
                                @update:checked="handleSwitchUpdate(item)"
                            >
                              삭제
                              </CButton>
                        </td>
                    </template>
                </CDataTable>
            </CCardBody>
        </CCard>

        <MailModal
            :modal-title="updateModal.modalTitle"
            :rowData="updateModal.rowData"
            :show-modal="updateModal.modal"
             @close="
                () => {
                    updateModal.modal = false;
                }
            "
            @confirm="insertMailInfo"
            />
        <MailModal
        :modal-title="insertModal.modalTitle"
        :show-modal="insertModal.modal"
        @close="
        () => {
            insertModal.modal = false;
        }
        "
        @confirm="insertMailInfo"
            />

    </div>
</template>

<script>

export default {
    name: "app",
    data() {
        return {
            mails: [],
            fields: [
                { key: "type", label: "종류" },
                { key: "smsContent", label: "SMS 포맷"},
                { key: "mailContent", label: "EMAIL 포맷" },
                { key: "sendTime", label: "발송 시간" },
                { key: "sendDueDate", label: "만료 며칠전인지" },
                { key: "btn", label:""}
            ],
            updateModal: {
                modal: false,
                modalTitle:"SMS/EMAIL 폼 수정",
                rowData:{}
            },
            insertModal: {
                modal: false,
                modalTitle:"SMS/EMAIL 폼 등록"
            },
            collapseDuration: 300,
            warningModal:false
        };
    },
    computed: {

    },
     created() {
        this.$axios.get("/api/management/mail").then((response) => {
            if (response.status === 200) {
                this.mails = response.data
            }
        });
    },
    methods: {
        openUpdateModal(item){
            this.updateModal.rowData = item;
            this.updateModal.modal = true;
        },
        insertMailInfo(formData){
            console.log(formData);
            this.$axios.post("/api/management/mail",formData)
            .then((response)=>{
                console.log(response);
            })
        }
    }
};
</script>

<style scoped></style>
