import confetti from 'canvas-confetti';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Jouer l'animation complète de complétion de tâche
 * Séquence: Son → Confettis → Haptic feedback
 */
export async function playCompletionAnimation() {
  try {
    // 1. Son joyeux
    playSuccessSound();

    // 2. Confettis (en parallèle)
    fireConfetti();

    // 3. Haptic feedback (3 vibrations successives)
    await playHapticFeedback();
  } catch (error) {
    console.error('Erreur lors de l\'animation de complétion:', error);
  }
}

/**
 * Jouer le son de succès
 */
function playSuccessSound() {
  try {
    // Pour l'instant, on utilise une note synthétique
    // Plus tard, on pourra ajouter un vrai fichier audio dans public/sounds/
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Son joyeux (3 notes ascendantes)
    oscillator.frequency.value = 523.25; // Do (C5)
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);

    // Deuxième note
    setTimeout(() => {
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.frequency.value = 659.25; // Mi (E5)
      gain2.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc2.start();
      osc2.stop(audioCtx.currentTime + 0.3);
    }, 100);

    // Troisième note
    setTimeout(() => {
      const osc3 = audioCtx.createOscillator();
      const gain3 = audioCtx.createGain();
      osc3.connect(gain3);
      gain3.connect(audioCtx.destination);
      osc3.frequency.value = 783.99; // Sol (G5)
      gain3.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain3.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc3.start();
      osc3.stop(audioCtx.currentTime + 0.4);
    }, 200);
  } catch (error) {
    console.error('Erreur son:', error);
  }
}

/**
 * Lancer l'animation de confettis
 */
function fireConfetti() {
  const duration = 2000; // 2 secondes
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 9999,
  };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Explosion de confettis depuis plusieurs points
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#FF6B35', '#FFB380', '#FBBF24', '#FF6B8A', '#FCD34D'],
    });

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#FF6B35', '#FFB380', '#FBBF24', '#FF6B8A', '#FCD34D'],
    });
  }, 250);
}

/**
 * Jouer le feedback haptique (3 vibrations successives)
 */
async function playHapticFeedback() {
  try {
    // Première vibration
    await Haptics.impact({ style: ImpactStyle.Medium });

    // Deuxième vibration (100ms après)
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.impact({ style: ImpactStyle.Medium });

    // Troisième vibration (100ms après)
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch (error) {
    // Haptics peut ne pas être disponible sur web
    console.log('Haptic feedback non disponible (normal sur web)');
  }
}

/**
 * Jouer une simple vibration de notification
 */
export async function playNotificationHaptic() {
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch (error) {
    console.log('Haptic feedback non disponible');
  }
}
