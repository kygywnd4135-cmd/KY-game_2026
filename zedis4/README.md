# 제디스4 — UI 프로토타입

피그마 「제디스4」(UI 플로우 섹션)를 화면별로 옮겨 만든 웹 프로토타입이에요.
빌드 도구 없이 HTML · CSS · JavaScript 파일만으로 돌아가요.

- 미리보기(발표용 링크): https://claude.ai/artifact/KQUkjY6aZyKQwHsbcXYKU7
- 글꼴: SUITE (`fonts/`, 라이선스는 `fonts/SUITE-LICENSE.txt`)
- 화면 크기: 1935 × 1047 반원 무대. 창 크기에 맞춰 자동으로 줄어들어요(`js/stage.js`).

## 실행해 보기

`index.html`을 브라우저로 열면 돼요. 글꼴까지 제대로 보려면 간단한 서버로 여는 게 좋아요.

```bash
cd zedis4
python3 -m http.server 4173
```

그다음 브라우저에서 http://localhost:4173 을 열어요.

## 조작

| 키 / 터치 | 동작 |
|---|---|
| 아무 키 · 터치 | 다음 장면, 글자 출력 중이면 바로 다 보이기 |
| Esc | 대기화면~펜 로딩에서 로비로 건너뛰기, 각 메뉴에서 로비로 |
| ← / → · 좌우로 밀기 | 로비와 각 메뉴의 다이얼 돌리기 |
| Enter · ＋ | 고르기 / 저장 |
| − · Esc | 뒤로 |
| Alt · 스페이스바 | 대사 수정 마치기, 별점 화면에서 로비로 |

## 화면 흐름

대기화면 → 전원 1~3 → 펜 로딩 → **로비**

로비 다이얼에서 고르는 메뉴는 이래요.

- 파랑 "오늘의 기록 준비 완료!": 대화1 → 대화2(시나리오 총정리) → 연극 → 연극 결과 연결 → 수정 시점 선택 → 등장인물 행동 수정 → 작별 인사 → 루틴 추천 → 별점·비슷한 시나리오 → 로비(알림창3)
- 보라 "오늘의 키워드를 확인하기": 키워드 메모
- 빨강 "오늘의 추천 시나리오": 다른 사람 이야기 다이얼
- 주황 "주간 키워드 확인하기": 지난 기록(날짜 다이얼)
- 연보라 "내 에피소드 다시보기": 지난스토리 리플레이(삭제 알림창)
- 초록 "커스터마이징 숍": 장식·색 바꾸기
- 청록 "세부 설정": 기본 설정 / 데이터 관리 / 테마(일반·야간 모드)

## 파일 구조

```
zedis4/
├── index.html        모든 화면의 뼈대(화면마다 <section data-screen="…">)
├── css/
│   ├── base.css      공통 토큰·반원 무대·글자 출력 효과
│   ├── night.css     야간 모드 색
│   ├── alert.css     공용 알림창
│   └── <화면>.css    화면마다 하나
├── js/
│   ├── flow.js       화면 순서와 키·터치 입력(전체 흐름의 중심)
│   ├── stage.js      화면 크기 맞추기, 좌표 변환
│   ├── typewriter.js 한 글자씩 출력
│   ├── alert.js      공용 알림창(메뉴 캐릭터 색을 따라감)
│   ├── theme.js      일반/야간 모드
│   └── <화면>.js     화면마다 하나(로비, 키워드, 설정 …)
├── fonts/            SUITE 글꼴
└── tools/bundle.py   미리보기용 한 파일 HTML 만들기
```

## 자주 고치는 곳

- **임시 문구·데이터**: 각 화면 JS 맨 위의 목록만 고치면 돼요.
  - 추천 시나리오: `js/recommend.js`의 `STORIES`
  - 지난 기록: `js/history.js`의 `DAYS`
  - 리플레이: `js/replay.js`의 `EPISODES`
  - 커스터마이징: `js/custom.js`의 `ITEMS`, `COLORS`, `LINES`
  - 세부 설정: `js/settings.js`의 `SECTIONS`, `DATA_SECTIONS`, `THEME_SECTIONS`
- **새 화면 추가**: `index.html`에 `<section class="screen screen--이름" data-screen="이름">`을 넣고,
  `css/이름.css`, `js/이름.js`를 만든 뒤 `js/flow.js`의 `STEPS`와 입력 처리에 연결해요.
- **알림창 띄우기**: `Alert.open(화면요소, { theme: "로비 캐릭터 id", text, buttons })`

## 미리보기 한 파일로 묶기

발표 링크처럼 CSS·JS·글꼴을 HTML 하나에 다 넣은 파일이 필요하면:

```bash
python3 tools/bundle.py 미리보기.html
```
