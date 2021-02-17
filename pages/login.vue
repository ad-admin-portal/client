<template>
  <div class="c-app flex-row align-items-center" :class="{ 'c-dark-theme': $store.state.darkMode }">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="4">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <h1>Login</h1>
                <p class="text-muted">Sign In to your account</p>
                <div v-if="errorStatus === false" class="mb-3 alert alert-danger">
                  {{ errorMessage }}
                </div>
                <CInput ref="userId" v-model="userId" placeholder="Username" autocomplete="username email">
                  <template #prepend-content>
                    <CIcon name="cil-user"/>
                  </template>
                </CInput>
                <CInput v-model="password" placeholder="Password" type="password" autocomplete="current-password"
                        @keypress.enter="login">
                  <template #prepend-content>
                    <CIcon name="cil-lock-locked"/>
                  </template>
                </CInput>
                <CRow>
                  <CCol col="6" class="text-left">
                    <CButton color="primary" class="px-4" @click="login">Login</CButton>
                  </CCol>
                  <CCol col="6" class="text-right">
                    <CButton color="link" class="px-0">Forgot password?</CButton>
                    <CButton color="link" class="d-lg-none">Register now!</CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>

export default {
  name: "Login",
  layout: "login-layout",
  data() {
    return {
      userId: '',
      password: '',
      errorStatus: null,
      errorMessage: ''
    }
  },
  methods: {
    login() {
      this.$axios.post('/api/login', {
        userId: this.userId,
        password: this.password,
      }).then(result => {
        this.$store.commit('account/login', result.data)
        this.$router.push("/")
      }).catch(error => {
        this.password = '';
        this.errorStatus = false;
        this.errorMessage = error.response.status === 401 ? '아이디 또는 비밀번호를 확인해주세요.' : '잠시 후 다시 시도해주세요.'
      });
    }
  }
}
</script>

<style scoped>

</style>
