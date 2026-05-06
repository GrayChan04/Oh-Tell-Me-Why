<template>
  <div class="card-container" @click="handleClick">
    <div v-if="showGlow" class="glow glow-card"></div>

    <div class="card-inner" :style="{ transform: `rotateY(${rotation}deg)` }">
      <!-- 背面 -->
      <div class="card-face back">
        <img :src="backImage" class="card-img" />
      </div>

      <!-- 正面 -->
      <div class="card-face front">
        <div v-if="showGuide" class="text-box">
          <p class="text">{{ guideText }}</p>
        </div>

        <img v-else :src="card?.path" class="card-img" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  rotation: Number,
  card: Object,
  showGuide: Boolean,
  guideText: String,
  showGlow: Boolean,
  backImage: String,
});

const emit = defineEmits(['tap']);

const handleClick = () => {
  emit('tap');
};
</script>

<style scoped>
.card-container {
  width: 80vw;
  max-width: 320px;
  aspect-ratio: 600 / 970;
  perspective: 1200px;
  position: relative;
  animation: floatCard 3s ease-in-out infinite;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
  transform-style: preserve-3d;
  transition: transform 0.7s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.1);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  backface-visibility: hidden;
}

.front {
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
}

.back {
  transform: rotateY(180deg);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-box {
  padding: 20px;
  text-align: center;
}

.text {
  font-size: 16px;
  white-space: pre-line;
  font-style: italic;
  font-weight: bold;
  line-height: 1.6;
}

@keyframes floatCard {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0);
  }
}

/* 光圈 */
.glow-card {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(150, 230, 161, 0.9),
    0 0 20px rgba(150, 230, 161, 0.6), 0 0 40px rgba(150, 230, 161, 0.3);
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 10px rgba(150, 230, 161, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(150, 230, 161, 1);
  }
  100% {
    box-shadow: 0 0 10px rgba(150, 230, 161, 0.5);
  }
}
</style>
