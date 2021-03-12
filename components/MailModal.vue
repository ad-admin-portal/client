<template>
  <CModal :title="modalTitle" :show="showModal" size="xl">

   <template #header>
      <h6 class="modal-title">{{ modalTitle }}</h6>
      <CButtonClose class="text-white" @click="$emit('close')" />
    </template>

    <template>
  <div>
    <CRow>
      <CCol sm="2">
        <CInput
          label="종류"
          v-model="formData.type"
        />
      </CCol>
       <CCol sm="2">
        <CInput
          label="만료일"
          v-model="formData.sendDueDate"
        />
      </CCol>
      <CCol sm="2">
        <CInput
          label="발송 시간"
          type="time"
          v-model="formData.sendTime"
        />
      </CCol>
      <CCol sm="2">
        <CSelect
          label="발송 타입"
          v-model="formData.sendType"
          :options="selectOption.sendType"
        />
      </CCol>
      <CCol sm="2">
        <CSelect
          label="발송 대상"
          v-model="formData.sendUser"
          :options="selectOption.sendUser"
        >
        </CSelect>
      </CCol>
    </CRow>
  </div>
</template>

<template>
  <CTabs :active-tab="1">
    <CTab title="SMS">
      <CRow class="m-3">
        <CCol sm="12">
          <CTextarea
            label="내용"
            placeholder="Enter your name"
            v-model="formData.smsContent"
            class="h-100"
          />
        </CCol>
    </CRow>
    </CTab>
    <CTab title="EMAIL">
       <div id="app" class="m-3">
        <div class="container">
          <EmailEditor
            :project-id="projectId"
            :locale="locale"
            :tools="tools"
            :options="options"
            ref="emailEditor"
            v-on:load="editorLoaded"
          />
        </div>
    </div>
    </CTab>
  </CTabs>
</template>

    <template #footer>
      <CButton size="sm" color="success" @click="confirm">
          <CIcon name="cil-check-circle" />
          <span class="align-middle ml-1">확인</span>
      </CButton>
      <CButton size="sm" color="dark" @click="$emit('close')">
          <CIcon name="cil-ban" />
          <span class="align-middle ml-1">취소</span>
      </CButton>
    </template>
  </CModal>
</template>

<script>
  import { EmailEditor } from 'vue-email-editor'
  
  export default {
    components: {
      EmailEditor
    },
    props: {
        modalTitle: {
            type: String,
            default: "Title",
        },
        showModal: {
            type: Boolean,
            required: true,
        },
        rowData:{}
    },
    data() {    
      return {  
        locale: "ko",
        projectId: 0, // replace with your project id
        tools: {
          html: {enabled:false},
          button: {enabled:false},
          menu: {enabled:false}
        },
        options: {},
        formData : {
          id : null,
          type : null,
          smsContent : null,
          mailContent : null,
          sendTime : null,
          sendDueDate : null,
          sendType : null,
          sendUser : null
        },
        selectOption: {
          sendType: [{value:0, label:'SMS'},{value:1, label:'EMAIL'},{value:2, label:'둘 다 발송'}],
          sendUser: [{value:0, label:'사용자'},{value:1, label:'관리자'},{value:2, label:'둘 다 발송'}]
        }
      }
    },
    watch: {
      rowData(){
        this.formData = this.setFormData();
      }
    },
    methods: {
      setFormData(){
        return {
          id : this.rowData.id,
          type : this.rowData.type,
          smsContent : this.rowData.smsContent,
          mailContent : this.rowData.mailContent,
          sendTime : this.rowData.sendTime,
          sendDueDate : this.rowData.sendDueDate,
          sendType : this.rowData.sendType,
          sendUser : this.rowData.sendUser
        }
      },
      editorLoaded() {
        // Pass your template JSON here
        // this.$refs.emailEditor.editor.loadDesign({});
      },
      confirm(){
         this.$refs.emailEditor.editor.exportHtml(
          (data) => {
            this.formData.mailContent = data;
          }
        )
        this.$emit('confirm',this.formData);
      }
    },
    validations:{
      formData:{
        
      }
    }
  }
</script>

<style>
.unlayer-editor{
    height:500px;
}
</style>