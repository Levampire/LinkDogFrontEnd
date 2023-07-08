import { GithubType } from '../interface';
import request from '../request';

/* 用户列表 */
export const getUserList = (searchName: string) =>
  request<GithubType>({
    url: `/api/search/users?q=${searchName}`,
    method: 'get',
  });
export const addProject = (params: object) =>
  request({
    url: `/api/uploadTraingSet`,
    data: params,
    method: 'post',
  });
export const editProject = (params: object) =>
  request({
    url: `/api/updateTraingSet`,
    data: params,
    method: 'post',
  });
export const getProject = (params: object) =>
  request({
    url: `/api/queryProjectList`,
    data: params,
    method: 'post',
  });
export const startTraining = (project: object) =>
  request({
    url: `/api/startTraining`,
    data: project,
    method: 'post',
  });
export const deleteProject = (project: object) =>
  request({
    url: `/api/deleteTraingSet`,
    data: project,
    method: 'post',
  });

export const downLoadTrainingResult = (project: object) =>
  request({
    url: `/api/downloadResult`,
    data: project,
    method: 'post',
    responseType: 'blob',
  });
