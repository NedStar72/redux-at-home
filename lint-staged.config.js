export default {
  '*': 'prettier --write',
  '**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,astro,svelte}': 'oxlint',
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
};
