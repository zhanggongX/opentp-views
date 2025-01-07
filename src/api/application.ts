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

export interface ConnectRecord {
  host: string;
  pid: string;
  appKey: string;
  appSecret: string;
}

export interface ConnectListRes {
  code: number;
  message: string;
  list: ConnectRecord[];
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

export function queryAllApps() {
  return axios.get<AppListRes>('/api/applications/');
}

export function applicationCreate(params: AppCreateOrEditParams) {
  return axios.post<AppCreateOrEditRes>('/api/applications/', params);
}

export function applicationEdit(params: AppCreateOrEditParams, appKey: string) {
  return axios.put<AppCreateOrEditRes>(`/api/applications/${appKey}`, params);
}

export function applicationDelete(appKey: string) {
  return axios.delete<AppCreateOrEditRes>(`/api/applications/${appKey}`);
}

export function queryConnects(appKey: string) {
  return axios.get<ConnectListRes>('/api/connections/', {
    params: { appKey },
  });
}

export function queryThreadPools(ipAndPid: string) {
  return axios.delete<ConnectListRes>('/api/thread-pools/', {
    params: { ipAndPid },
  });
}
