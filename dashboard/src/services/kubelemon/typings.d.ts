// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Cluster = {
    creationTime?: string;
    description?: string;
    name?: string;
  };

  type Config = {
    config?: string;
  };

  type CreateClusterRequest = {
    description?: string;
    name?: string;
  };

  type ListResponse = {
    items?: Cluster[];
    total?: number;
  };

  type UpdateClusterRequest = {
    description?: string;
  };
}
