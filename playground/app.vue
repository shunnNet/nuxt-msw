<template>
  <div>
    Nuxt module playground!
    {{ data }}
    Error: {{ error }}
    <button @click="req()">
      Request
    </button>
  </div>
</template>

<script setup>
const { data, error } = await useFetch('http://localhost:3000/api/user')

const req = async () => {
  try {
    const res = await $fetch('http://localhost:3000/api/user')
    console.log(res)
  }
  catch (e) {
    console.error(e)
  }
}
</script>
