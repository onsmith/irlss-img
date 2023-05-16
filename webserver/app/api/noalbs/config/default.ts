export default {
  user: {
    id: null,
    name: "",
    passwordHash: null,
  },
  switcher: {
    bitrateSwitcherEnabled: true,
    onlySwitchWhenStreaming: false,
    instantlySwitchOnRecover: true,
    autoSwitchNotification: false,
    retryAttempts: 5,
    triggers: {
      low: 800,
      rtt: 2500,
      offline: null,
    },
    switchingScenes: {
      normal: "live",
      low: "low",
      offline: "offline",
    },
    streamServers: [
      {
        streamServer: {
          type: "SrtLiveServer",
          statsUrl: "http://srt-relay:8080/stats",
          publisher: "publisher/stream/REPLACE_WITH_INGEST_KEY",
        },
        name: "IRL Video Feed",
        priority: 0,
        overrideScenes: null,
        dependsOn: null,
        enabled: true,
      },
    ],
  },
  software: {
    type: "Obs",
    host: "host.docker.internal",
    password: "example",
    port: 4455,
  },
  chat: {
    platform: "Twitch",
    username: "REPLACE_WITH_TWITCH_USERNAME",
    admins: [],
    prefix: "!",
    enablePublicCommands: false,
    enableModCommands: true,
    enableAutoStopStreamOnHostOrRaid: true,
    announceRaidOnAutoStop: false,
  },
  optionalScenes: {
    starting: "starting",
    ending: "ending",
    privacy: "privacy",
    refresh: "refresh",
  },
  optionalOptions: {
    twitchTranscodingCheck: false,
    twitchTranscodingRetries: 5,
    twitchTranscodingDelaySeconds: 15,
    offlineTimeout: null,
    recordWhileStreaming: false,
  },
  language: "en",
};
