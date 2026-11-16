// 대기화면 시계: 실제 날짜·시간을 "11/17 TUE" / "09:41" 형식으로 표시한다.
(function () {
  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dateEl = document.querySelector("[data-clock-date]");
  const timeEl = document.querySelector("[data-clock-time]");
  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    const now = new Date();
    dateEl.textContent =
      now.getMonth() + 1 + "/" + now.getDate() + " " + DAYS[now.getDay()];
    timeEl.textContent = pad(now.getHours()) + ":" + pad(now.getMinutes());
    // 다음 분이 시작되는 순간에 맞춰 다시 갱신
    setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 20);
  }

  tick();
})();
