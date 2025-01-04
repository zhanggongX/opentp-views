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

export interface AppListParams extends Partial<AppRecord> {
  current: number;
  pageSize: number;
}

export interface AppCreateOrEditParams {
  showName: string;
  appName: string;
}

export interface AppCreateOrEditRes {
  code: number;
  message: string;
}

export function queryApps(params: AppListParams) {
  return axios.get<AppListRes>('/api/applications/', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function applicationEdit(params: AppCreateOrEditParams) {
  return axios.post<AppCreateOrEditRes>('/api/applications/', params);
}

export function applicationDelete(appKey: string) {
  return axios.delete<AppCreateOrEditRes>(`/api/applications/${appKey}`);
}
