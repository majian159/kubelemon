// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 此处后端没有提供注释 GET /namespaces/${param0}/applications */
export async function listApplications(
  params: {
    // query
    keywords?: string;
    limit?: number;
    offset?: number;
    sortBy?: string[];
    // path
    /** Namespace name */
    namespace: string;
  },
  options?: { [key: string]: any },
) {
  const { namespace: param0, ...queryParams } = params;
  return request<API.ListResponse>(`/namespaces/${param0}/applications`, {
    method: 'GET',
    params: {
      // limit has a default value: 10
      limit: '10',

      ...queryParams,
    },
    ...(options || {}),
  });
}

/** Create application POST /namespaces/${param0}/applications */
export async function postApplication(
  params: {
    // path
    /** Namespace name */
    namespace: string;
  },
  body: API.Application,
  options?: { [key: string]: any },
) {
  const { namespace: param0, ...queryParams } = params;
  return request<API.Application>(`/namespaces/${param0}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Get application GET /namespaces/${param0}/applications/${param1} */
export async function getApplication(
  params: {
    // path
    /** Namespace name */
    namespace: string;
    /** Application name */
    name: string;
  },
  options?: { [key: string]: any },
) {
  const { namespace: param0, name: param1, ...queryParams } = params;
  return request<API.Application>(`/namespaces/${param0}/applications/${param1}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Delete an application DELETE /namespaces/${param0}/applications/${param1} */
export async function deleteApplication(
  params: {
    // path
    /** Namespace name */
    namespace: string;
    /** Application name */
    name: string;
  },
  options?: { [key: string]: any },
) {
  const { namespace: param0, name: param1, ...queryParams } = params;
  return request<any>(`/namespaces/${param0}/applications/${param1}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Update application PATCH /namespaces/${param0}/applications/${param1} */
export async function patchApplication(
  params: {
    // path
    /** Namespace name */
    namespace: string;
    /** Application name */
    name: string;
  },
  body: API.Application,
  options?: { [key: string]: any },
) {
  const { namespace: param0, name: param1, ...queryParams } = params;
  return request<API.Application>(`/namespaces/${param0}/applications/${param1}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
