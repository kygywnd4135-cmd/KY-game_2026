// 연극 결과 - 루틴 추천: "연극을 마무리하고 기록하는중..." 로딩 화면.
// 무대 뒤에서 배우들이 한숨 돌리는 모습이 잠깐 나오고, 끝나면 onDone(로비로 복귀)을 부른다.
window.Wrap = (function () {
  const LINE = "오늘은 정말 피곤한 연극이었네!\n이런날엔 달달한 초콜릿이 땡기는걸..";
  const HOLD = 2300; // 대사가 다 나온 뒤 머무는 시간(ms)

  const root = document.querySelector('[data-screen="wrap"]');
  const cast = window.Play.actors;
  const svg = (cls, inner) =>
    `<svg class="${cls}" width="1935" height="1047" viewBox="0 0 1935 1047" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

  root.innerHTML =
    `<p class="wrap__title">연극을 마무리하고 기록하는중<span class="loading__dot">.</span><span class="loading__dot">.</span><span class="loading__dot">.</span></p>` +
    // 동료: 넥타이를 풀어 손에 쥐고 있다
    `<div class="wrap__pal">` +
    svg("", `<g class="wrap__hand wrap__hand--r"><ellipse cx="697.3" cy="933.9" rx="40" ry="49" transform="rotate(-64.9 697.3 933.9)" fill="#03A99B"/></g>
      <circle cx="602.2" cy="843.4" r="119.3" fill="#05E2CF"/>
      <circle cx="577" cy="852" r="38" fill="white"/><circle cx="670" cy="852" r="38" fill="white"/>
      <g class="wrap__pal-pupils"><ellipse cx="588" cy="851.5" rx="27" ry="27.5" fill="#03A99B"/><ellipse cx="681" cy="851.5" rx="27" ry="27.5" fill="#03A99B"/></g>
      <g class="wrap__hand wrap__hand--l"><ellipse cx="545.2" cy="948.8" rx="40" ry="49" transform="rotate(60.8 545.2 948.8)" fill="#03A99B"/></g>
      <path class="wrap__tie" d="M636.7 957.1L618.1 943.2L563.2 984L536.4 979.7L545.9 946.9L613.7 935.1L616.1 912.8L633.2 915L649.6 940.9L636.7 957.1Z" fill="#FF6C6C"/>`) +
    `</div>` +
    // 후임(안경을 벗어 들고), 부장(수염을 머리 위로 올려 쓰고)
    cast.junior + cast.boss +
    `<div class="wrap__bubble"><div class="wrap__bubble-pop">` +
    svg("", `<path d="M535.6 608.8L493.9 373.7L970.6 323L1453.9 373.7L1432.5 568.3L1097.4 639L535.6 608.8Z" fill="#6B6B6B"/><path d="M522.5 591.8L480.9 356.7L957.1 306L1439.9 356.7L1418.5 551.3L1083.8 622L522.5 591.8Z" fill="#F4F4F4"/>`) +
    `<p class="wrap__text" data-wrap-text></p></div></div>` +
    `<div class="hint" style="left:1594px;top:936px"><svg width="59" height="59" viewBox="0 0 59 59" fill="none" aria-hidden="true"><rect width="59" height="59" rx="29.5" fill="#DBDBDB"/><path d="M31.5 28.4H46V31.5H31.5V46H28.4V31.5H14V28.4H28.4V14H31.5V28.4Z" fill="#3D3D3D"/></svg><span class="hint__label">기억해두기</span></div>`;

  const pop = root.querySelector(".wrap__bubble-pop");
  const text = root.querySelector("[data-wrap-text]");
  let typer = null;
  let timers = [];
  let active = false;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearTimers = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };

  function finish() {
    if (!active) return;
    active = false;
    clearTimers();
    if (api.onDone) api.onDone();
  }

  function enter() {
    clearTimers();
    if (typer) typer.cancel();
    active = true;
    Typewriter.clear(text);
    root.classList.remove("is-on");
    void root.offsetWidth;
    root.classList.add("is-on");
    later(() => {
      typer = Typewriter.run([{ el: text, text: LINE }], { onDone: () => later(finish, HOLD) });
    }, 1000);
  }

  function leave() {
    active = false;
    clearTimers();
    if (typer) typer.cancel();
  }

  // 누르면: 글자를 다 보여 주고, 한 번 더 누르면 바로 넘어간다
  function advance() {
    if (typer && !typer.done) typer.finish();
    else finish();
  }

  const api = { enter, leave, advance, onDone: null };
  return api;
})();
