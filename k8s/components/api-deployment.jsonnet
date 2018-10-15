local env = std.extVar('__ksonnet/environments');
local params = std.extVar('__ksonnet/params').components['api-deployment'];
local version = std.extVar('IMAGE_VERSION');
{
  apiVersion: 'apps/v1beta1',
  kind: 'Deployment',
  metadata: {
    name: 'api',
  },
  spec: {
    selector: {
      matchLabels: {
        api: 'api',
      },
    },
    replicas: params.replicas,
    template: {
      metadata: {
        labels: {
          api: 'api',
          version: version,
        },
      },
      spec: {
        containers: [
          {
            image: 'ridehailing/api:' + version,
            name: 'api',
            env: [
              {
                name: 'CASSANDRA_KEYSPACE',
                value: 'ride_hailing',
              },
            ],
            ports: [
              {
                containerPort: 3005,
              },
            ],
            resources: {
              limits: {
                cpu: params.limits.cpu,
                memory: params.limits.memory,
              },
              requests: {
                cpu: params.requests.cpu,
                memory: params.requests.memory,
              },
            },
          },
        ],
      },
    },
  },
}
