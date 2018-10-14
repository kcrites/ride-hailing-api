local env = std.extVar('__ksonnet/environments');
local params = std.extVar('__ksonnet/params').components['api-namespace'];
{
  apiVersion: 'v1',
  kind: 'Namespace',
  metadata: {
    labels: {
      name: 'api-namespace',
    },
    name: 'ride-hailing',
  },
}
