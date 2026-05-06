<template>
  <div class="page">
    <Card
      :rotation="rotation"
      :card="currentCard"
      :showGuide="showGuide"
      :guideText="guideText"
      :showGlow="showCardGlow"
      :backImage="backImage"
      @tap="onCardTap"
    />

    <!-- 按钮 -->
    <div class="btn-area">
      <button v-if="stage === 'idle'" class="btn main" @click="start">
        Oh Tell Me Why
      </button>

      <div v-if="stage === 'result'" class="btn-column">
        <button class="btn sub" @click="draw">再 Tell Me Why</button>

        <button class="btn save" @click="showTip = true">保存卡面</button>
      </div>
    </div>

    <!-- 右下角提示 -->
    <div v-if="showTip" class="tip">右击卡面即可保存图片</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Card from './components/Card.vue';
import cards from './assets/cards.json';
import { getRandomCard } from './utils/random';

const rotation = ref(180);
const currentCard = ref({});
const guideText = ref('');
const showGuide = ref(false);
const isFront = ref(false);
const hasStarted = ref(false);
const sequenceLock = ref(false);
const startLock = ref(true);
const showCardGlow = ref(true);
const showBtnGlow = ref(false);
const stage = ref('idle');

const showTip = ref(false);

const backImage = '/images/卡背.png';

let flipAudio = null;

onMounted(() => {
  flipAudio = new Audio(
    '/flip.mp3'
  );
});

const playFlip = () => {
  if (flipAudio) {
    flipAudio.currentTime = 0;
    flipAudio.play();
  }
};

const flip = (cb) => {
  rotation.value += 180;
  isFront.value = !isFront.value;

  setTimeout(() => {
    cb && cb();
  }, 500);
};

const setNewCard = () => {
  currentCard.value = getRandomCard(cards);
  showGuide.value = false;
};

const autoSequence = () => {
  sequenceLock.value = true;

  setTimeout(() => {
    guideText.value = 'Oh Tell Me Why答案之卡\n更适合喜欢喻言的朋友们';
    showGuide.value = true;
    flip();
  }, 1000);

  setTimeout(() => flip(), 3000);

  setTimeout(() => {
    guideText.value = '创意：敏萱\n画师：橙子\n技术支持：陈墨\n\n喻言的裁缝铺©';
    showGuide.value = true;
    flip();
  }, 4000);

  setTimeout(() => flip(), 7000);

  setTimeout(() => {
    guideText.value = '心中默念想问的事情';
    showGuide.value = true;
    flip();
  }, 8000);

  setTimeout(() => {
    flip(() => {
      sequenceLock.value = false;
      startLock.value = false;
    });
  }, 9000);
};

const onCardTap = () => {
  if (sequenceLock.value) return;

  if (!hasStarted.value) {
    hasStarted.value = true;
    showCardGlow.value = false;
    autoSequence();
    return;
  }

  flip();
};

const start = () => {
  if (startLock.value) return;
  stage.value = 'result';
  draw();
};

const draw = () => {
  playFlip();

  if (isFront.value) {
    flip(() => {
      setNewCard();
      setTimeout(() => flip(), 400);
    });
  } else {
    setNewCard();
    flip();
  }
};
</script>

<style scoped>
.page {
  height: 100vh;
  background: #fff7d6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 按钮 */
.btn-area {
  margin-top: 30px;
}

.btn {
  padding: 12px 20px;
  border-radius: 999px;
  border: none;
  font-weight: bold;
}

.main {
  background: #96e6a1;
}

.sub {
  background: #96e6a1;
}

.save {
  background: #d4fc79;
  margin-top: 10px;
}

/* 提示 */
.tip {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 12px;
}
</style>
