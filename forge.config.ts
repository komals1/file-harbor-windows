import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseVersion, FuseV1Options } from '@electron/fuses';
import * as fs from 'fs-extra';
import * as path from 'path';

const config: ForgeConfig = {
  packagerConfig: {
    asar: {
      unpack: '*.node',
    },
  },
  hooks: {
    packageAfterCopy: async (config, buildPath) => {
      const targetNodeModules = path.join(buildPath, 'node_modules');
      await fs.ensureDir(targetNodeModules);
      
      const srcNodeModules = path.join(__dirname, 'node_modules');
      const modulesToCopy = ['better-sqlite3', 'bindings', 'file-uri-to-path', 'prebuild-install'];

      for (const mod of modulesToCopy) {
        const src = path.join(srcNodeModules, mod);
        const dest = path.join(targetNodeModules, mod);
        if (await fs.pathExists(src)) {
          await fs.copy(src, dest);
        }
      }
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: 'file_harbor',
      authors: 'Komal',
      description: 'A local-first Windows document filing cabinet',
    }),
    new MakerZIP({}, ['win32']),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new VitePlugin({
      build: [
        {
          entry: 'src/main/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.mts',
        },
      ],
    }),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),
  ],
};

export default config;
