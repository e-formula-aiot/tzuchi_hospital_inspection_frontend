<template>
  <div>
    <snackbar v-model="snackbarData" />

    <v-card>
      <v-card-title>
        <span>分院管理</span>
        <v-spacer />
        <v-btn text icon @click="onDialogAddOrgOpen()">
          <v-icon large color="orange accent-3">
            mdi-plus-circle
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          fixed-header
          dense
          :headers="orgHeaders"
          :items="orgDataTable"
          item-key="_id"
          :search="orgSearch"
          :items-per-page="25"
          :footer-props="{
            'items-per-page-options': [25, 50, 100],
          }"
          class="elevation-1"
        >
          <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click="onDialogEditOrgOpen(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="onOrgDeleteConfirmationVisible(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-card class="mt-3">
      <v-card-title>
        <span>部門管理</span>
        <v-spacer />
        <v-btn text icon @click="onDialogAddDeptOpen()">
          <v-icon large color="orange accent-3">
            mdi-plus-circle
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-select
          :items="selectOrgItem"
          label="院區"
          item-value="_id"
          item-text="name"
          v-model="selectOrgItemValue"
          @change="onChangeOrg(selectOrgItemValue)"
        />

        <v-data-table
          fixed-header
          dense
          :headers="deptHeaders"
          :items="deptDataTable"
          item-key="_id"
          :search="deptSearch"
          :items-per-page="25"
          :footer-props="{
            'items-per-page-options': [25, 50, 100],
          }"
          class="elevation-1"
        >
          <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click="onDialogEditDeptOpen(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="onDeptDeleteConfirmationVisible(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-Dialog v-model="orgDialog" persistent max-width="600px">
      <v-form ref="orgForm">
        <v-card>
          <v-card-title>
            <span class="headline">{{ orgDialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="orgDialogData.organisation_name"
                  label="分院名稱"
                  required
                  :rules="[(v) => !!v || '*必需輸入']"
                  @input="$v.orgDialogData.organisation_name.$touch()"
                  @blur="$v.orgDialogData.organisation_name.$touch()"
                />
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
              @click="putOrgById"
              v-if="organizationMode === 'edit'"
            >
              送出
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="postOrg"
              v-else-if="organizationMode === 'add'"
            >
              新增
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-Dialog>

    <v-Dialog v-model="deptDialog" persistent max-width="600px">
      <v-form ref="deptForm">
        <v-card>
          <v-card-title>
            <span class="headline">{{ deptDialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-select
                  :items="SelectDeptDialogItem"
                  label="院區"
                  item-value="_id"
                  item-text="name"
                  v-model="SelectDeptDialogItemValue"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="deptDialogData.department_name"
                  label="部門名稱"
                  required
                  :rules="[(v) => !!v || '*必需輸入']"
                  @input="$v.deptDialogData.department_name.$touch()"
                  @blur="$v.deptDialogData.department_name.$touch()"
                />
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
              @click="putDeptById"
              v-if="deptMode === 'edit'"
            >
              送出
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="postDept"
              v-else-if="deptMode === 'add'"
            >
              新增
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-Dialog>

    <confirmation
      :visible.sync="visibleOrgConfirmation"
      :content="'確定刪除此分院?'"
      @no-click="onOrgDeleteConfirmationNoClick"
      @yes-click="onOrgDeleteConfirmationYesClick"
    />
    <confirmation
      :visible.sync="visibleDeptConfirmation"
      :content="'確定刪除此部門?'"
      @no-click="onDeptDeleteConfirmationNoClick"
      @yes-click="onDeptDeleteConfirmationYesClick"
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
    orgDialogData: {
      organisation_name: { required },
    },
    deptDialogData: {
      department_name: { required },
    },
  },
  name: 'organization',
  data() {
    return {
      snackbarData: undefined,
      visibleOrgConfirmation: false,
      selectOrgItem: [],
      selectOrgItemValue: 0,
      orgSearch: '',
      orgHeaders: [
        { text: 'ID', value: '_id' },
        { text: '分院名稱', value: 'organisation_name' },
        {
          text: '',
          align: 'center',
          value: 'action',
          sortable: false,
          // width: '350px',
        },
      ],
      orgDataTable: [],
      orgDialog: false,
      orgDialogTitle: '',
      orgDialogData: {},
      organizationMode: 'view',
      visibleDeptConfirmation: false,
      SelectDeptDialogItem: [],
      SelectDeptDialogItemValue: 0,
      deptSearch: '',
      deptHeaders: [
        { text: 'ID', value: '_id' },
        { text: '分院ID', value: 'organisation_id' },
        { text: '部門名稱', value: 'department_name' },
        {
          text: '',
          align: 'center',
          value: 'action',
          sortable: false,
          // width: '350px',
        },
      ],
      deptDataTable: [],
      deptDialog: false,
      deptDialogTitle: '',
      deptDialogData: {},
      deptMode: 'view',
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
          this.orgDataTable = response.data;
          this.selectOrgItem = [];
          this.SelectDeptDialogItem = [];

          response.data.forEach((element, index) => {
            if (index === 0) {
              this.selectOrgItemValue = element._id;
              this.SelectDeptDialogItemValue = element._id;
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

              this.SelectDeptDialogItem.push({
                _id: element._id,
                name: element.organisation_name,
              });
            }
          });
          this.getDeptByOrganisationId(this.selectOrgItemValue);
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    getOrgById(id) {
      backendService
        .getOrgById(id)
        .then((response) => {
          this.orgDialogData = response.data;
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    postOrg() {
      if (this.$refs.orgForm.validate()) {
        const postData = {
          organisation_name: this.orgDialogData.organisation_name,
        };

        backendService
          .postOrg(postData)
          .then((response) => {
            this.getOrg();
            this.orgDialog = false;
          })
          .catch((error) => {
            this.snackbarData = {
              snackbar: true,
              snackbar_msg: error.response.data.msg,
            };
          });
      }
    },
    putOrgById() {
      if (this.$refs.orgForm.validate()) {
        const postData = {
          organisation_name: this.orgDialogData.organisation_name,
        };

        backendService
          .putOrgById(this.orgDialogData._id, postData)
          .then((response) => {
            this.getOrg();
            this.orgDialog = false;
          })
          .catch((error) => {
            this.snackbarData = {
              snackbar: true,
              snackbar_msg: error.response.data.msg,
            };
          });
      }
    },
    deleteOrgById(id) {
      backendService
        .deleteOrgById(id)
        .then((response) => {
          this.getOrg();
          this.orgDialog = false;
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    onDialogEditOrgOpen(item) {
      this.orgDialogTitle = '修改分院';
      this.organizationMode = 'edit';
      this.getOrgById(item._id);
      this.orgDialog = true;
    },
    onDialogAddOrgOpen() {
      this.orgDialogTitle = '新增分院';
      this.organizationMode = 'add';
      this.orgDialogData = {};
      this.orgDialog = true;
    },
    onChangeOrg(id) {
      this.getDeptByOrganisationId(id);
    },
    onOrgDeleteConfirmationVisible(item) {
      this.orgDialogData._id = item._id;
      this.visibleOrgConfirmation = true;
    },
    onOrgDeleteConfirmationNoClick() {
      this.visibleOrgConfirmation = false;
    },
    onOrgDeleteConfirmationYesClick() {
      this.deleteOrgById(this.orgDialogData._id);
      this.visibleOrgConfirmation = false;
    },
    getDeptById(id) {
      backendService
        .getDeptById(id)
        .then((response) => {
          this.deptDialogData = response.data;
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
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    postDept() {
      if (this.$refs.deptForm.validate()) {
        const postData = {
          organisation_id: this.SelectDeptDialogItemValue,
          department_name: this.deptDialogData.department_name,
        };

        backendService
          .postDept(postData)
          .then((response) => {
            this.getDeptByOrganisationId(this.selectOrgItemValue);
            this.deptDialog = false;
          })
          .catch((error) => {
            this.snackbarData = {
              snackbar: true,
              snackbar_msg: error.response.data.msg,
            };
          });
      }
    },
    putDeptById() {
      if (this.$refs.deptForm.validate()) {
        const postData = {
          organisation_id: this.SelectDeptDialogItemValue,
          department_name: this.deptDialogData.department_name,
        };

        backendService
          .putDeptById(this.deptDialogData._id, postData)
          .then((response) => {
            this.getDeptByOrganisationId(this.selectOrgItemValue);
            this.deptDialog = false;
          })
          .catch((error) => {
            this.snackbarData = {
              snackbar: true,
              snackbar_msg: error.response.data.msg,
            };
          });
      }
    },
    deleteDeptById(id) {
      backendService
        .deleteDeptById(id)
        .then((response) => {
          this.getDeptByOrganisationId(this.selectOrgItemValue);
          this.deptDialog = false;
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    onDialogEditDeptOpen(item) {
      this.deptDialogTitle = '修改部門';
      this.deptMode = 'edit';
      this.getDeptById(item._id);
      this.deptDialog = true;
    },
    onDialogAddDeptOpen() {
      this.deptDialogTitle = '新增部門';
      this.deptMode = 'add';
      this.deptDialogData = {};
      this.deptDialog = true;
    },
    onDialogClose() {
      this.orgDialog = false;
      this.deptDialog = false;
    },
    onDeptDeleteConfirmationVisible(item) {
      this.deptDialogData._id = item._id;
      this.visibleDeptConfirmation = true;
    },
    onDeptDeleteConfirmationNoClick() {
      this.visibleDeptConfirmation = false;
    },
    onDeptDeleteConfirmationYesClick() {
      this.deleteDeptById(this.deptDialogData._id);
      this.visibleDeptConfirmation = false;
    },
  },
};
</script>

<style></style>
