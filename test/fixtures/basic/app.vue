<template>
  <main>
    <div>{{ data }}</div>
    <section>
      <button data-testid="get-data-button" @click="getData">
        Get Data
      </button>
      <div>{{ alternative.name }}</div>
    </section>
  </main>
</template>

<script setup>
const { data } = await useFetch('/api/user')

const alternative = ref({})

const getData = async () => {
  // alternative.value.url = window.location.href
  await $fetch('/api/user').then((res) => {
    alternative.value = res
  })
}
</script>
