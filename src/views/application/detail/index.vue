<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.searchTable']" />
    <a-card class="general-card" :title="$t('menu.list.searchTable')">
      <a-row :gutter="18">
        <a-col :span="8">
          <a-form-item field="apps" :label="$t('application.select.showName')">
            <a-select
              v-model="selectedApps"
              :options="filterApps"
              :placeholder="$t('application.select.appName.placeholder')"
              :loading="loading.apps"
              :allow-clear="true"
              @change="handleAppsChange"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            field="ipAndPid"
            :label="$t('application.select.ipAndPid')"
          >
            <a-select
              v-model="selectedIpAndPid"
              :options="filterIpAndPid"
              :loading="loading.ipAndPid"
              :disabled="!selectedApps"
              :placeholder="$t('application.select.ipAndPid.placeholder')"
              :allow-clear="true"
              @change="handleIpAndPidChange"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="tpName" :label="$t('application.select.tpName')">
            <a-select
              v-model="selectedTpName"
              :options="filterTpName"
              :disabled="!selectedIpAndPid"
              :loading="loading.tpName"
              :placeholder="$t('application.select.tpName.placeholder')"
              :allow-clear="true"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />

      <DataOverview
        v-model:ip-and-pid="selectedIpAndPid"
        v-model:tp-name="selectedTpName"
      />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch, nextTick, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  import DataOverview from '@/views/application/detail/components/data-overview.vue';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import {
    queryAllApps,
    queryConnects,
    queryThreadPools,
  } from '@/api/application';
  import { Message } from '@arco-design/web-vue';

  const { t } = useI18n();

  // 选中的值
  const selectedApps = ref<string | null>(null);
  const selectedIpAndPid = ref<string | null>(null);
  const selectedTpName = ref<string | null>(null);

  // 选项数据
  const filterApps = ref<SelectOptionData[]>([]);
  const filterIpAndPid = ref<SelectOptionData[]>([]);
  const filterTpName = ref<SelectOptionData[]>([]);

  // 加载状态
  const loading = ref({
    apps: false,
    ipAndPid: false,
    tpName: false,
  });

  // 获取 Apps 数据
  const fetchAppsOptions = async () => {
    loading.value.apps = true;
    try {
      const { data } = await queryAllApps();
      const vals = data.list;
      for (let i = 0; i < vals.length; i += 1) {
        filterApps.value.push({
          label: vals[i].showName,
          value: vals[i].appKey,
        });
      }
    } catch (err) {
      Message.error('获取Apps数据失败');
    } finally {
      loading.value.apps = false;
    }
  };

  // 获取 ipAndPid 数据
  const fetchIpAndPid = async (appKey: string) => {
    loading.value.ipAndPid = true;
    try {
      const { data } = await queryConnects(appKey); // 请求后端 API
      filterIpAndPid.value = data.map((item) => ({
        label: `${item.host}-${item.pid}`, // 使用模板字符串拼接
        value: `${item.host}-${item.pid}`,
      }));
    } catch (error) {
      Message.error('获取TpAndPid失败');
    } finally {
      loading.value.ipAndPid = false;
    }
  };

  // 获取子类别
  const fetchTpNames = async (ipAndPid: string) => {
    loading.value.tpName = true;
    try {
      const { data } = await queryThreadPools(ipAndPid); // 请求后端 API
      filterTpName.value = data.map((e) => {
        return {
          label: e,
          value: e,
        };
      });
    } catch (error) {
      Message.error('获取TpAndPid失败');
    } finally {
      loading.value.tpName = false;
    }
  };

  const handleAppsChange = async () => {
    selectedIpAndPid.value = null;
    selectedTpName.value = null;
    filterIpAndPid.value = [];
    filterTpName.value = [];
    if (selectedApps.value) {
      await fetchIpAndPid(selectedApps.value);
    }
  };

  const handleIpAndPidChange = async () => {
    selectedTpName.value = null;
    filterTpName.value = [];
    if (selectedIpAndPid.value) {
      await fetchTpNames(selectedIpAndPid.value);
    }
  };

  // 组件挂载时获取类别数据
  onMounted(fetchAppsOptions);
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }

  .setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
