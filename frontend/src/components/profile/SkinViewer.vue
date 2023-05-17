<template>
  <div class="main">
    <!-- <img
      @click="() => rotation = !rotation"
      :class="rotation ? 'enabled rotate' : 'rotate'"
      src="images/rotation.svg"
      alt="rotation"
    > -->
    <canvas ref="skinViewerRef"></canvas>
    <div class="animationSelector">
      <span ref="selectorRef" class="selector"></span>
      <!-- <button @click="() => setSelector(SelectorPosition.Stay)"><img src="images/stay.svg" alt="stay"></button> -->
      <!-- <button @click="() => setSelector(SelectorPosition.Walk)"><img src="images/walk.svg" alt="walk"></button> -->
      <!-- <button @click="() => setSelector(SelectorPosition.Fly)"><img src="images/fly.svg" alt="fly"></button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useTypedStore } from '@/store';
import * as SkinView3d from 'skinview3d';
import { onMounted, ref, watch } from 'vue';

// const store = useTypedStore();
let skinViewer: SkinView3d.SkinViewer | null = null;
const skinViewerRef = ref<HTMLCanvasElement>();
const selectorRef = ref<HTMLSpanElement>();

enum SelectorPosition {
  Stay = '10%',
  Walk = 'calc(37% + 1px)',
  Fly = '66%',
}

function setSelector(target: SelectorPosition) {
  selectorRef.value!.style.left = target;
  switch (target) {
    case (SelectorPosition.Stay):
      skinViewer!.loadCape(getCape(), { backEquipment: 'cape' });
      skinViewer!.animation = new SkinView3d.IdleAnimation();
      break;
    case (SelectorPosition.Walk):
      skinViewer!.loadCape(getCape(), { backEquipment: 'cape' });
      skinViewer!.animation = new SkinView3d.WalkingAnimation();
      break;
    case (SelectorPosition.Fly):
      skinViewer!.animation = new SkinView3d.FlyingAnimation();
      skinViewer!.loadCape(getCape(), { backEquipment: 'elytra' })
      break;
  }
}

function getCape() {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAABCklEQVRo3u2YsQoCMRBE820WFiKIjVyhWAgKgliJdmcpNoKljZ8aGWFlCIGDnCK72YHhNOBx82Yj4UL4o4bTRRS3t2fWwboEQKhdAmIwbiJPhqxVBSAHoYop6QJgfhK6AJifAv4PSCFM5tu3qwEgn0ez1Sc8vNyf7UJAWAaA72KEb9YH+wA4MBtrAACbBSBB+crNw5vTVQeA4+URSyFI0xycAag4IpcCSEOn7e/auw4ApQ+Zax1rCK8KQOkEpG2nxnrpvVVMgATnxlOb3gIMgUHw+JveAgIg1z7uKTY9AQiI38tV5Zuivg8pQbl1VQD6nthy7avaAt84suaar+ZlqcvlcrlcLpfrx3oB++zXhEHDmtAAAAAASUVORK5CYII=';
}

let rotation = ref(true);
watch(rotation, (v) => skinViewer!.autoRotate = v);

onMounted(() => {
  skinViewer = new SkinView3d.SkinViewer({
    canvas: skinViewerRef.value,
    height: 250,
    width: 170,
    // skin: store.state.auth.skin,
    animation: new SkinView3d.IdleAnimation(),
    background: '#bbb',
    fov: 60,
    cape: getCape(),
    pixelRatio: 'match-device',
    zoom: 0.7,
    // nameTag: new SkinView3d.NameTagObject(store.state.auth.username),
  });
  skinViewer.autoRotate = true;
  skinViewer.autoRotateSpeed = 0.2;
})


</script>

<style scoped>
.main, canvas {
  background-color: #bbb;
  border-radius: 8px;
  width: 170px;
  position: relative;
}
.animationSelector {
  display: flex;
  position: relative;
  justify-content: space-evenly;
  align-items: center;
  padding: 7px 5px 7px 5px;
  width: 100%;
}
button {
  border: none;
  background-color: inherit;
}
img {
  width: 30px;
  cursor: pointer;
  filter: invert(34%) sepia(4%) saturate(15%) hue-rotate(314deg) brightness(95%) contrast(78%);
}
.selector {
  position: absolute;
  background-color: #fdfbfb;
  width: 41px;
  height: 35px;
  border-radius: 5px;
  transition: .3s;
  pointer-events: none !important;
  cursor: default !important;
  left: 10%;
  top: 5px;
}
.rotate {
  position: absolute;
  z-index: 2;
  left: 5px;
  top: 5px;
  width: 30px;
}
.enabled {
  filter: invert(71%) sepia(79%) saturate(4477%) hue-rotate(159deg) brightness(105%) contrast(103%);
}
</style>
