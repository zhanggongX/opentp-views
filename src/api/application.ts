import axios from 'axios';
import qs from 'query-string';
import { resolve } from 'path';

export interface AppRecord {
  showName: string;
  appName: string;
  appKey: string;
  appSecret: string;
  // createdTime: string;
}

export interface AppListRes {
  code: number;
  message: string;
  list: AppRecord[];
  total: number;
}

export interface AppParams extends Partial<AppRecord> {
  current: number;
  pageSize: number;
}

export function queryApps(params: AppParams) {
  return axios.get<AppListRes>('/api/applications/info', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
