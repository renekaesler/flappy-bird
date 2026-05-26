const audioContext = new AudioContext();
const buffers = new Map();

export async function loadSound(name, url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  buffers.set(name, audioBuffer);
}

export async function unlockAudio() {
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
}

export function playSound(name, volume = 1) {
  const buffer = buffers.get(name);

  if (!buffer) return;

  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();

  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  source.buffer = buffer;
  gainNode.gain.value = volume;
  source.start(0);
}
