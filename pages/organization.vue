<template>
  <div>
    <snackbar v-model="snackbarData" />

    <v-card>
      <v-card-title>
        <span>分院管理</span>
        <v-spacer />
        <v-icon @click="onDialogAddOpen()">
          mdi-plus-circle
        </v-icon>
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
            <v-icon small class="mr-2" @click="onDialogEditOpen(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteOrgById(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-Dialog v-model="orgDialog" persistent max-width="600px">
      <v-form ref="form">
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
  </div>
</template>

<script>
import backendService from '@/services/backendService';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  validations: {
    orgDialogData: {
      organisation_name: { required },
    },
  },
  name: 'organization',
  data() {
    return {
      snackbarData: undefined,
      orgSearch: '',
      orgHeaders: [
        { text: 'ID', value: '_id' },
        { text: '分院名稱', value: 'organisation_name' },
        {
          text: '',
          align: 'center',
          value: 'action',
          sortable: false,
          width: '350px',
        },
      ],
      orgDataTable: [],
      orgDialog: false,
      orgDialogTitle: '',
      orgDialogData: {},
      // orgDialogData: {
      //   _id: null,
      //   organisation_name: null,
      // },
      organizationMode: 'view',
    };
  },
  mounted() {
    this.getOrg();
  },
  created() {},
  components: {},
  methods: {
    getOrg() {
      backendService
        .getOrg()
        .then((response) => {
          this.orgDataTable = response.data;
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
      if (this.$refs.form.validate()) {
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
            console.log(error.response.data.msg);
          });
      }
    },
    putOrgById() {
      if (this.$refs.form.validate()) {
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
            console.log(error.response.data.msg);
          });
      }
    },
    deleteOrgById(item) {
      backendService
        .deleteOrgById(item._id)
        .then((response) => {
          this.getOrg();
          this.orgDialog = false;
        })
        .catch((error) => {
          console.log(error.response.data.msg);
        });
    },
    onDialogEditOpen(item) {
      this.orgDialogTitle = '修改分院';
      this.organizationMode = 'edit';
      this.getOrgById(item._id);
      this.orgDialog = true;
    },
    onDialogAddOpen() {
      this.orgDialogTitle = '新增分院';
      this.organizationMode = 'add';
      this.orgDialogData = {};
      this.orgDialog = true;
    },
    onDialogClose() {
      this.orgDialog = false;
    },
  },
};
</script>

<style></style>
