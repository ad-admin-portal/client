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
                <!-- <router-link 
                class="float-right btn btn-info"
                color="info"
                to="/management/mailDetail">등록</router-link> -->
            </CCardHeader>
            <CCardBody>
                <!-- <router-view> -->
                    <CDataTable
                        :items="mailsData"
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
                                    @click.stop="openDeleteConfirm(item)"
                                >
                                삭제
                                </CButton>
                            </td>
                        </template>
                    </CDataTable>
                <!-- </router-view> -->
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
            @confirm="openUpdateConfirm"
        />
        <MailModal
            :modal-title="insertModal.modalTitle"
            :show-modal="insertModal.modal"
            @close="
            () => {
                insertModal.modal = false;
            }
            "
            @confirm="openInsertConfirm"
        />
        <Confirm ref="confirmComponent"
            @delete="disableMailInfo"
            @update="updateMailInfo"
            @insert="insertMailInfo"
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
                { key: "sendTime", label: "발송 시간" },
                { key: "sendDueDate", label: "만료 며칠전인지" },
                { key: "sendType", label: "발송 유형" },
                { key: "sendUser", label: "발송 대상" },
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
            targetMail:{},
            warningModal:false
        };
    },
    computed: {
        mailsData(){
            return this.mails.map((item,index)=>{

            //    switch(item.sendType){
            //        case 0:
            //            item.sendType = "둘 다";
            //            break;
            //         case 1:
            //             item.sendType="EMAIL"
            //             break;
            //         case 2:
            //             item.sendType="SMS/EMAIL"
            //             break;
            //    }

               return {...item,index};
            });

        }
    },
    created() {
        this.$axios.get("/api/management/enabledMail").then((response) => {
            if (response.status === 200) {
                this.mails = response.data;
            }
        });
    },
    methods: {
        openUpdateModal(item){
            this.targetMail = item;
            this.updateModal.rowData = item;
            this.updateModal.modal = true;
        },
        insertMailInfo(){
            this.$axios.post("/api/management/mail",this.targetMail)
            .then((response)=>{
                 if (response.status === 201) {
                     this.$vToastify.success("성공");
                     this.insertModal.modal = false;
                     this.mails.unshift(response.data);
                     this.reset();
                }else{
                     this.$vToastify.error("실패");
                }
            })
        },
        updateMailInfo(){
            this.$axios.put("/api/management/mail/"+this.targetMail.id,this.targetMail)
            .then((response)=>{
                if (response.status === 200) {
                    this.$vToastify.success("성공");
                    this.updateModal.modal = false;
                    const index = this.mails.findIndex((_mail) => _mail.id === this.targetMail.id);
                        if (index >= 0) {
                            this.mails.splice(index, 1, this.targetMail);
                        }
                }else{
                    this.$vToastify.error("실패");
                }
            })
        },
        disableMailInfo(){
            this.$axios.delete("/api/management/mail/"+this.targetMail.id)
            .then((response)=>{
                if (response.status === 200) {
                    this.$vToastify.success("성공");
                    const index = this.mails.findIndex((_mail) => _mail.id === this.targetMail.id);
                    this.mails.splice(index, 1);
                }else{

                }
            })
        },
        openDeleteConfirm(item){
            this.targetMail = item;
            return this.$refs.confirmComponent.customConfirm('삭제하시겠습니까?','delete');
        },
        openUpdateConfirm(item){
            this.targetMail = item;
            return this.$refs.confirmComponent.updateConfirm();
        },
        openInsertConfirm(item){
            this.targetMail = item;
            this.$refs.confirmComponent.insertConfirm();
        }
    }
};
</script>

<style scoped></style>
