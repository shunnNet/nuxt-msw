export default defineEventHandler(() => {
  console.log('Got request from nuxt server handler')
  return {
    hello: 'server user',
  }
})
