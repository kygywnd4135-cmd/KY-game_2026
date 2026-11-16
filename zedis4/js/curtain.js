// 화면전환: 캐릭터 둘(민트·파랑)이 양쪽에서 커튼을 촤라락 끌어와 닫는다.
// 다 닫히면 onDone 을 부른다(js/flow.js가 암전 후 연극으로 넘긴다).
window.Curtain = (function () {
  const root = document.querySelector('[data-screen="curtain"]');
  const CLOSE_TIME = 1900; // 커튼이 다 닫히고 잠깐 머문 뒤(ms)

  const stageSvg = (inner) =>
    `<svg width="1935" height="1047" viewBox="0 0 1935 1047" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

  // 먼지 뭉치: 원 몇 개를 겹쳐 만든다
  const puff = (x, y, s, i) =>
    `<g class="cur__puff" style="--i:${i}" transform="translate(${x} ${y}) scale(${s})" fill="#ABABAB">` +
    `<g class="cur__puff-pop"><circle cx="0" cy="0" r="24"/><circle cx="24" cy="-12" r="15"/><circle cx="-22" cy="10" r="15"/><circle cx="14" cy="18" r="18"/><circle cx="-10" cy="-20" r="14"/></g></g>`;

  root.innerHTML =
    // ── 왼쪽 커튼 + 민트 ──
    `<div class="cur cur--l">` +
    stageSvg(
      `<defs>
        <linearGradient id="curGradL" x1="-159" y1="478" x2="900.83" y2="478" gradientUnits="userSpaceOnUse"><stop/><stop offset="1" stop-color="#5A0002"/></linearGradient>
        <linearGradient id="curFoldL" x1="590" y1="-50" x2="590" y2="903" gradientUnits="userSpaceOnUse"><stop stop-color="#360A0A" stop-opacity="0"/><stop offset="1" stop-color="#240101"/></linearGradient>
      </defs>
      <path d="M801.5 427.67C756.7 246.47 756.17 74.84 761.5 11.67C593.17 -27.65 207.1 -46.42 9.5 193.17C-188.09 432.77 -171.82 760.34 -138.99 894.17C-79.16 918.17 64.3 966.47 159.5 967.67C278.5 969.17 590.5 883.67 674 898.17C757.5 912.67 795.5 958.17 839.5 948.67C883.5 939.17 905.5 926.17 900 819.67C894.5 713.17 857.5 654.17 801.5 427.67Z" fill="url(#curGradL)"/>
      <path d="M-2000 -200H-120V1300H-2000Z" fill="#000"/>
      <path d="M567.88 300.48C564.17 443.64 649.75 750.16 693 885.52C688.5 881.71 675.13 873.47 657.61 871.06C640.08 868.65 544.99 891.35 499.63 903L487 414.96C498.23 338.44 541.68 149.49 625.59 5.85C730.49 -173.69 572.51 121.54 567.88 300.48Z" fill="url(#curFoldL)"/>
      <path d="M248.88 329.48C245.17 472.64 330.75 779.16 374 914.52C369.5 910.71 356.13 902.47 338.61 900.06C321.08 897.65 225.99 920.35 180.63 932L168 443.96C179.23 367.44 222.68 178.49 306.59 34.85C411.49 -144.69 253.51 150.54 248.88 329.48Z" fill="#2D0000"/>` +
        puff(655, 495, 1.5, 0) + puff(630, 635, 0.95, 1) + puff(517, 538, 0.72, 2)
    ) +
    `<div class="cur__runner cur__runner--mint">` +
    stageSvg(
      `<circle cx="828" cy="412" r="86" fill="#60FFCA"/>
      <path d="M870.97 551.69L831 514.35C845.19 509.31 850.56 503.56 868.5 517.09C882.85 527.91 876.13 544.66 870.97 551.69Z" fill="#03A99B"/>
      <path d="M745 552.49L749.76 498C762.48 506.07 770.32 506.75 770.73 529.22C771.05 547.19 753.71 552.22 745 552.49Z" fill="#03A99B"/>
      <circle cx="742" cy="321" r="17" fill="#03A99B"/>
      <path d="M838 411C838 412.44 837.39 413.87 836.21 415.21C835.03 416.54 833.29 417.75 831.11 418.77C828.93 419.8 826.34 420.61 823.49 421.16C820.64 421.71 817.58 422 814.5 422C811.41 422 808.35 421.71 805.5 421.16C802.65 420.61 800.06 419.8 797.88 418.77C795.7 417.75 793.97 416.54 792.78 415.21C791.6 413.87 791 412.44 791 411L814.5 411H838Z" fill="#03A99B"/>
      <circle cx="882.5" cy="411.5" r="26.5" fill="white"/>
      <circle cx="890" cy="411" r="19" fill="#03A99B"/>`
    ) +
    `</div></div>` +
    // ── 오른쪽 커튼 + 파랑 ──
    `<div class="cur cur--r">` +
    stageSvg(
      `<defs>
        <linearGradient id="curGradR" x1="2073.83" y1="466" x2="1014" y2="466" gradientUnits="userSpaceOnUse"><stop/><stop offset="1" stop-color="#5A0002"/></linearGradient>
        <linearGradient id="curFoldR" x1="1345" y1="-53" x2="1345" y2="900" gradientUnits="userSpaceOnUse"><stop stop-color="#360A0A" stop-opacity="0"/><stop offset="1" stop-color="#240101"/></linearGradient>
      </defs>
      <path d="M1113.33 415.67C1158.13 234.47 1158.66 62.84 1153.33 -0.32C1321.66 -39.65 1707.73 -58.42 1905.33 181.17C2102.93 420.77 2086.66 748.34 2053.83 882.17C1994 906.17 1850.53 954.47 1755.33 955.67C1636.33 957.17 1324.33 871.67 1240.83 886.17C1157.33 900.67 1119.33 946.17 1075.33 936.67C1031.33 927.17 1009.33 914.17 1014.83 807.67C1020.33 701.17 1057.33 642.17 1113.33 415.67Z" fill="url(#curGradR)"/>
      <path d="M2040 -200H3900V1300H2040Z" fill="#000"/>
      <path d="M1367.12 297.48C1370.82 440.64 1285.25 747.16 1242 882.52C1246.49 878.71 1259.86 870.47 1277.39 868.06C1294.91 865.65 1390.01 888.35 1435.36 900L1448 411.96C1436.77 335.44 1393.32 146.49 1309.4 2.85C1204.51 -176.69 1362.48 118.54 1367.12 297.48Z" fill="url(#curFoldR)"/>
      <path d="M1686.12 326.48C1689.82 469.64 1604.25 776.16 1561 911.52C1565.49 907.71 1578.86 899.47 1596.39 897.06C1613.91 894.65 1709.01 917.35 1754.36 929L1767 440.96C1755.77 364.44 1712.32 175.49 1628.4 31.85C1523.51 -147.69 1681.48 147.54 1686.12 326.48Z" fill="#2D0000"/>` +
        puff(1255, 962, 1.5, 0) + puff(1345, 852, 0.8, 1) + puff(1396, 993, 0.62, 2)
    ) +
    `<div class="cur__runner cur__runner--blue">` +
    stageSvg(
      `<circle cx="1100" cy="880" r="86" fill="#1871ED"/>
      <path d="M983.99 953.24L1032.28 978.96C1032.45 963.89 1036.15 956.95 1017.54 944.36C1002.65 934.29 988.97 946.08 983.99 953.24Z" fill="#1949AB"/>
      <path d="M1149.61 1018.88L1185.72 977.78C1171.09 974.16 1165.18 968.97 1148.66 984.19C1135.45 996.37 1143.79 1012.39 1149.61 1018.88Z" fill="#1949AB"/>
      <ellipse cx="1048" cy="880" rx="21" ry="29" fill="white"/>
      <ellipse cx="1048.5" cy="879.5" rx="14.5" ry="20.5" fill="#1949AB"/>
      <circle cx="1186" cy="789" r="17" fill="#1949AB"/>`
    ) +
    `</div></div>`;

  let timer = 0;
  let active = false;

  function finish() {
    if (!active) return;
    active = false;
    clearTimeout(timer);
    if (api.onDone) api.onDone();
  }

  function enter() {
    active = true;
    root.classList.remove("is-closing");
    void root.offsetWidth;
    root.classList.add("is-closing");
    clearTimeout(timer);
    timer = setTimeout(finish, CLOSE_TIME);
  }

  function leave() {
    active = false;
    clearTimeout(timer);
  }

  // 누르면 기다리지 않고 바로 다음으로
  const api = { enter, leave, advance: finish, onDone: null };
  return api;
})();
