# ensure we didn't include dynamic folder
rm -rf src/runtime/dynamic

pnpm nuxt-module-build build

echo "recovering mockServiceWorker.js"
mv dist/runtime/public/mockServiceWorker.mjs dist/runtime/public/mockServiceWorker.js
rm -f dist/runtime/public/mockServiceWorker.d.ts
