<script setup lang="ts">
// const res = await $fetch('http://localhost:3000/api/user')
// const { data } = await useFetch('http://localhost:3000/api/user')
const { data } = await useFetch('/api/user', {
  // baseURL: 'http://localhost:3001',
})
// const { data } = await useFetch('/api/user')
// const hrf = location.href
</script>

<template>
  <div id="name">
    <!-- {{ res.id }} -->
    {{ data.name }}
  </div>
</template>

<style></style>
