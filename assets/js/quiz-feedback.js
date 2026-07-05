/**
 * Feedback visual al acertar/fallar (anime.js + fallback CSS).
 */
const QuizFeedback = (() => {
  function hasAnime() {
    return typeof anime === 'function';
  }

  function shake(el, intensity = 6) {
    if (!el) return;
    if (hasAnime()) {
      anime({
        targets: el,
        translateX: [0, -intensity, intensity, -intensity * 0.6, intensity * 0.6, 0],
        duration: 450,
        easing: 'easeInOutSine',
      });
      return;
    }
    el.classList.remove('cq-shake');
    void el.offsetWidth;
    el.classList.add('cq-shake');
  }

  function ensureOverlay(container) {
    if (!container) return null;
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
    let overlay = container.querySelector(':scope > .wrong-red-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'wrong-red-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      container.appendChild(overlay);
    }
    return overlay;
  }

  function flashRed(container, selectedEl) {
    const overlay = ensureOverlay(container);
    if (overlay) {
      overlay.classList.remove('is-active');
      void overlay.offsetWidth;
      overlay.classList.add('is-active');
      setTimeout(() => overlay.classList.remove('is-active'), 680);
    }

    if (selectedEl) {
      selectedEl.classList.remove('wrong-red-pulse');
      void selectedEl.offsetWidth;
      selectedEl.classList.add('wrong-red-pulse', 'incorrect');

      if (hasAnime()) {
        anime({
          targets: selectedEl,
          backgroundColor: [
            { value: 'rgba(232, 115, 122, 0.55)', duration: 180 },
            { value: 'rgba(232, 115, 122, 0.22)', duration: 420 },
          ],
          scale: [1, 0.97, 1],
          easing: 'easeOutQuad',
        });
      }
    }

    if (container) {
      container.classList.add('quiz-wrong-flash');
      setTimeout(() => container.classList.remove('quiz-wrong-flash'), 680);
    }
  }

  function wrong(selectedEl, correctEl, container) {
    shake(selectedEl, 10);
    flashRed(container, selectedEl);

    if (correctEl) {
      setTimeout(() => correctEl.classList.add('correct-reveal'), 220);
    }

    if (hasAnime() && container) {
      anime({
        targets: container,
        translateX: [0, -6, 6, -4, 4, 0],
        duration: 450,
        easing: 'easeInOutQuad',
      });
    }
  }

  function correct(selectedEl) {
    if (!selectedEl) return;
    if (hasAnime()) {
      anime({
        targets: selectedEl,
        scale: [1, 1.03, 1],
        duration: 350,
        easing: 'easeOutQuad',
      });
    } else {
      selectedEl.classList.add('correct-pop');
    }
  }

  function matchWrong(zone, item) {
    shake(zone, 6);
    shake(item, 6);
    zone.classList.add('match-drop-wrong');
    item.classList.add('match-drag-wrong', 'wrong-red-pulse');
    SoundFX?.wrong?.();

    if (hasAnime()) {
      anime({
        targets: [zone, item],
        backgroundColor: [
          { value: 'rgba(232, 115, 122, 0.4)', duration: 200 },
          { value: 'rgba(232, 115, 122, 0.08)', duration: 400 },
        ],
        easing: 'easeOutQuad',
      });
    }

    setTimeout(() => {
      zone.classList.remove('match-drop-wrong');
      item.classList.remove('match-drag-wrong', 'wrong-red-pulse');
    }, 650);
  }

  return { wrong, correct, matchWrong, shake };
})();
