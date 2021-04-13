<template>
  <v-dialog
    @update:visible="$emit('update:visible', $event)"
    v-model="visible"
    persistent
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline" />

      <v-card-text> {{ content }}</v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="green darken-1" text @click="$emit('no-click')">
          取消
        </v-btn>
        <v-btn color="green darken-1" text @click="$emit('yes-click')">
          確定
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'confirmation',
  props: {
    visible: {
      default: false,
    },
    content: {
      default: '',
    },
  },
};
</script>
