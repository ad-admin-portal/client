export default function ({ $axios, redirect, store }) {
  $axios.onRequest(config => {
    config.headers.common['X-AUTH-TOKEN'] = '' + sessionStorage.getItem('token');
  });

  // $axios.onError(error => {
  //   if ( error.response.status === 403 ) {
  //     alert("다시 로그인 해주세요.");
  //     store.commit('account/logout')
  //     redirect('/login')
  //   }
  // });
}
