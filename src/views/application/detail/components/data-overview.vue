<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card class="general-card" style="padding: 2px">
      <a-row justify="space-between">
        <a-col v-for="(item, idx) in renderData" :key="idx" :span="6">
          <a-statistic
            :title="item.title"
            :value="item.value"
            show-group-separator
            :value-from="0"
            animation
          >
            <template #prefix>
              <span
                class="statistic-prefix"
                :style="{ background: item.prefix.background }"
              >
                <component
                  :is="item.prefix.icon"
                  :style="{ color: item.prefix.iconColor }"
                />
              </span>
            </template>
          </a-statistic>
        </a-col>
      </a-row>
      <Chart style="height: 328px; margin-top: 20px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import {
    computed,
    defineProps,
    onMounted,
    onUnmounted,
    ref,
    watch,
  } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { LineSeriesOption } from 'echarts';
  import useLoading from '@/hooks/loading';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useThemes from '@/hooks/themes';
  import useChartOption from '@/hooks/chart-option';
  import { threadPoolDataOverview, ThreadPoolsData } from '@/api/application';

  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map(
        (el) => `<div class="content-panel">
        <p>
          <span style="background-color: ${
            el.color
          }" class="tooltip-item-icon"></span><span>${el.seriesName}</span>
        </p>
        <span class="tooltip-value">${el.value?.toLocaleString() ?? ''}</span>
      </div>`
      )
      .reverse()
      .join('');
  };

  // 定义 props
  const props = defineProps<{
    ipAndPid: string;
    tpName: string;
  }>();

  const generateSeries = (
    name: string,
    lineColor: string,
    itemBorderColor: string,
    data: number[]
  ): LineSeriesOption => {
    return {
      name,
      data,
      stack: 'Total',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 10,
      itemStyle: {
        color: lineColor,
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          color: lineColor,
          borderWidth: 2,
          borderColor: itemBorderColor,
        },
      },
      lineStyle: {
        width: 2,
        color: lineColor,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.1,
        color: lineColor,
      },
    };
  };
  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const { isDark } = useThemes();

  const renderData = computed(() => [
    {
      title: t('multiDAnalysis.dataOverview.core'),
      value: 1902,
      prefix: {
        icon: 'icon-heart-fill',
        background: isDark.value ? '#3D5A62' : '#E8FFFB',
        iconColor: isDark.value ? '#6ED1CE' : '#33D1C9',
      },
    },
    {
      title: t('multiDAnalysis.dataOverview.max'),
      value: 2445,
      prefix: {
        icon: 'icon-star-fill',
        background: isDark.value ? '#593E2F' : '#FFE4BA',
        iconColor: isDark.value ? '#F29A43' : '#F77234',
      },
    },
    {
      title: t('multiDAnalysis.dataOverview.contentExposure'),
      value: 3034,
      prefix: {
        icon: 'icon-heart',
        background: isDark.value ? '#354276' : '#E8F3FF',
        iconColor: isDark.value ? '#4A7FF7' : '#165DFF',
      },
    },
    {
      title: t('multiDAnalysis.dataOverview.activeUsers'),
      value: 1275,
      prefix: {
        icon: 'icon-user',
        background: isDark.value ? '#3F385E' : '#F5E8FF',
        iconColor: isDark.value ? '#8558D3' : '#722ED1',
      },
    },
  ]);

  const xAxis = ref<string[]>([]);
  const coreSize = ref<number[]>([]);
  const maxSize = ref<number[]>([]);

  const { chartOption } = useChartOption((dark) => {
    return {
      grid: {
        left: '2.6%',
        right: '4',
        top: '40',
        bottom: '40',
      },
      xAxis: {
        type: 'category',
        offset: 2,
        data: xAxis.value,
        boundaryGap: false,
        axisLabel: {
          color: '#4E5969',
          formatter(value: number, idx: number) {
            if (idx === 0) return '';
            if (idx === xAxis.value.length - 1) return '';
            return `${value}`;
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisPointer: {
          show: true,
          lineStyle: {
            color: '#23ADFF',
            width: 2,
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisLabel: {
          formatter(value: number, idx: number) {
            if (idx === 0) return String(value);
            return `${value}个`;
          },
        },
        splitLine: {
          lineStyle: {
            color: dark ? '#2E2E30' : '#F2F3F5',
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
          </div>`;
        },
        className: 'echarts-tooltip-diy',
      },
      graphic: {
        elements: [],
      },
      series: [
        generateSeries('核心线程数', '#722ED1', '#F5E8FF', coreSize.value),
        generateSeries('最大线程数', '#F77234', '#FFE4BA', maxSize.value),
      ],
    };
  });

  const threadPoolsDataList = ref<ThreadPoolsData[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (props.ipAndPid == null || props.tpName == null) {
        return;
      }
      const { data } = await threadPoolDataOverview(
        props.ipAndPid,
        props.tpName
      );
      threadPoolsDataList.value.push(data);
      if (threadPoolsDataList.value.length > 10) {
        threadPoolsDataList.value.shift();
      }

      // 纵坐标 和 值
      xAxis.value = new Array(threadPoolsDataList.value.length);
      for (let i = 0; i < threadPoolsDataList.value.length; i += 1) {
        xAxis.value[i] = threadPoolsDataList.value[i].reportTime;
        coreSize.value[i] = threadPoolsDataList.value[i].coreSize;
        maxSize.value[i] = threadPoolsDataList.value[i].maxSize;
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  // 定时加载数据
  let timer: number | null = null; // 存储定时器 ID
  onUnmounted(() => {
    if (timer !== null) {
      clearInterval(timer); // 组件销毁时清除定时器
    }
  });
  watch(
    () => props.tpName,
    (newVal) => {
      if (newVal != null) {
        fetchData();
        timer = window.setInterval(fetchData, 3 * 1000); // 每 60 秒执行一次
      } else if (timer !== null) {
        // 组件销毁时清除定时器
        clearInterval(timer);
        timer = null;
      }
    }
  );
</script>

<style scoped lang="less">
  :deep(.arco-statistic) {
    .arco-statistic-title {
      color: rgb(var(--gray-10));
      font-weight: bold;
    }

    .arco-statistic-value {
      display: flex;
      align-items: center;
    }
  }

  .statistic-prefix {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 8px;
    color: var(--color-white);
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    vertical-align: middle;
    border-radius: 6px;
  }
</style>
