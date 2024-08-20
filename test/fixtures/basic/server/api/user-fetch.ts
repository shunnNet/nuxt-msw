export default defineEventHandler(async () => {
  const res = await $fetch('/api/user')
  return res
})
