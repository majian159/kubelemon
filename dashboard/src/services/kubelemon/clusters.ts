// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 此处后端没有提供注释 GET /namespaces/${param0}/clusters */
export async function listClusters(
  params: {
    // path
    /** Namespace name */
    namespace: string;
  },
  options?: { [key: string]: any },
) {
  const { namespace: param0, ...queryParams } = params;
  return request<string>(`/namespaces/${param0}/clusters`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Create cluster POST /namespaces/${param0}/clusters */
export async function postCluster(
  params: {
    // path
    /** Namespace name */
    namespace: string;
  },
  body: API.createCluster,
  options?: { [key: string]: any },
) {
  const { namespace: param0, ...queryParams } = params;
  return request<string>(`/namespaces/${param0}/clusters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Get cluster GET /namespaces/${param0}/clusters/${param1} */
export async function getCluster(
  params: {
    // path
    /** Namespace name */
    namespace: string;
    /** Cluster name */
    cluster: string;
  },
  options?: { [key: string]: any },
) {
  const { namespace: param0, cluster: param1, ...queryParams } = params;
  return request<string>(`/namespaces/${param0}/clusters/${param1}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Delete a cluster DELETE /namespaces/${param0}/clusters/${param1} */
export async function deleteCluster(
  params: {
    // path
    /** Namespace name */
    namespace: string;
    /** Cluster name */
    cluster: string;
  },
  options?: { [key: string]: any },
) {
  const { namespace: param0, cluster: param1, ...queryParams } = params;
  return request<any>(`/namespaces/${param0}/clusters/${param1}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Update cluster PATCH /namespaces/${param0}/clusters/${param1} */
export async function patchCluster(
  params: {
    // path
    /** Namespace name */
    namespace: string;
    /** Cluster name */
    cluster: string;
  },
  body: API.updateCluster,
  options?: { [key: string]: any },
) {
  const { namespace: param0, cluster: param1, ...queryParams } = params;
  return request<string>(`/namespaces/${param0}/clusters/${param1}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
