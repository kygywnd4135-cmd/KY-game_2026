// 1935×1047 스테이지를 화면 크기에 맞게 축소/확대한다.
(function () {
  const W = 1935;
  const H = 1047;
  const root = document.documentElement;

  function fit() {
    const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
    root.style.setProperty("--scale", scale.toFixed(5));
  }

  fit();
  window.addEventListener("resize", fit);
})();
