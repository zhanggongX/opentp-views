<!-- components/FormModal.vue -->
<template>
  <a-modal
    :visible="visible"
    title="Application Edit"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <a-form :model="form">
      <a-form-item field="name" :label="$t('application.edit.showName')">
        <a-input v-model="form.showName" />
      </a-form-item>
      <a-form-item field="name" label="appName" size="small">
        <a-input v-model="form.appName" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, reactive } from 'vue';

  // 定义 props
  const props = defineProps<{
    visible: boolean;
  }>();

  // 定义 emits
  const emit = defineEmits<{
    (event: 'update:visible', value: boolean): void;
    (event: 'submit', formData: { showName: string; appName: string }): void;
  }>();

  // 表单数据
  const form = reactive({
    showName: '',
    appName: '',
  });

  // 处理确认按钮逻辑
  const handleBeforeOk = (done: (result?: boolean) => void) => {
    // console.log('Submitting form:', form);
    setTimeout(() => {
      emit('submit', { ...form }); // 触发提交事件
      done(); // 关闭弹窗
    }, 1000);
  };

  // 处理取消事件
  const handleCancel = () => {
    emit('update:visible', false);
  };
</script>
