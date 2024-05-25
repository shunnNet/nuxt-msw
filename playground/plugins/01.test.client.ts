export default defineNuxtPlugin(async (_nuxtApp) => {
  await $fetch('/api/user').then(res => console.log('plugin', res))
})
