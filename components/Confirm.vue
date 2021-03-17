<template>
    <div>
        <vue-confirm-dialog></vue-confirm-dialog>
    </div>
</template>
<script>

import Vue from 'vue'
import VueConfirmDialog from 'vue-confirm-dialog'
 
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

export default ({
    data(){
      return {
          buttonTxt : {no: '취소',yes: '확인'}
      }
    },
    methods: {
        customConfirm(content,type){
            this.$confirm(
                {
                    message: content,
                    button: this.buttonTxt,
                    callback: confirm => {
                        if (confirm) {
                            this.$emit(type);
                        }
                    }
                }
            )
        }
  }
})
</script>
