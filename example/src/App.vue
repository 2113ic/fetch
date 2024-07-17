<script setup lang="ts">
import { useFetch } from './utils/http'

const { isloading, data, error } = useFetch(
  'GET user/{username}',
  { params: '2113ic' }
)
</script>

<template>
  <div v-if="isloading">加载中...</div>
  <div v-else>{{ data || error }}</div>
</template>
