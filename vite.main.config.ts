import type { ConfigEnv } from 'vite';
import { defineConfig } from 'vite';

export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'build'>;
  const { forgeConfigSelf } = forgeEnv;
  
  return {
    build: {
      lib: {
        entry: forgeConfigSelf.entry!,
        fileName: 'main',
        formats: ['cjs'],
      },
      rollupOptions: {
        external: ['better-sqlite3'],
      },
    },
    plugins: [],
    resolve: {
      mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
    },
  };
});
