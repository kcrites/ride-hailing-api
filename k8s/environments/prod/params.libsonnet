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
      replicas: 3,
      limits: {
        cpu: '500m',
        memory: '1Gi',
      },
      requests: {
        cpu: '100m',
        memory: '0.5Gi',
      },
      TWILIO_API_KEY: 'CNvD1uktQu7wio61sVNLPNaZXP0OBJVa',
      MAILGUN_API_KEY: 'key-099572ee6cd2260a358eeb65b3eeeef8',
      MAILGUN_DOMAIN: 'dav.network',
      CASSANDRA_ENDPOINTS: 'cassandra-0.cassandra.cassandra.svc.cluster.local',
    },
  },
};

{
  components: {
    [x]: envParams.components[x] + globals
    for x in std.objectFields(envParams.components)
  },
}
