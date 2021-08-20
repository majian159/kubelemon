// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Cluster = {
    config?: string;
    description?: string;
    name?: string;
  };

  type clusterListResponse = {
    clusters?: Cluster[];
    total?: number;
  };

  type createCluster = {
    config?: string;
    description?: string;
    name?: string;
  };

  type updateCluster = {
    config?: string;
    description?: string;
  };
}
