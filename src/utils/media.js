export function loadSync(Media, src) {
  const media = new Media();
  media.src = src;

  return media;
}

export function load(Media, src) {
  return new Promise((resolve, reject) => {
    const media = new Media();
    media.onload = () => resolve(media);
    media.onerror = reject;
    media.src = src;
  });
}

export function play(sound) {
  sound.currentTime = 0;
  sound.play();
}
