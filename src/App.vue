<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <h1 class="text-3xl font-bold mb-6">Daily.co Meeting App</h1>
    <input
      v-model="username"
      placeholder="Enter your username"
      class="w-full max-w-md p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <input
      v-model="roomUrl"
      placeholder="Paste Daily.co room link here"
      class="w-full max-w-md p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <div class="flex justify-start gap-1">
      <input
        v-model="openNewWindow"
        type="checkbox"
        class="h-5 w-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
      />
      <label class="text-sm text-gray-600">Open in new window</label>
    </div>

    <button
      @click="open = true"
      class="mt-4 px-6 py-3 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Join Meeting
    </button>
    <div class="relative w-3/5">
      <PortalWindow v-if="openNewWindow" v-model="open">
        <WebMeeting
          :room-url="roomUrl"
          :username="username"
          @end-meeting="open = false"
        />
      </PortalWindow>
      <WebMeeting
        v-else-if="open && !openNewWindow"
        :room-url="roomUrl"
        :username="username"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PortalWindow from "./components/PortalWindow.vue";
import WebMeeting from "./components/WebMeeting.vue";

const roomUrl = ref("https://jettonn.daily.co/FrLilHfEtSjbs9HGpS27");
const username = ref("");
const open = ref(false);
const openNewWindow = ref(false);
</script>
