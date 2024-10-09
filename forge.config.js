const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
  packagerConfig: {
    asar: true,
    authors: "Pratik Raut",
    description: "Your Password Management Application",
  },
  rebuildConfig: {},
  makers: [
    // For Windows installers
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "password_app",
        authors: "Pratik Raut",
        description: "Your Password Management Application",
      },
    },
    // For macOS DMG and ZIP
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {
        name: "password_app",
      },
    },
    // For Linux packages (DEB and RPM)
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    // Auto unpack natives plugin
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    // Fuses plugin for Electron functionality configuration
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],

  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'pratikdevelop',
          name: 'password-app-ui'
        },
        prerelease: false,
        draft: true
      }
    }
  ]
};
