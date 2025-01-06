<template>
  <a-drawer
    :width="400"
    :visible="visible"
    :mask="false"
    unmount-on-close
    @cancel="handleCancel"
  >
    <template #title> {{ $t('application.edit.title') }}</template>
    <a-form :model="form">
      <a-form-item field="showName" :label="$t('application.create.showName')">
        <a-input v-model="form.showName" />
      </a-form-item>
      <a-form-item field="appName" label="appName">
        <a-input v-model="form.appName" />
      </a-form-item>
      <a-form-item field="appKey" label="appKey" disabled>
        <a-input v-model="form.appKey" />
      </a-form-item>
      <a-form-item field="appSecret" label="appSecret" disabled>
        <a-input v-model="form.appSecret" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="handleCancel">Cancel</a-button>
      <a-button type="primary" @click="handleSubmit">Submit</a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { defineProps, defineEmits, ref, watch } from 'vue';

  const props = defineProps({
    visible: Boolean, // 控制抽屉显示
    modelValue: Object, // 传递表单数据
  });

  const emit = defineEmits(['update:visible', 'submit']);

  const form = ref({
    showName: '',
    appName: '',
    appKey: '',
    appSecret: '',
  });

  // 监听父组件传入的数据，并同步到表单
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue) {
        // form.value = { ...newValue };
        Object.assign(form.value, newValue);
      }
    },
    { deep: true, immediate: true }
  );

  // 关闭抽屉
  const handleCancel = () => {
    emit('update:visible', false);
  };

  // 提交表单数据
  const handleSubmit = () => {
    const submitData = {
      showName: form.value.showName,
      appName: form.value.appName,
      appKey: form.value.appKey,
    };
    emit('submit', submitData);
    emit('update:visible', false);
  };
</script>
