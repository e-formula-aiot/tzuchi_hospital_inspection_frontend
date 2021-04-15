<template>
  <div>
    <snackbar v-model="snackbarData" />

    <v-card>
      <v-card-title>
        <span>巡檢分類管理</span>
        <v-spacer />
        <v-btn text icon @click="onDialogAddOpen()">
          <v-icon large color="orange accent-3">
            mdi-plus-circle
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-select
              :items="selectOrgItem"
              label="院區"
              item-value="_id"
              item-text="name"
              v-model="selectOrgItemValue"
              @change="onChangeOrg(selectOrgItemValue)"
            />
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
      <v-form ref="Form">
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
                />
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="DialogData.category_name"
                  label="分類名稱"
                  required
                  :rules="[(v) => !!v || '*必需輸入']"
                  @input="$v.DialogData.category_name.$touch()"
                  @blur="$v.DialogData.category_name.$touch()"
                />
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="DialogData.subcategory_name"
                  label="子分類"
                />
              </v-col>

              <v-card-title>
                <span>分類人員管理</span>
              </v-card-title>

              <v-card-text>
                <span>當前管理人員</span>
                <v-data-table
                  v-if="Mode === 'edit'"
                  fixed-header
                  dense
                  :headers="headersCategoryUser"
                  :items="dataTableCategoryUser"
                  item-key="_id"
                  :search="searchCategoryUser"
                  :items-per-page="25"
                  :footer-props="{
                    'items-per-page-options': [25, 50, 100],
                  }"
                  class="elevation-1"
                >
                  <template v-slot:item.is_power_user="{ item }">
                    {{ item.is_power_user === 1 ? '是' : '否' }}
                  </template>
                  <template v-slot:item.actionCategoryUser="{ item }">
                    <v-icon small @click="deleteCategoryUsersById(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
                <br />
                <span>其他人員</span>
                <v-data-table
                  v-if="Mode === 'edit'"
                  fixed-header
                  dense
                  :headers="headersCategoryUser"
                  :items="dataTableCategoryUserInverse"
                  item-key="_id"
                  :search="searchCategoryUser"
                  :items-per-page="25"
                  :footer-props="{
                    'items-per-page-options': [25, 50, 100],
                  }"
                  class="elevation-1"
                >
                  <template v-slot:item.is_power_user="{ item }">
                    {{ item.is_power_user === 1 ? '是' : '否' }}
                  </template>
                  <template v-slot:item.actionCategoryUser="{ item }">
                    <v-icon small @click="postCategoryUsersByIdInvers(item)">
                      mdi-plus
                    </v-icon>
                  </template>
                </v-data-table>
              </v-card-text>
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
              @click="putCategoryById"
              v-if="Mode === 'edit'"
            >
              送出
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="postCategory"
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
      :content="'確定刪除?'"
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
      category_name: { required },
    },
  },
  name: 'taskMag',
  data() {
    return {
      snackbarData: undefined,
      visibleConfirmation: false,
      selectOrgItem: [],
      selectOrgItemValue: 0,
      SelectDialogOrgItem: [],
      SelectDialogOrgItemValue: 0,
      search: '',
      headers: [
        { text: 'ID', value: '_id', width: '65px' },
        { text: '分院名稱', value: 'category_name' },
        { text: '子分類', value: 'subcategory_name' },
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
      searchCategoryUser: '',
      headersCategoryUser: [
        { text: 'ID', value: '_id', width: '65px' },
        { text: '工號', value: 'employee_id', width: '75px' },
        { text: '姓名', value: 'user_name', width: '75px' },
        { text: '稱謂', value: 'user_title', width: '75px' },
        { text: 'Email', value: 'email', width: '130px' },
        { text: '管理員', value: 'is_power_user', width: '90px' },
        { text: '紀錄人員所屬部門', value: 'department_name', width: '150px' },
        {
          text: '',
          align: 'center',
          value: 'actionCategoryUser',
          sortable: false,
          // width: '80px',
        },
      ],
      dataTableCategoryUser: [],
      dataTableCategoryUserInverse: [],
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
          this.getCategoryByOrganisationId(this.selectOrgItemValue);
          this.getCategoryByOrganisationIdDialog(this.SelectDialogOrgItemValue);
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    getCategoryByOrganisationId(id) {
      backendService
        .getCategoryByOrganisationId(id)
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
    getCategoryByOrganisationIdDialog() {
      backendService
        .getOrg()
        .then((response) => {
          this.SelectDialogOrgItem = [];

          response.data.forEach((element, index) => {
            if (index === 0 && this.Mode !== 'edit') {
              this.SelectDialogOrgItemValue = element._id;
            }

            if (
              this.SelectDialogOrgItem.findIndex((x) => {
                return x.name === element.organisation_name;
              }) === -1
            ) {
              this.SelectDialogOrgItem.push({
                _id: element._id,
                name: element.organisation_name,
              });
            }
          });
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    getCategoryById(id) {
      backendService
        .getCategoryById(id)
        .then((response) => {
          this.DialogData = response.data;

          this.getCategoryByOrganisationIdDialog(response.data.organisation_id);

          this.SelectDialogOrgItemValue = response.data.organisation_id;

          this.getCategoryUsersById(response.data._id);
          this.getCategoryUsersByIdInvers(response.data._id);
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    getCategoryUsersById(id) {
      backendService
        .getCategoryUsersById(id)
        .then((response) => {
          this.dataTableCategoryUser = response.data;
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    getCategoryUsersByIdInvers(id) {
      backendService
        .getCategoryUsersByIdInvers(id)
        .then((response) => {
          this.dataTableCategoryUserInverse = response.data;
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    postCategoryUsersByIdInvers(item) {
      backendService
        .postCategoryUsersByIdInvers(this.DialogData._id, item._id)
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
    deleteCategoryUsersById(item) {
      backendService
        .deleteCategoryUsersById(this.DialogData._id, item._id)
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
    postCategory() {
      if (this.$refs.Form.validate()) {
        const postData = {
          organisation_id: this.SelectDialogOrgItemValue,
          category_name: this.DialogData.category_name,
          subcategory_name: this.DialogData.subcategory_name,
        };

        backendService
          .postCategory(postData)
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
    putCategoryById() {
      if (this.$refs.Form.validate()) {
        const postData = {
          organisation_id: this.SelectDialogOrgItemValue,
          category_name: this.DialogData.category_name,
          subcategory_name: this.DialogData.subcategory_name,
        };

        backendService
          .putCategoryById(this.DialogData._id, postData)
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
    deleteCategoryById(id) {
      backendService
        .deleteCategoryById(id)
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
      this.DialogTitle = '修改巡檢分類';
      this.Mode = 'edit';
      this.getCategoryById(item._id);
      this.Dialog = true;
    },
    onDialogAddOpen() {
      this.DialogTitle = '新增巡檢分類';
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
      this.deleteCategoryById(this.DialogData._id);
      this.visibleConfirmation = false;
    },
    onChangeOrg(id) {
      this.getCategoryByOrganisationId(id);
    },
  },
};
</script>

<style></style>
