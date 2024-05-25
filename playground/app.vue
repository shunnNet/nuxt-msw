<template>
  <main>
    <div>{{ data }}</div>
    <section>
      <button data-testid="get-data-button" @click="getData">
        Get Data
      </button>
      <div>{{ alternative }}</div>
    </section>
  </main>
</template>

<script setup>
const { data } = await useFetch('/api/user')

const alternative = ref('')

const getData = async () => {
  $fetch('/api/user').then((res) => {
    alternative.value = JSON.stringify(res)
  })
}
</script>
