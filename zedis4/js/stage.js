// 1935×1047 스테이지를 화면 크기에 맞게 축소/확대한다.
// 일반 브라우저 창에서는 가로·세로 모두에 맞추고,
// 다른 페이지 안에 끼워진 경우(iframe)는 높이를 믿을 수 없으므로 가로에만 맞춘다.
(function () {
  const W = 1935;
  const H = 1047;
  const root = document.documentElement;
  let embedded = false;
  try {
    embedded = window.self !== window.top;
  } catch (e) {
    embedded = true;
  }

  function fit() {
    const vw = root.clientWidth || window.innerWidth;
    let scale = vw / W;
    if (!embedded && window.innerHeight > 0) {
      scale = Math.min(scale, window.innerHeight / H);
    }
    root.style.setProperty("--scale", scale.toFixed(5));
  }

  fit();
  window.addEventListener("resize", fit);
})();
