<template>
  <div v-if="props.modelValue" ref="portal">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {
  nextTick,
  onBeforeMount,
  onMounted,
  ref,
  watch,
  defineProps,
  defineEmits,
} from "vue";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue"]);

let windowRef: Window | null = null;
const portal = ref(null);
const windowLoaded = ref(false);

function copyStyles() {
  // It is important to copy all parent window styles. Otherwise, there would be no CSS available at all
  // https://developer.chrome.com/docs/web-platform/document-picture-in-picture/#copy-style-sheets-to-the-picture-in-picture-window
  [].slice.call(document.styleSheets).forEach((styleSheet: any) => {
    try {
      const cssRules = [...styleSheet.cssRules]
        .map((rule) => rule.cssText)
        .join("");
      const style = document.createElement("style");

      style.textContent = cssRules;
      windowRef!.document.head.appendChild(style);
    } catch (e) {
      const link = document.createElement("link");
      if (styleSheet.href == null) {
        return;
      }

      link.rel = "stylesheet";
      link.type = styleSheet.type;
      link.media = styleSheet.media.toString();
      link.href = styleSheet.href;
      windowRef!.document.head.appendChild(link);
    }
  });
}

function openWindow() {
  nextTick()
    .then(() => {
      const windowOptions =
        "menubar=no,toolbar=no,location=no,status=no,scrollbars=no,resizable=yes,width=800,height=600";

      windowRef = window.open("", "meeting-window", windowOptions);
      if (!windowRef || !portal.value) return;
      windowLoaded.value = true;
      windowRef.document.body.append(portal.value);
      copyStyles();
      windowRef.addEventListener("beforeunload", closeWindow);
    })
    .catch((err) => console.log("Cannot initialize window", err));
}

function closeWindow() {
  if (windowRef) {
    windowRef.close();
    windowRef = null;
    emit("update:modelValue", false);
  }
}

watch(props, () => {
  if (props.modelValue) {
    openWindow();
  } else {
    closeWindow();
  }
});

onMounted(() => {
  if (props.modelValue) {
    openWindow();
  }
});

onBeforeMount(() => {
  if (windowRef) {
    closeWindow();
  }
});
</script>

<style></style>
