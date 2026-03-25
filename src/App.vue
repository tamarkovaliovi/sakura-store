<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

onMounted(async () => {
  const token = localStorage.getItem("user_token");
  if (token) {
    try {
      await authStore.fetchUser();
      console.log("App Initialized: Global user state loaded.");
    } catch (error) {
      console.error("Auth initialization failed:", error);
    }
  }
});
</script>

<template>
  <RouterView />
</template>
