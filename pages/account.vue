<template>
  <div>
    <snackbar v-model="snackbarData" />

    <v-card>
      <v-card-title>
        <span>人員管理</span>
        <v-spacer />
        <v-btn text icon @click="onDialogAddOpen()">
          <v-icon large color="orange accent-3">
            mdi-plus-circle
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="5" sm="6">
            <v-select
              :items="selectOrgItem"
              label="院區"
              item-value="_id"
              item-text="name"
              v-model="selectOrgItemValue"
              @change="onChangeOrg(selectOrgItemValue)"
            />
          </v-col>
          <v-col cols="12" md="5" sm="6">
            <v-select
              :items="selectDeptItem"
              label="部門"
              item-value="_id"
              item-text="name"
              v-model="selectDeptItemValue"
            />
          </v-col>
          <v-col cols="12" md="1" sm="1">
            <v-btn rounded color="primary" @click="getUserByDeptId">
              查詢
            </v-btn>
          </v-col>
        </v-row>

        <v-data-table
          fixed-header
          dense
          :headers="headers"
          :items="dataTable"
          item-key="_id"
          :search="search"
          :items-per-page="25"
          :footer-props="{
            'items-per-page-options': [25, 50, 100],
          }"
          class="elevation-1"
        >
          <template v-slot:item.is_power_user="{ item }">
            {{ item.is_power_user === 1 ? '是' : '否' }}
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click="onDialogEditOpen(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="onDeleteConfirmationVisible(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-Dialog v-model="Dialog" persistent max-width="800px">
      <v-form ref="userForm">
        <v-card>
          <v-card-title>
            <span class="headline">{{ DialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" sm="6">
                <v-select
                  :items="SelectDialogOrgItem"
                  label="院區"
                  item-value="_id"
                  item-text="name"
                  v-model="SelectDialogOrgItemValue"
                  @change="onChangeDialogOrg(SelectDialogOrgItemValue)"
                />
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-select
                  :items="SelectDialogDepItem"
                  label="部門"
                  item-value="_id"
                  item-text="name"
                  v-model="SelectDialogDepItemValue"
                />
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="DialogData.employee_id"
                  label="工號"
                  required
                  :rules="[(v) => !!v || '*必需輸入']"
                  @input="$v.DialogData.employee_id.$touch()"
                  @blur="$v.DialogData.employee_id.$touch()"
                />
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="DialogData.user_name"
                  label="姓名"
                  required
                  :rules="[(v) => !!v || '*必需輸入']"
                  @input="$v.DialogData.user_name.$touch()"
                  @blur="$v.DialogData.user_name.$touch()"
                />
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="DialogData.user_title"
                  label="稱謂"
                  required
                  :rules="[(v) => !!v || '*必需輸入']"
                  @input="$v.DialogData.user_title.$touch()"
                  @blur="$v.DialogData.user_title.$touch()"
                />
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="DialogData.email"
                  label="Email"
                  required
                  :rules="[(v) => !!v || '*必需輸入']"
                  @input="$v.DialogData.email.$touch()"
                  @blur="$v.DialogData.email.$touch()"
                />
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-switch v-model="SwitchIsPowerUser" label="管理者" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="onDialogClose">
              關閉
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="putUserById"
              v-if="Mode === 'edit'"
            >
              送出
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="postUser"
              v-else-if="Mode === 'add'"
            >
              新增
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-Dialog>

    <confirmation
      :visible.sync="visibleConfirmation"
      :content="'確定刪除此使用者?'"
      @no-click="onDeleteConfirmationNoClick"
      @yes-click="onDeleteConfirmationYesClick"
    />
  </div>
</template>

<script>
import backendService from '@/services/backendService';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import confirmation from '@/components/confirmation.vue';

export default {
  mixins: [validationMixin],
  validations: {
    DialogData: {
      employee_id: { required },
      user_name: { required },
      user_title: { required },
      email: { required },
    },
  },
  name: 'account',
  data() {
    return {
      snackbarData: undefined,
      visibleConfirmation: false,
      selectOrgItem: [],
      selectOrgItemValue: 0,
      selectDeptItem: [],
      selectDeptItemValue: 0,
      SelectDialogOrgItem: [],
      SelectDialogOrgItemValue: 0,
      SelectDialogDepItem: [],
      SelectDialogDepItemValue: 0,
      SwitchIsPowerUser: 0,
      search: '',
      headers: [
        { text: 'ID', value: '_id', width: '65px' },
        { text: '工號', value: 'employee_id', width: '75px' },
        { text: '姓名', value: 'user_name', width: '75px' },
        { text: '稱謂', value: 'user_title', width: '75px' },
        { text: 'Email', value: 'email', width: '110px' },
        { text: '管理員', value: 'is_power_user', width: '90px' },
        { text: '紀錄人員所屬部門', value: 'department_name', width: '150px' },
        { text: '紀錄 Line ID', value: 'line_usernames', width: '450px' },
        {
          text: '',
          align: 'center',
          value: 'action',
          sortable: false,
          width: '80px',
        },
      ],
      dataTable: [],
      Dialog: false,
      DialogTitle: '',
      DialogData: {},
      Mode: 'view',
    };
  },
  mounted() {
    this.getOrg();
  },
  created() {},
  components: {
    confirmation,
  },
  methods: {
    getOrg() {
      backendService
        .getOrg()
        .then((response) => {
          this.selectOrgItem = [];
          this.SelectDialogOrgItem = [];

          response.data.forEach((element, index) => {
            if (index === 0) {
              this.selectOrgItemValue = element._id;
              this.SelectDialogOrgItemValue = element._id;
            }

            if (
              this.selectOrgItem.findIndex((x) => {
                return x.name === element.organisation_name;
              }) === -1
            ) {
              this.selectOrgItem.push({
                _id: element._id,
                name: element.organisation_name,
              });

              this.SelectDialogOrgItem.push({
                _id: element._id,
                name: element.organisation_name,
              });
            }
          });
          this.getDeptByOrganisationId(this.selectOrgItemValue);
          this.getDeptByOrganisationIdDialog(this.SelectDialogOrgItemValue);
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    getDeptByOrganisationId(id) {
      backendService
        .getDeptByOrganisationId(id)
        .then((response) => {
          this.deptDataTable = response.data;

          this.selectDeptItem = [];

          response.data.forEach((element, index) => {
            if (index === 0) {
              this.selectDeptItemValue = element._id;
            }

            if (
              this.selectDeptItem.findIndex((x) => {
                return x.name === element.department_name;
              }) === -1
            ) {
              this.selectDeptItem.push({
                _id: element._id,
                name: element.department_name,
              });
            }
          });

          this.getUserByDeptId();
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    getDeptByOrganisationIdDialog(id) {
      backendService
        .getDeptByOrganisationId(id)
        .then((response) => {
          this.deptDataTable = response.data;

          this.SelectDialogDepItem = [];

          response.data.forEach((element, index) => {
            if (index === 0 && this.Mode !== 'edit') {
              this.SelectDialogDepItemValue = element._id;
            }

            if (
              this.SelectDialogDepItem.findIndex((x) => {
                return x.name === element.department_name;
              }) === -1
            ) {
              this.SelectDialogDepItem.push({
                _id: element._id,
                name: element.department_name,
              });
            }
          });

          // this.getUserByDeptId();  //取得綁定line
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    getUserByDeptId() {
      backendService
        .getUserByDeptId(this.selectDeptItemValue)
        .then((response) => {
          this.dataTable = response.data;
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    getUserById(id) {
      backendService
        .getUserById(id)
        .then((response) => {
          this.DialogData = response.data;

          this.getDeptByOrganisationIdDialog(response.data.organisation_id);

          this.SelectDialogOrgItemValue = response.data.organisation_id;
          this.SelectDialogDepItemValue = response.data.department_id;
          this.SwitchIsPowerUser = response.data.is_power_user;
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    postUser() {
      if (this.$refs.userForm.validate()) {
        const postData = {
          department_id: this.SelectDialogDepItemValue,
          employee_id: this.DialogData.employee_id,
          user_name: this.DialogData.user_name,
          user_title: this.DialogData.user_title,
          email: this.DialogData.email,
          is_power_user: this.SwitchIsPowerUser === true ? 1 : 0,
        };

        backendService
          .postUser(postData)
          .then((response) => {
            this.getOrg();
            this.Dialog = false;
          })
          .catch((error) => {
            this.snackbarData = {
              snackbar: true,
              snackbar_msg: error.response.data.msg,
            };
          });
      }
    },
    putUserById() {
      if (this.$refs.userForm.validate()) {
        const postData = {
          department_id: this.SelectDialogDepItemValue,
          employee_id: this.DialogData.employee_id,
          user_name: this.DialogData.user_name,
          user_title: this.DialogData.user_title,
          email: this.DialogData.email,
          is_power_user: this.SwitchIsPowerUser === true ? 1 : 0,
        };

        backendService
          .putUserById(this.DialogData._id, postData)
          .then((response) => {
            this.getOrg();
            this.Dialog = false;
          })
          .catch((error) => {
            this.snackbarData = {
              snackbar: true,
              snackbar_msg: error.response.data.msg,
            };
          });
      }
    },
    deleteUserById(id) {
      backendService
        .deleteUserById(id)
        .then((response) => {
          this.getOrg();
          this.Dialog = false;
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    onDialogEditOpen(item) {
      this.DialogTitle = '修改人員';
      this.Mode = 'edit';
      this.getUserById(item._id);
      this.Dialog = true;
    },
    onDialogAddOpen() {
      this.DialogTitle = '新增人員';
      this.Mode = 'add';
      this.DialogData = {};
      this.Dialog = true;
    },
    onDialogClose() {
      this.Dialog = false;
    },
    onDeleteConfirmationVisible(item) {
      this.DialogData._id = item._id;
      this.visibleConfirmation = true;
    },
    onDeleteConfirmationNoClick() {
      this.visibleConfirmation = false;
    },
    onDeleteConfirmationYesClick() {
      this.deleteUserById(this.DialogData._id);
      this.visibleConfirmation = false;
    },
    onChangeOrg(id) {
      this.getDeptByOrganisationId(id);
    },
    onChangeDialogOrg(id) {
      this.getDeptByOrganisationIdDialog(id);
    },
  },
};
</script>

<style></style>
