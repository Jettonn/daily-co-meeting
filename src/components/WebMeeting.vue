<template>
  <div class="w-full">
    <div
      ref="videoDiv"
      id="daily-call"
      class="mt-6 w-full max-w-4xl h-96 border border-gray-300 rounded-md shadow-sm"
    />
    <div
      v-if="isMeetingLoading"
      class="bg-black bg-opacity-50 absolute top-0 left-0 flex justify-center items-center h-full w-full text-center text-white"
    >
      Waiting to setup video call...
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DailyCall, DailyEventObjectBase } from "@daily-co/daily-js";
import { ref, defineProps, onMounted, defineEmits, onUnmounted } from "vue";
import DailyIframe from "@daily-co/daily-js";

const props = defineProps<{ roomUrl: string; username: string }>();
const emit = defineEmits(["endMeeting"]);
const videoDiv = ref(null);
const isMeetingLoading = ref(true);
let callFrame: DailyCall | null = null;

async function setupDailyCo() {
  if (!videoDiv.value) {
    console.log("Failed to get VideoDiv");
    return;
  }

  if (!props.roomUrl) {
    alert("Please enter a Daily.co room URL");
    return;
  }

  if (!props.username) {
    alert("Please enter a username");
    return;
  }

  callFrame = getDailyFrame();
  if (callFrame) {
    return;
  }

  try {
    isMeetingLoading.value = false;
    callFrame = DailyIframe.createFrame(videoDiv.value, {
      showLeaveButton: true,
      iframeStyle: {
        width: "100%",
        height: "100%",
      },
      dailyConfig: {
        avoidEval: true,
      },
    });
    callFrame.on("joined-meeting", (e: DailyEventObjectBase) =>
      dailyEventHandler(e)
    );
    callFrame.on("left-meeting", (e: DailyEventObjectBase) => {
      emit("endMeeting");
      dailyEventHandler(e);
    });
    callFrame.on("error", (e: DailyEventObjectBase) => dailyEventHandler(e));
    callFrame.on("participant-joined", (e: DailyEventObjectBase) =>
      dailyEventHandler(e)
    );
    callFrame.on("participant-updated", (e: DailyEventObjectBase) =>
      dailyEventHandler(e)
    );
    callFrame.on("participant-left", (e: DailyEventObjectBase) =>
      dailyEventHandler(e)
    );
    callFrame.on("error", (e: DailyEventObjectBase) => dailyEventHandler(e));

    callFrame.on("available-devices-updated", (e) => {
      dailyEventHandler(e);
    });
    callFrame.on("selected-devices-updated", (e) => {
      dailyEventHandler(e);
    });

    await callFrame.join({
      url: props.roomUrl,
      userName: props.username,
    });
  } catch (err) {
    console.log("Got exception setting up daily", err);
  }
}

function dailyEventHandler(e: DailyEventObjectBase) {
  console.log(`DAILY EVENT [${e.action}]`, e);
}

// Get current daily frame, if any
function getDailyFrame() {
  if (callFrame) {
    return callFrame;
  }
  try {
    return DailyIframe.getCallInstance() ?? null;
  } catch (err) {
    return null;
  }
}

onMounted(() => {
  setupDailyCo().then(() => {
    isMeetingLoading.value = false;
  });
});

onUnmounted(() => {
  if (callFrame) {
    callFrame.leave();
    callFrame.destroy();
  }
});
</script>

<style></style>
