<template>
  <div>

   <template>
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
          :value="formData.sendType"
          @input="formData.sendType = $event.target.value"
          @change="changeSendTypeOption"
          :options="selectOption.sendType"
        />
      </CCol>
      <CCol sm="2">
        <CSelect
          label="발송 대상"
          :value="formData.sendUser"
          @input="formData.sendUser = $event.target.value"
          :options="selectOption.sendUser"
        >
        </CSelect>
      </CCol>
    </CRow>
  </div>
</template>

<template>

  <CTabs :active-tab="activeNumber">
    <CTab
    title="SMS"
    v-show="Number(formData.sendType) === 0 || Number(formData.sendType) === 1">
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
    <CTab 
    title="EMAIL"
    v-show="Number(formData.sendType) === 0 || Number(formData.sendType) === 2">
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

    <template>
      <CButton size="sm" color="success" @click="confirm">
          <CIcon name="cil-check-circle" />
          <span class="align-middle ml-1">저장</span>
      </CButton>
      <CButton size="sm" color="dark" @click="$emit('close')">
          <CIcon name="cil-ban" />
          <span class="align-middle ml-1">취소</span>
      </CButton>
    </template>
  </div>
</template>

<script>
  import { EmailEditor } from 'vue-email-editor'
  import { validationMixin } from "vuelidate";
  import { required, minLength, maxLength } from "vuelidate/lib/validators";


  export default {
    mixins: [validationMixin],
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
          menu: {enabled:false},
          image: {enabled:false}
        },
        modalActiveNum:0,
        options: {},
        formData : {
          id : null,
          type : null,
          smsContent : null,
          mailContent : null,
          sendTime : null,
          sendDueDate : null,
          sendType : 0,
          sendUser : 0
        },
        selectOption: {
          sendType: [
            {value:1, label:'SMS'},
            {value:2, label:'EMAIL'},
            {value:0, label:'둘 다 발송'}
            ],
          sendUser: [
            {value:1, label:'사용자'},
            {value:2, label:'관리자'},
            {value:0, label:'둘 다 발송'}
            ]
        },
        activeNumber:0
      }
    },
    watch: {
      rowData(){
        this.formData = this.setFormData();
        this.editorLoaded();
      },
      formData(){
        this.changeSendTypeOption();
      }
    },
    computed:{
      isValid() {
            return !this.$v.formData.$invalid;
        },
      isDirty() {
          return this.$v.formData.$anyDirty;
      }
    },
    methods: {
      changeSendTypeOption(){
        console.log(this.formData.sendType);
        if(Number(this.formData.sendType) === 2){
          this.activeNumber = 1;
        }else{
          this.activeNumber = 0;
        }
      },
      // update 의 경우 폼에 기존 값 입력
      setFormData(){
        if(this.rowData.mailContent !== "" || this.rowData.mailContent !== null){
          this.$refs.emailEditor.editor.loadDesign(JSON.parse(this.rowData.mailContent));
        }
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
        this.$refs.emailEditor.editor.loadDesign();
      },
      updateValue(target) {
         this.formData.sendType=target.value;
       },
      // 저장
      confirm(){
        if(!this.isValid){ 
          // this.$vToastify.error("validation error");
          return;
        };

        this.$refs.emailEditor.editor.saveDesign(
         (design) => {
           this.formData.mailContent = JSON.stringify(design);
          }
        )
        this.$emit('confirm',this.formData);
      }
    },
    validations:{
      formData:{
        type:{
          required,
          minLength: minLength(1),
          maxLength: maxLength(5)
        },
        sendTime:{
          required
        },
        sendDueDate:{
          minLength: minLength(1),
          maxLength: maxLength(5)
        },
        sendType:{
          required
        },
        sendUser:{
          required
        }
      }
    }
  }
</script>

<style>
.unlayer-editor{
    height:500px;
}
</style>