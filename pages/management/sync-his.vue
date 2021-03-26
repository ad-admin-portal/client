<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm>
          <CRow>
            <CCol md="2">
              <CInput
                type="date" v-model="searchStDt"
                :max="searchEndDt"
                @change="getSyncData"
              />
            </CCol>
            -
            <CCol md="2">
              <CInput
                type="date" v-model="searchEndDt"
                :min="searchStDt"
                :max="new Date().toJSON().slice(0, 10)"
                @change="getSyncData"
              />
            </CCol>

          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardBody>
        <CDataTable
          :items="syncHistory"
          :fields="fields"
          items-per-page-select
          :items-per-page="10"
          hover
          sorter
          pagination
          table-filter
          cleaner
          >
          <template #details="{ item }">
            <CCollapse :show="Boolean(item._toggled)">

            </CCollapse>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        syncHistory: [],
        fields: [
          {key: "syncDate", label: "동기화날짜"},
          {key: "userId", label: "id"},
          {key: "userName", label: "이름"},
          {key: "userInfo", label: "동기화정보"},
          {key: "successYn", label: "성공/실패"}
        ],
        searchStDt: "",
        searchEndDt: ""
      };
    },
    created() {

      this.searchEndDt = new Date().toJSON().slice(0, 10);
      this.searchStDt = new Date(new Date().setMonth(new Date().getMonth() - 1)).toJSON().slice(0, 10);

      this.getSyncData();
    },
    methods: {

      getSyncData(){
        this.$axios.post("/api/management/syncHistory", {
          searchEndDt: this.searchEndDt
          , searchStDt: this.searchStDt
        }).then((response) => {
          if (response.status === 200) {
            this.syncHistory = response.data.map((syncHistory) => {

              return Object.assign({}, syncHistory)
            })
          }
        });
      }
    }
  }
</script>
