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

      <button v-if="stage === 'result'" class="btn main" @click="draw">
        再 Tell Me Why
      </button>
    </div>
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

const backImage = 'images/卡背.png';

let flipAudio = null;

onMounted(() => {
  flipAudio = new Audio(
    'flip.mp3'
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
  }, 9500);
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
:global(body) {
  margin: 0;
  overflow: hidden;
}

/* 页面容器 */
.page {
  height: 100dvh; 
  width: 100%;
 
  margin: 0 auto;

  background: #fff7d6;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 16px;
  box-sizing: border-box;
}

/* 按钮区域 */
.btn-area {
  margin-top: 80px;
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 按钮基础样式（桌面优先） */
.btn {
  padding: 15px 100px;        
  font-size: 28px;           
  border-radius: 999px;
  border: none;
  font-weight: bold;
  cursor: pointer;

  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);
  transition: all 0.15s ease;
}

/* 点击效果 */
.btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.15);
}

.main {
  background: #96e6a1;
}

@media (max-width: 600px) {

  .page {
    padding: 12px;
  }

  .btn-area {
    margin-top: 6vh; 
  }

  .btn {
    width: 85vw;       
    max-width: 320px;

    padding: 18px 0;    
    font-size: 18px;    

    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);
  }

  .btn:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
  }
}
</style>