<template>
  <v-snackbar
    v-model="value.snackbar"
    color="red darken-1"
    text
    :timeout="snackbar_timeout"
    top
    right
  >
    {{ value.snackbar_msg }}
  </v-snackbar>
</template>

<script>
export default {
  name: 'snackbar',
  props: {
    value: {
      type: Object,
      default() {
        return {
          snackbar: null,

          snackbar_msg: null,
        };
      },
    },
  },
  data() {
    return {
      snackbar_timeout: 1500,
    };
  },
};
</script>
