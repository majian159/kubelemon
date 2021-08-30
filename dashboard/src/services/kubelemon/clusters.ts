// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 此处后端没有提供注释 GET /namespaces/${param0}/clusters */
export async function listClusters(
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
  return request<API.ListResponse>(`/namespaces/${param0}/clusters`, {
    method: 'GET',
    params: {
      // limit has a default value: 10
      limit: '10',

      ...queryParams,
    },
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
  body: API.CreateClusterRequest,
  options?: { [key: string]: any },
) {
  const { namespace: param0, ...queryParams } = params;
  return request<API.Cluster>(`/namespaces/${param0}/clusters`, {
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
    name: string;
  },
  options?: { [key: string]: any },
) {
  const { namespace: param0, name: param1, ...queryParams } = params;
  return request<API.Cluster>(`/namespaces/${param0}/clusters/${param1}`, {
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
    name: string;
  },
  options?: { [key: string]: any },
) {
  const { namespace: param0, name: param1, ...queryParams } = params;
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
    name: string;
  },
  body: API.UpdateClusterRequest,
  options?: { [key: string]: any },
) {
  const { namespace: param0, name: param1, ...queryParams } = params;
  return request<API.Cluster>(`/namespaces/${param0}/clusters/${param1}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Get cluster config GET /namespaces/${param0}/clusters/${param1}/config */
export async function getClusterConfig(
  params: {
    // path
    /** Namespace name */
    namespace: string;
    /** Cluster name */
    name: string;
  },
  options?: { [key: string]: any },
) {
  const { namespace: param0, name: param1, ...queryParams } = params;
  return request<API.Config>(`/namespaces/${param0}/clusters/${param1}/config`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Put cluster config PUT /namespaces/${param0}/clusters/${param1}/config */
export async function putClusterConfig(
  params: {
    // path
    /** Namespace name */
    namespace: string;
    /** Cluster name */
    name: string;
  },
  body: API.Config,
  options?: { [key: string]: any },
) {
  const { namespace: param0, name: param1, ...queryParams } = params;
  return request<string>(`/namespaces/${param0}/clusters/${param1}/config`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
