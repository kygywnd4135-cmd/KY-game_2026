// 화면 테마: 일반 모드 / 야간 모드.
// 야간 모드는 <html>에 is-night 를 붙이고, 색은 css/night.css가 바꾼다.
// 링크를 열면 언제나 일반 모드로 시작한다(어느 컴퓨터에서 열어도 같다).
// 야간 모드는 설정에서 바꾼 그때만 유지되고, 새로고침하면 다시 일반 모드.
window.Theme = (function () {
  let mode = "day";
  // 예전 버전이 남겨 둔 기억값은 지운다
  try {
    localStorage.removeItem("zedis4-theme");
  } catch (err) {}

  function apply() {
    document.documentElement.classList.toggle("is-night", mode === "night");
  }

  function set(next) {
    mode = next === "night" ? "night" : "day";
    // 바뀌는 순간만 색이 부드럽게 넘어가도록
    document.documentElement.classList.add("is-theming");
    apply();
    clearTimeout(set.t);
    set.t = setTimeout(() => document.documentElement.classList.remove("is-theming"), 450);
  }

  apply();
  return { get: () => mode, set };
})();
