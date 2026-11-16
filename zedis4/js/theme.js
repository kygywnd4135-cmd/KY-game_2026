// 화면 테마: 일반 모드 / 야간 모드.
// 야간 모드는 <html>에 is-night 를 붙이고, 색은 css/night.css가 바꾼다.
// 고른 모드는 이 브라우저에 기억해 두어서 새로고침해도 유지된다(저장이 막혀 있으면 일반 모드).
window.Theme = (function () {
  const KEY = "zedis4-theme";
  let mode = "day";
  try {
    if (localStorage.getItem(KEY) === "night") mode = "night";
  } catch (err) {}

  function apply() {
    document.documentElement.classList.toggle("is-night", mode === "night");
  }

  function set(next) {
    mode = next === "night" ? "night" : "day";
    try {
      localStorage.setItem(KEY, mode);
    } catch (err) {}
    // 바뀌는 순간만 색이 부드럽게 넘어가도록
    document.documentElement.classList.add("is-theming");
    apply();
    clearTimeout(set.t);
    set.t = setTimeout(() => document.documentElement.classList.remove("is-theming"), 450);
  }

  apply();
  return { get: () => mode, set };
})();
