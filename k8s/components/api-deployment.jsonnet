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
                name: 'CASSANDRA_ENDPOINTS',
                value: params.CASSANDRA_ENDPOINTS,
              },
               {
                name: 'CASSANDRA_KEYSPACE',
                value: 'ride_hailing',
              },
              {
                name: 'TWILIO_API_KEY',
                value: params.TWILIO_API_KEY,
              },
              {
                name: 'MAILGUN_API_KEY',
                value: params.MAILGUN_API_KEY,
              },
              {
                name: 'MAILGUN_DOMAIN',
                value: params.MAILGUN_DOMAIN,
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
