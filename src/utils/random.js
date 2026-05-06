export function getRandomCard(cards) {
  const index = Math.floor(Math.random() * cards.length);
  return cards[index];
}
