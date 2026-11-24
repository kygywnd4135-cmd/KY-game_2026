// 시계: 실제 날짜·시간을 화면 곳곳에 표시한다.
//  - 대기화면:  "11/17 TUE" / "09:41"
//  - 왼쪽 아래: "11/17 Tue. 9:41"
(function () {
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const pad = (n) => String(n).padStart(2, "0");
  const setAll = (selector, text) =>
    document.querySelectorAll(selector).forEach((el) => (el.textContent = text));

  function tick() {
    const now = new Date();
    const md = now.getMonth() + 1 + "/" + now.getDate();
    const day = DAYS[now.getDay()];

    setAll("[data-clock-date]", md + " " + day.toUpperCase());
    setAll("[data-clock-time]", pad(now.getHours()) + ":" + pad(now.getMinutes()));
    setAll("[data-clock-short]", md + " " + day + ". " + now.getHours() + ":" + pad(now.getMinutes()));

    // 다음 분이 시작되는 순간에 맞춰 다시 갱신
    setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 20);
  }

  tick();
})();
