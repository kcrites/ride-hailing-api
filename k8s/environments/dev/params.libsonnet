local params = std.extVar('__ksonnet/params');
local globals = import 'globals.libsonnet';
local envParams = params {
  components+: {
    // Insert component parameter overrides here. Ex:
    // guestbook +: {
    //   name: "guestbook-dev",
    //   replicas: params.global.replicas,
    // },
    'api-deployment'+: {
      replicas: 1,
      limits: {
        cpu: '100m',
        memory: '0.1Gi',
      },
      requests: {
        cpu: '100m',
        memory: '0.1Gi',
      },
    },
  },
};

{
  components: {
    [x]: envParams.components[x] + globals
    for x in std.objectFields(envParams.components)
  },
}
