<template>
  <a-drawer
    :width="width"
    :visible="visible"
    :unmount-on-close="unmountOnClose"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <template #title>
      <slot name="title">Default Title</slot>
    </template>
    <slot></slot>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { defineProps, defineEmits, ref } from 'vue';

  const props = defineProps({
    width: { type: Number, default: 340 },
    unmountOnClose: { type: Boolean, default: true },
  });

  const visible = ref(false);

  const emit = defineEmits(['ok', 'cancel']);

  const open = () => {
    visible.value = true;
  };

  const close = () => {
    visible.value = false;
  };

  const handleOk = () => {
    emit('ok');
    close();
  };

  const handleCancel = () => {
    emit('cancel');
    close();
  };

  defineExpose({ open, close });
</script>
