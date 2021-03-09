<template>
  <div>
    <v-data-table
      fixed-header
      dense
      :headers="headers"
      :items="this.value"
      item-key="_id"
      :search="search"
      :items-per-page="25"
      :footer-props="{
        'items-per-page-options': [25, 50, 100],
      }"
      class="elevation-1"
    >
      <template v-slot:item.inspection_status="{ item }">
        {{ item.inspection_status === 0 ? 'NG' : 'OK' }}
      </template>
      <template v-slot:item.recovery_status="{ item }">
        {{ item.recovery_status === 0 ? 'NG' : 'OK' }}
      </template>

      <template v-slot:item.inspection_time="{ item }">
        {{
          $moment(item.inspection_time)
            .local()
            .format('YYYY-MM-DD HH:mm:ss')
        }}
      </template>
      <template v-slot:item.recovery_time="{ item }">
        <div v-if="item.recovery_time !== null">
          {{
            $moment(item.recovery_time)
              .local()
              .format('YYYY-MM-DD HH:mm:ss')
          }}
        </div>
        <div v-else>{{ item.recovery_time }}</div>
      </template>
      <template v-slot:item.audit_time="{ item }">
        <div v-if="item.audit_time !== null">
          {{
            $moment(item.audit_time)
              .local()
              .format('YYYY-MM-DD HH:mm:ss')
          }}
        </div>
        <div v-else>{{ item.audit_time }}</div>
      </template>

      <template v-slot:item.inspection_image_path="{ item }">
        <img
          :src="item.inspection_image_path"
          style="width: 50px; height:50px"
          @click="onClickImageShow(item.inspection_image_path)"
        />
      </template>
      <template v-slot:item.recovery_image_path="{ item }">
        <img
          :src="item.recovery_image_path"
          style="width: 50px; height:50px"
          @click="onClickImageShow(item.recovery_image_path)"
        />
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon class="mr-2" @click="onClickAuditTask(item)">
          mdi-check-box-multiple-outline
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialogImg"
      max-width="1000px"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title>
          <v-spacer />
          <v-btn icon @click="dialogImg = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <img :src="dialogImagePath" style="width: 100%;" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAudit" max-width="500px">
      <v-card>
        <v-card-title>請確認</v-card-title>
        <v-card-text>
          <v-container>確定執行稽核？</v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="dialogAudit = false">
            取消
          </v-btn>
          <v-btn color="blue darken-1" text @click="onClickAuditSave()">
            確認
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import backendService from '@/services/backendService';

export default {
  name: 'aberrantInfo',
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      search: '',
      headers: [
        { text: '院區名稱', value: 'organisation_name', width: '220px' },
        { text: '檢查地點名稱', value: 'site_name', width: '130px' },
        // { text: 'category_name', value: 'category_name' },
        // { text: 'subcategory_name', value: 'subcategory_name' },
        { text: '巡檢工作單名稱', value: 'inspection_name', width: '140px' },
        { text: '檢查項目所屬名目', value: 'item_type', width: '150px' },
        { text: '檢查項目問題', value: 'item_question', width: '130px' },
        { text: '巡檢狀態', value: 'inspection_status', width: '110px' },
        {
          text: '巡檢詳細說明文字',
          value: 'inspection_description',
          width: '160px',
        },
        { text: '巡檢照片', value: 'inspection_image_path', width: '100px' },
        { text: '巡檢時間', value: 'inspection_time', width: '170px' },
        { text: '巡檢執行人員', value: 'inspection_user_name', width: '130px' },
        { text: '修復狀態', value: 'recovery_status', width: '100px' },
        {
          text: '修復詳細說明文字',
          value: 'recovery_description',
          width: '150px',
        },
        { text: '修復照片', value: 'recovery_image_path', width: '100px' },
        { text: '修復時間', value: 'recovery_time', width: '170px' },
        { text: '修復執行人員', value: 'recovery_user_name', width: '130px' },
        { text: '稽核時間', value: 'audit_time', width: '170px' },
        { text: '稽核執行人員', value: 'audit_user_name', width: '130px' },
        {
          text: '',
          align: 'center',
          value: 'action',
          sortable: false,
        },
      ],
      dialogAudit: false,
      dialogImg: false,
      dialogImagePath: null,
      inspectionHistoryId: null,
    };
  },
  mounted() {},
  created() {},
  methods: {
    onClickAuditTask(data) {
      this.inspectionHistoryId = data._id;
      this.dialogAudit = true;
    },

    onClickAuditSave() {
      backendService
        .putWebAudit(this.inspectionHistoryId)
        .then((response) => {
          this.dialogAudit = false;
          this.$router.go();
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    onClickImageShow(path) {
      this.dialogImg = true;
      this.dialogImagePath = path;
    },
  },
};
</script>
