<template>
  <div class="main color-background" ref="mainRef">
    
    <span v-for="i in 16" class="element empty color-empty" />
    <div class="element color-16" x="0" y="0"></div>
    
  </div>
</template>
<script setup lang="ts">
import * as EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';

const mainRef = ref<HTMLDivElement>();

let eventer: ReturnType<typeof movementHandler>;
onMounted(() => {
  eventer = movementHandler();

  eventer?.on('movement', direction => {
    addBlocks();
  })
})



function addBlocks() {
  const slotIsEmpty = (x: number, y: number) => document.querySelector(`div[x="${x}"][y="${y}"]`) ? false : true;
  const emptySlots: Array<{ x: number, y: number }> = [];
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (slotIsEmpty(x, y)) emptySlots.push({ x, y });
    }
  }
  
  const randomEmptySlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
  const value = Math.random() * 9 >= 8 ? 4 : 2;

  const node = document.createElement('div');
  node.setAttribute('x', randomEmptySlot.x.toString());
  node.setAttribute('y', randomEmptySlot.y.toString());
  node.setAttribute('value', value.toString());
  node.classList.value = `element color-${value}`;

  console.log(mainRef.value?.appendChild(node));

} 

function movementHandler() {
  if (!process.client) return;

  type MovementsType = { up: number, rigth: number, left: number, down: number };
  type MovementsKeysType = keyof MovementsType;
  type EventsType = { movement: (direction: MovementsKeysType) => void };

  const eventer = new EventEmitter() as TypedEmitter<EventsType>;

  document.addEventListener('mousedown', function onMouseDown(mouseDownEvent) {
    const main = mainRef.value!;
    if (!main) {
      document.removeEventListener('mousedown', onMouseDown);
      return;
    }

    if ( mouseDownEvent.clientX < main.offsetLeft || mouseDownEvent.clientX > main.offsetLeft + main.offsetWidth  ) return;
    if ( mouseDownEvent.clientY < main.offsetTop  || mouseDownEvent.clientY > main.offsetTop  + main.offsetHeight ) return;

    document.addEventListener('mouseup', function onMouseUp(mouseUpEvent) {
      document.removeEventListener('mouseup', onMouseUp);
      const movements: MovementsType = {
        up: mouseDownEvent.clientY - mouseUpEvent.clientY,
        down: mouseUpEvent.clientY - mouseDownEvent.clientY,
        rigth: mouseUpEvent.clientX - mouseDownEvent.clientX,
        left: mouseDownEvent.clientX - mouseUpEvent.clientX,
      }
      const maxValue = Math.max(...Object.values(movements));
      const maxKey = Object.keys(movements).find(key => movements[key as MovementsKeysType] === maxValue) as MovementsKeysType;

      if (maxValue <= 10) return;
      eventer.emit('movement', maxKey)
    });
  });

  document.addEventListener('keydown', (keyDownEvent) => {
    if (!keyDownEvent.key.includes('Arrow')) return;
    const key = keyDownEvent.key.replace('Arrow', '').toLowerCase() as MovementsKeysType;
    eventer.emit('movement', key);
  });

  document.addEventListener('keydown', (keyDownEvent) => {
    const keys = {
      w: 'up', a: 'left', s: 'down', d: 'rigth',
      ц: 'up', ф: 'left', ы: 'down', в: 'rigth',
    };
    const key = Object.keys(keys).filter((value) => value === keyDownEvent.key.toLowerCase())[0] as keyof typeof keys;
    if (!key || !keys[key]) return;
    eventer.emit('movement', keys[key] as MovementsKeysType);
  })
  
  return eventer;
}


</script>
<style scoped>
.main {
  position: relative !important;
  cursor: default;
  touch-action: none;
  border-radius: 6px;
  width: 400px;
  height: 400px;
  padding-top: 11px;
}

.element {
  width: 90px;
  height: 90px;
  margin-top: 8px;
  margin-left: 8px;
  border-radius: 3px;
  display: inline-block;
  top: 0;
  left: 0;
  position: absolute;
}
.empty {
  position: relative;
  margin-top: -3px;
}

.color-background { background-color: #bbada0; }
.color-empty { background-color: #cdc1b4; }
.color-2 { background-color: #eee4da; }
.color-4 { background-color: #ede0c8; }
.color-8 { background-color: #f2b179; }
.color-16 { background-color: #f59563; }
.color-32 { background-color: #f67c5f; }
.color-64 { background-color: #f65e3b; }

</style>

