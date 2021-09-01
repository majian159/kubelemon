// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Application = {
    components?: Component[];
    creationTime?: string;
    description?: string;
    name?: string;
  };

  type Component = {
    externalRevision?: string;
    name?: string;
    properties?: Record<string, any>;
    scopes?: Record<string, any>;
    traits?: ComponentTrait[];
    type?: string;
  };

  type ComponentTrait = {
    properties?: Record<string, any>;
    type?: string;
  };

  type ListResponse = {
    items?: Application[];
    total?: number;
  };

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
