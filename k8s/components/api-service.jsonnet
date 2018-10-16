local env = std.extVar('__ksonnet/environments');
local params = std.extVar('__ksonnet/params').components['api-service'];
{
  apiVersion: 'v1',
  kind: 'Service',
  metadata: {
    name: 'api',
  },
  spec: {
    ports: [
      {
        protocol: 'TCP',
        port: 80,
        targetPort: 3005,
      },
    ],
    selector: { api: 'api' },
    type: 'LoadBalancer',
    loadBalancerIP: '35.227.43.29',
  },
}
