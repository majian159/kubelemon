// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Cluster = {
    config?: string;
    createdTime?: string;
    description?: string;
    name?: string;
  };

  type ClusterListResponse = {
    items?: Cluster[];
    total?: number;
  };

  type CreateClusterRequest = {
    config?: string;
    description?: string;
    name?: string;
  };

  type UpdateClusterRequest = {
    config?: string;
    description?: string;
  };
}
