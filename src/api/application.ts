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
  return axios.get<ConnectRecord[]>('/api/connections/', {
    params: { appKey },
  });
}

export function queryThreadPools(ipAndPid: string) {
  return axios.get<string[]>('/api/thread-pools/', {
    params: { ipAndPid },
  });
}

/**
 * coreSize": 10,
 *     "maxSize": 20,
 *     "poolSize": 0,
 *     "activeCount": 0,
 *     "completedCount": 0,
 *     "queueSize": 0,
 *     "queueLength": 1024,
 *     "largestPoolSize": 0,
 *     "threadPoolName": "tp1"
 */
export interface ThreadPoolsData {
  coreSize: number;
  maxSize: number;
  reportTime: string;
}

export function threadPoolDataOverview(ipAndPid: string, tpName: string) {
  return axios.get<ThreadPoolsData>(`/api/thread-pools/${tpName}`, {
    params: { ipAndPid },
  });
}
