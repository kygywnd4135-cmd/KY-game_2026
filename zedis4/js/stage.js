// 1935×1047 스테이지를 화면 크기에 맞게 축소/확대한다.
// 가로·세로 모두에 맞춰서(남는 쪽은 검은 여백) 화면이 잘리지 않게 한다.
// 단, 다른 페이지 안에 끼워져 높이가 아직 정해지지 않은 경우(높이 0 등)에는 가로에만 맞춘다.
//
// 축소는 CSS zoom 으로 한다(css/base.css). transform: scale 로 줄이면 아이폰 사파리 같은
// 브라우저가 그림을 줄이기 전 크기(1935×1047 × 기기 배율)로 그려 두느라 메모리가 크게 들고,
// 무거운 장면에서 페이지가 저절로 새로고침될 수 있다.
//
// window.Stage: 화면 좌표 ↔ 스테이지 좌표 변환(축소 방식과 상관없이 같은 값을 준다)
//   Stage.point(clientX, clientY) → 포인터 위치 { x, y }
//   Stage.box(el)                 → 요소의 위치·크기 { x, y, w, h }
(function () {
  const W = 1935;
  const H = 1047;
  const root = document.documentElement;
  const frame = document.querySelector(".frame");
  const stage = document.querySelector(".stage");
  let scale = 1;
  // 이보다 낮은 높이는 "아직 정해지지 않은 높이"로 보고 무시한다
  const MIN_USABLE_HEIGHT = 160;

  function fit() {
    // 휴대폰 앱에서 위아래 시스템 막대만큼 들어가는 여백은 빼고 잰다
    const cs = getComputedStyle(root);
    const padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    const vw = root.clientWidth || window.innerWidth;
    const vh = (root.clientHeight || window.innerHeight) - padY;
    scale = vw / W;
    if (vh >= MIN_USABLE_HEIGHT) scale = Math.min(scale, vh / H);
    root.style.setProperty("--scale", scale.toFixed(5));
  }

  window.Stage = {
    get scale() {
      return scale;
    },
    // .frame 은 축소 바깥에 있어서 어느 브라우저에서나 화면 좌표 그대로다
    point(clientX, clientY) {
      const f = frame.getBoundingClientRect();
      return { x: (clientX - f.left) / scale, y: (clientY - f.top) / scale };
    },
    // 스테이지와 요소를 같은 방식으로 재서 비율로 바꾼다
    // (zoom 아래 요소의 크기를 브라우저마다 다르게 돌려줘도 비율은 같다)
    box(el) {
      const s = stage.getBoundingClientRect();
      const k = s.width / W || 1;
      const r = el.getBoundingClientRect();
      return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
    },
  };

  fit();
  window.addEventListener("resize", fit);
})();
