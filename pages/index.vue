<template>
  <v-row justify="center" align="center">
    <v-card>
      <v-col>
        <div class="text-center">
          <img class="myLogo" :src="`${$nuxt.context.env.baseUrl}/logo.png`" />
        </div>
        <div justify="center" align="center">
          <v-card-title class="headline">
            <v-col cols="12">
              <span class="card-title"> 慈濟巡檢後台管理系統 </span>
            </v-col>
          </v-card-title>
          <form>
            <v-text-field
              v-model="employee_id"
              append-icon="mdi-username-tie"
              :error-messages="accountErrors"
              label="工號"
              placeholder="*必須輸入"
              required
              @input="$v.employee_id.$touch()"
              @blur="$v.employee_id.$touch()"
            />
            <v-text-field
              v-model="password"
              :error-messages="pwdErrors"
              label="密碼"
              placeholder="*必須輸入"
              required
              :type="showPwd ? 'text' : 'password'"
              :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              @click:append="showPwd = !showPwd"
            />

            <v-btn @click="clear">
              清除
            </v-btn>
            <!-- <v-spacer /> -->
            <v-btn color="primary" @click="onSubmit">
              登入
            </v-btn>
          </form>
        </div>
      </v-col>
    </v-card>
  </v-row>
</template>

<script>
import backendService from '@/services/backendService';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
const Cookie = process.client ? require('js-cookie') : undefined;

export default {
  name: 'Index',
  mixins: [validationMixin],
  validations: {
    employee_id: { required },
    password: { required },
  },
  data() {
    return {
      employee_id: '',
      password: '',
      showPwd: false,
    };
  },
  computed: {
    accountErrors() {
      const errors = [];
      if (!this.$v.employee_id.$dirty) {
        return errors;
      }

      !this.$v.employee_id.required && errors.push('*必須輸入');
      return errors;
    },
    pwdErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) {
        return errors;
      }

      !this.$v.password.required && errors.push('*必須輸入');
      return errors;
    },
  },
  created() {
    // Cookie.set('username', 'family');
  },
  methods: {
    onSubmit() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        const postData = {
          employee_id: this.employee_id,
          password: this.password,
        };

        backendService
          .postAuthLogin(postData)
          .then((response) => {
            Cookie.set('access_token', response.data.access_token);
            Cookie.set('user_id', response.data.user_id);
            this.getWhoAmI(response.data.user_id);
          })
          .catch((error) => {
            console.log(error.response.data.msg);
          });
      }
    },
    getWhoAmI(UserId) {
      backendService
        .getWhoAmI(UserId)
        .then((response) => {
          Cookie.set('username', response.data.user_name);
          this.$router.push('/task');
        })
        .catch((error) => {
          console.log(error.response.data.msg);
        });
    },
    clear() {
      this.$v.$reset();
      this.employee_id = '';
      this.password = '';
    },
  },
};
</script>

<style>
.myLogo {
  width: 180px;
  transform: rotateY(560deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}

.card-title {
  color: #2589bd !important;
  font-weight: bold;
  font-family: 微軟正黑體;
  font-size: 25px;
  width: 100%;
  min-height: 30px;
}
</style>
