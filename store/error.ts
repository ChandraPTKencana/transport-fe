import { defineStore, storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { useAlertStore } from '~/store/alert';
// interface ErrorPayloadInterface {
//   email: string;
//   password: string;
// }

export const useErrorStore = defineStore('error', {
  state: () => ({
    // authenticated: false,
    // loading: false,
  }),
  actions: {

    trigger(error: any, fields = {}) {
      let errorStatusCode = error.value.statusCode;

      const { show, status, message } = storeToRefs(useAlertStore());
      const { display } = useAlertStore();

      if (error.value.data == undefined || errorStatusCode == 500 || errorStatusCode == 404) {
        display({
          show: true,
          status: "Failed",
          message: "Aplikasi mengalami kegagalan mohon di informasikan ke bagian Terkait"
        })
        return;
      }

      // 400 :	Bad Request
      // 401 :	Unauthorized
      // 403 :	Forbidden
      // 404 :	Not Found
      // 500 :	Internal Server Error
      // 503 :	Service Unavailable

      let errorMessage = error.value.data.message;

      if (errorStatusCode == 422) {
        this.setErrors(fields, error.value.data);
        return;
      }

      if (errorStatusCode == 400) {
        display({
          show: true,
          status: "Failed",
          message: errorMessage
        })
        return;
      }

      if (errorStatusCode == 401 || errorStatusCode == 403 ) {
        if(errorStatusCode == 403){
          display({
            show: true,
            status: "Failed",
            message: errorMessage
          })
        }
        useAuthStore().clearAuth();
      }

    },
    setErrors(m_fields: Record<string, any> = {}, r_fields = []) {
      for (let field in r_fields) {
        m_fields.value[field] = r_fields[field][0];
      }
    }
  },
});