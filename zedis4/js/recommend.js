// 로비 - 오늘의 추천 시나리오: 다른 사람들의 이야기를 다이얼로 돌려 보는 화면.
// 로비와 같은 다이얼 조작:
//   ← / →, 좌우로 밀기   다이얼 돌리기(→ 는 시계 방향)
//   썸네일 누르기          그 이야기로 돌리기
//   Enter / ＋           선택(지금은 통! 튀기만 한다)
//   − / Esc              로비로 돌아가기
// 이야기 내용은 임시다. STORIES만 고치면 된다(배열 순서 = 다이얼 왼쪽 아래부터 시계 방향).
window.Recommend = (function () {
  // 썸네일 그림(피그마 그대로). 모두 정사각형 그림이고, 화면에서는 동그랗게 잘라 보여 준다.
  const ART = {
    dizzy: `<svg width="289" height="289" viewBox="0 0 289 289" fill="none"><rect width="289" height="289" fill="#EFFDB8"/><circle cx="210.5" cy="235.5" r="108.5" fill="#FFDBAF"/><circle cx="54" cy="57" r="70" fill="#FFDBAF"/><ellipse cx="145.1" cy="144.5" rx="98.1" ry="100.5" fill="#FFACCE"/><circle cx="98.8" cy="152" r="32" fill="white"/><circle cx="177.1" cy="152" r="32" fill="white"/><ellipse cx="103.5" cy="142.5" rx="23.3" ry="22.5" fill="#E18ABB"/><ellipse cx="174.8" cy="161.1" rx="22.5" ry="22.9" fill="#E18ABB"/><path d="M178.6 146.8C178.5 146.8 177.4 147 174.6 147.6C166.3 149.6 165.2 150.7 164 151.1C162.8 151.6 163.1 153.4 162.3 155.4C161 159.1 159.4 161.5 159.3 162.1C159.2 163.3 160.2 164.9 161.5 167.5C162.3 169.2 163.7 171.3 165.1 172.7C168 175.7 172.7 174.8 175.6 175.2C176.9 175.3 177.8 175.4 178.5 175.3C181.4 174.8 185 170.2 186.4 168.5C188.9 165.5 187.3 157.5 187.2 155.5C187.2 154.6 185.8 154.6 184.4 154.1C183.1 153.6 182.1 152.9 181.6 152.7C180.3 152.2 179.2 153.2 174 155.3C171.6 156.2 170.3 158.7 169.2 160.5C168.2 162.2 167.2 164.2 167.2 164.8C167.2 166 169.1 166.6 171 167.6C172.1 168.1 172.8 168.6 173.5 168.8C176.5 169.3 180.1 166.5 181 165.5C182 164.5 181.5 161.8 181.3 159.2C181.2 158.3 180.6 158.3 180.2 158.4C178.7 158.5 177.6 158.7 176.8 158.8C176.5 158.9 176.2 159 175.9 159" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M108.2 127C108 127 107 127.2 104.1 127.9C95.9 129.9 94.8 130.9 93.6 131.4C92.3 131.8 92.7 133.6 91.9 135.6C90.5 139.3 88.9 141.7 88.9 142.3C88.8 143.5 89.8 145.1 91.1 147.7C91.9 149.4 93.2 151.5 94.6 152.9C97.6 156 102.3 155.1 105.2 155.4C106.4 155.5 107.4 155.6 108.1 155.5C111 155 114.6 150.4 116 148.7C118.5 145.7 116.9 137.7 116.8 135.7C116.8 134.8 115.4 134.8 113.9 134.3C112.7 133.8 111.7 133.2 111.1 132.9C109.9 132.4 108.7 133.4 103.6 135.5C101.2 136.5 99.8 138.9 98.8 140.7C97.8 142.4 96.8 144.4 96.8 145.1C96.8 146.2 98.7 146.8 100.6 147.8C101.7 148.3 102.4 148.9 103 149C106 149.5 109.6 146.7 110.6 145.7C111.5 144.7 111.1 142 110.8 139.4C110.8 138.5 110.2 138.6 109.8 138.6C108.3 138.7 107.1 138.9 106.4 139.1C106 139.1 105.8 139.2 105.5 139.2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="53.5" cy="210.6" rx="28" ry="36.5" transform="rotate(-30 53.5 210.6)" fill="#E18ABB"/><ellipse cx="28" cy="36.5" rx="28" ry="36.5" transform="matrix(-0.866 -0.5 -0.5 0.866 262 193)" fill="#E18ABB"/></svg>`,
    blue: `<svg width="289" height="289" viewBox="0 0 289 289" fill="none"><rect width="289" height="289" fill="#B1CCFF"/><path d="M284.2 19.5C285 9.7 296.5 5 303.9 11.4L358.3 58.2C361.2 60.7 365.1 61.6 368.8 60.8L438.6 44.4C448.1 42.2 456.2 51.7 452.4 60.7L424.7 126.8C423.2 130.4 423.5 134.4 425.5 137.7L462.7 199C467.7 207.4 461.2 218 451.4 217.2L380 211.3C376.1 210.9 372.4 212.5 369.9 215.4L323.1 269.6C316.7 277 304.5 274.1 302.3 264.5L285.8 194.8C285 191 282.4 188 278.8 186.5L212.7 158.7C203.7 154.9 202.8 142.5 211.2 137.4L272.4 100.2C275.7 98.2 277.8 94.7 278.2 90.9L284.2 19.5Z" fill="#88B1FC"/><path d="M46.2 19.5C47 9.7 58.5 5 65.9 11.4L120.3 58.2C123.2 60.7 127.1 61.6 130.8 60.8L200.6 44.4C210.1 42.2 218.2 51.7 214.4 60.7L186.7 126.8C185.2 130.4 185.5 134.4 187.5 137.7L224.7 199C229.7 207.4 223.2 218 213.4 217.2L142 211.3C138.1 210.9 134.4 212.5 131.9 215.4L85.1 269.6C78.7 277 66.5 274.1 64.3 264.5L47.8 194.8C47 191 44.4 188 40.8 186.5L-25.2 158.7C-34.2 154.9 -35.1 142.5 -26.7 137.4L34.4 100.2C37.7 98.2 39.8 94.7 40.2 90.9L46.2 19.5Z" fill="#88B1FC"/><path d="M126.1 245.1L75.9 278.7C74.2 262.5 69.5 255.5 88.6 239.6C103.9 227 119.9 238 126.1 245.1Z" fill="#3B81B4"/><path d="M106.9 296.3L168 301C161.3 286 162 277.5 137.2 273.1C117.4 269.6 108.8 287.1 106.9 296.3Z" fill="#3B81B4"/><ellipse cx="175.4" cy="140.3" rx="98.1" ry="98.3" fill="#BDE5FF"/><circle cx="35.6" cy="35.6" r="35.6" transform="matrix(-0.986 -0.164 -0.164 0.986 236.1 108.6)" fill="white"/><path d="M141.3 131.8C142 136.4 141.9 141.2 140.9 145.7C139.8 150.3 137.9 154.6 135.2 158.4C132.5 162.3 129 165.5 125.1 168C121.1 170.5 116.7 172.2 112.1 173C107.4 173.8 102.7 173.6 98.1 172.6C93.6 171.5 89.3 169.6 85.4 166.9C81.6 164.2 78.4 160.7 75.9 156.8C73.4 152.8 71.7 148.4 70.9 143.8L106.1 137.8L141.3 131.8Z" fill="white"/><circle cx="23.9" cy="23.9" r="23.9" transform="matrix(-0.986 -0.164 -0.164 0.986 222.5 118.2)" fill="#3B81B4"/><path d="M129.7 133.8C130.2 136.9 130.1 140.1 129.4 143.1C128.7 146.2 127.4 149.1 125.6 151.6C123.8 154.2 121.5 156.4 118.8 158C116.1 159.7 113.2 160.8 110.1 161.4C107 161.9 103.8 161.8 100.8 161.1C97.7 160.4 94.8 159.1 92.3 157.3C89.7 155.5 87.5 153.2 85.8 150.5C84.2 147.9 83 144.9 82.5 141.8L106.1 137.8L129.7 133.8Z" fill="#3B81B4"/><path d="M21.5 107.4C21.8 100 28.1 94.3 35.7 94.1C36.4 86.5 42.7 80.8 50.1 81.1C57.4 81.4 63.2 87.6 63.4 95.2L62.3 123L34.5 121.9C27 121 21.2 114.8 21.5 107.4Z" fill="#466EFF"/></svg>`,
    wink: `<svg width="289" height="289" viewBox="0 0 289 289" fill="none"><rect width="289" height="289" fill="#FDAA62"/><circle cx="210.5" cy="235.5" r="108.5" fill="#FFCC73"/><circle cx="54" cy="57" r="70" fill="#FFCC73"/><path d="M227.4 258.1L155 201.6C177.6 191.5 185.5 181.3 217.5 201.4C243.1 217.4 234.7 245.9 227.4 258.1Z" fill="#18B07D"/><circle cx="144.5" cy="135.5" r="90.5" fill="#3CDFA9"/><ellipse cx="59.5" cy="181.6" rx="28" ry="36.5" transform="rotate(-30 59.5 181.6)" fill="#18B07D"/><ellipse cx="103.5" cy="126.5" rx="33.5" ry="32.5" fill="white"/><ellipse cx="113" cy="130.5" rx="24" ry="22.5" fill="#299F78"/><path d="M203 124L155.6 140.5C154.1 141 153.8 143.1 155.1 144L186.3 166" stroke="#299F78" stroke-width="6" stroke-linecap="round"/><path d="M236.5 74.4C238.6 73.4 241 75.3 240.7 77.6L239 87.9C238.9 88.8 239.2 89.7 239.8 90.3L246.7 98.1C248.3 99.9 247.3 102.7 244.9 103.1L234.7 104.7C233.8 104.8 233 105.4 232.5 106.1L227.3 115.1C226.1 117.2 223.1 117.1 222.1 115L217.3 105.7C216.9 104.9 216.2 104.4 215.3 104.2L205.1 102C202.8 101.5 202 98.6 203.6 96.9L211 89.6C211.6 88.9 211.9 88 211.8 87.1L210.8 76.8C210.5 74.4 213 72.7 215.1 73.8L224.4 78.5C225.2 78.9 226.1 79 227 78.6L236.5 74.4Z" fill="#299F78"/></svg>`,
    teacher: `<svg width="411" height="411" viewBox="0 0 411 411" fill="none"><rect width="411" height="411" fill="#27C5FF"/><circle cx="198.5" cy="327.5" r="108.5" fill="#008CE9"/><path d="M46.2 19.5C47 9.7 58.5 5 65.9 11.4L120.3 58.2C123.2 60.7 127.1 61.6 130.8 60.8L200.6 44.4C210.1 42.2 218.2 51.7 214.4 60.7L186.7 126.8C185.2 130.4 185.5 134.4 187.5 137.7L224.7 199C229.7 207.4 223.2 218 213.4 217.2L142 211.3C138.1 210.9 134.4 212.5 131.9 215.4L85.1 269.6C78.7 277 66.5 274.1 64.3 264.5L47.8 194.8C47 191 44.4 188 40.8 186.5L-25.2 158.7C-34.2 154.9 -35.1 142.5 -26.7 137.4L34.4 100.2C37.7 98.2 39.8 94.7 40.2 90.9L46.2 19.5Z" fill="#FFC61C"/><path d="M284.2 19.5C285 9.7 296.5 5 303.9 11.4L358.3 58.2C361.2 60.7 365.1 61.6 368.8 60.8L438.6 44.4C448.1 42.2 456.2 51.7 452.4 60.7L424.7 126.8C423.2 130.4 423.5 134.4 425.5 137.7L462.7 199C467.7 207.4 461.2 218 451.4 217.2L380 211.3C376.1 210.9 372.4 212.5 369.9 215.4L323.1 269.6C316.7 277 304.5 274.1 302.3 264.5L285.8 194.8C285 191 282.4 188 278.8 186.5L212.7 158.7C203.7 154.9 202.8 142.5 211.2 137.4L272.4 100.2C275.7 98.2 277.8 94.7 278.2 90.9L284.2 19.5Z" fill="#FFC61C"/><path d="M30.7 301.3L121.2 316.5C106.1 336.2 104 348.9 66.3 346.5C36.2 344.6 30 315.5 30.7 301.3Z" fill="#8A024F"/><path d="M278.3 399H371.5C359.7 377 359.7 364.1 321.6 360.3C291.2 357.2 280.1 384.8 278.3 399Z" fill="#8A024F"/><ellipse cx="259.5" cy="204.5" rx="149.2" ry="149.5" fill="#FF1777"/><path d="M227 226.6C229.4 233.3 233.2 239.5 238.1 244.7C242.9 249.9 248.7 254.1 255.2 257.1C261.7 260 268.7 261.7 275.8 262C282.9 262.2 290 261.1 296.7 258.6C303.4 256.1 309.5 252.4 314.7 247.5C320 242.7 324.2 236.8 327.1 230.3C330.1 223.9 331.8 216.9 332 209.7C332.3 202.6 331.2 195.5 328.7 188.8L277.8 207.7L227 226.6Z" fill="white"/><path d="M203.3 227.4C200.6 234 196.6 240 191.5 245C186.5 250.1 180.5 254.1 173.9 256.8C167.3 259.5 160.3 260.9 153.2 260.9C146 260.9 139 259.5 132.4 256.8C125.8 254.1 119.8 250.1 114.8 245.1C109.7 240 105.7 234 103 227.5C100.3 220.9 98.9 213.8 98.9 206.7C98.9 199.6 100.3 192.5 103 185.9L153.1 206.7L203.3 227.4Z" fill="white"/><path d="M243.7 220.4C245.4 224.9 247.9 229 251.2 232.5C254.4 236 258.3 238.8 262.7 240.8C267 242.8 271.7 243.9 276.5 244.1C281.2 244.3 286 243.5 290.5 241.8C295 240.2 299.1 237.6 302.6 234.4C306.1 231.1 308.9 227.2 310.9 222.9C312.9 218.6 314 213.9 314.1 209.1C314.3 204.3 313.6 199.6 311.9 195.1L277.8 207.7L243.7 220.4Z" fill="#8A024F"/><path d="M186.7 220.6C184.9 225 182.2 229 178.9 232.4C175.5 235.7 171.5 238.4 167.1 240.2C162.7 242.1 157.9 243 153.2 243C148.4 243 143.6 242.1 139.2 240.3C134.8 238.4 130.8 235.8 127.4 232.4C124.1 229 121.4 225 119.6 220.6C117.7 216.2 116.8 211.5 116.8 206.7C116.8 201.9 117.7 197.2 119.5 192.8L153.1 206.7L186.7 220.6Z" fill="#8A024F"/><rect x="-1.7" y="1.7" width="95.3" height="37.9" rx="3.2" transform="matrix(-1 0 0 1 308.5 137)" fill="black" fill-opacity="0.7" stroke="black" stroke-width="3.5"/><rect x="-1.7" y="1.7" width="76.8" height="37.9" rx="3.2" transform="matrix(-1 0 0 1 186.1 137)" fill="black" fill-opacity="0.7" stroke="black" stroke-width="3.5"/><path d="M215 159.7C211.2 153.8 200.5 145.4 188.3 159.7" stroke="black" stroke-width="3.5" stroke-linecap="round"/><path d="M309.9 155.8L359 177.6L365.2 195.3" stroke="black" stroke-width="6" stroke-linecap="round"/></svg>`,
    purple: `<svg width="289" height="289" viewBox="0 0 289 289" fill="none"><rect width="289" height="289" fill="#BAFFA7"/><path d="M284.2 19.5C285 9.7 296.5 5 303.9 11.4L358.3 58.2C361.2 60.7 365.1 61.6 368.8 60.8L438.6 44.4C448.1 42.2 456.2 51.7 452.4 60.7L424.7 126.8C423.2 130.4 423.5 134.4 425.5 137.7L462.7 199C467.7 207.4 461.2 218 451.4 217.2L380 211.3C376.1 210.9 372.4 212.5 369.9 215.4L323.1 269.6C316.7 277 304.5 274.1 302.3 264.5L285.8 194.8C285 191 282.4 188 278.8 186.5L212.7 158.7C203.7 154.9 202.8 142.5 211.2 137.4L272.4 100.2C275.7 98.2 277.8 94.7 278.2 90.9L284.2 19.5Z" fill="#B0E6FF"/><path d="M46.2 19.5C47 9.7 58.5 5 65.9 11.4L120.3 58.2C123.2 60.7 127.1 61.6 130.8 60.8L200.6 44.4C210.1 42.2 218.2 51.7 214.4 60.7L186.7 126.8C185.2 130.4 185.5 134.4 187.5 137.7L224.7 199C229.7 207.4 223.2 218 213.4 217.2L142 211.3C138.1 210.9 134.4 212.5 131.9 215.4L85.1 269.6C78.7 277 66.5 274.1 64.3 264.5L47.8 194.8C47 191 44.4 188 40.8 186.5L-25.2 158.7C-34.2 154.9 -35.1 142.5 -26.7 137.4L34.4 100.2C37.7 98.2 39.8 94.7 40.2 90.9L46.2 19.5Z" fill="#B1E6FF"/><ellipse cx="162.2" cy="212" rx="95.7" ry="98" fill="#A555FB"/><ellipse cx="108.6" cy="212" rx="33.5" ry="33.2" fill="white"/><ellipse cx="183.5" cy="212" rx="33.5" ry="33.2" fill="white"/><ellipse cx="104.9" cy="202.1" rx="23.9" ry="23.1" fill="#661FA4"/><ellipse cx="180.4" cy="202.1" rx="23.9" ry="23.1" fill="#661FA4"/><path d="M230.8 273.6L304.1 242.1C283.7 220.1 277.1 204.8 245.2 213.1C219.6 219.8 224.9 256.2 230.8 273.6Z" fill="#661FA4"/><ellipse cx="55.5" cy="127.6" rx="28" ry="36.5" transform="rotate(5.8 55.5 127.6)" fill="#661FA4"/></svg>`,
    orange: `<svg width="289" height="289" viewBox="0 0 289 289" fill="none"><rect width="289" height="289" fill="#FF9CC5"/><path d="M284.2 19.5C285 9.7 296.5 5 303.9 11.4L358.3 58.2C361.2 60.7 365.1 61.6 368.8 60.8L438.6 44.4C448.1 42.2 456.2 51.7 452.4 60.7L424.7 126.8C423.2 130.4 423.5 134.4 425.5 137.7L462.7 199C467.7 207.4 461.2 218 451.4 217.2L380 211.3C376.1 210.9 372.4 212.5 369.9 215.4L323.1 269.6C316.7 277 304.5 274.1 302.3 264.5L285.8 194.8C285 191 282.4 188 278.8 186.5L212.7 158.7C203.7 154.9 202.8 142.5 211.2 137.4L272.4 100.2C275.7 98.2 277.8 94.7 278.2 90.9L284.2 19.5Z" fill="#FFBF91"/><path d="M46.2 19.5C47 9.7 58.5 5 65.9 11.4L120.3 58.2C123.2 60.7 127.1 61.6 130.8 60.8L200.6 44.4C210.1 42.2 218.2 51.7 214.4 60.7L186.7 126.8C185.2 130.4 185.5 134.4 187.5 137.7L224.7 199C229.7 207.4 223.2 218 213.4 217.2L142 211.3C138.1 210.9 134.4 212.5 131.9 215.4L85.1 269.6C78.7 277 66.5 274.1 64.3 264.5L47.8 194.8C47 191 44.4 188 40.8 186.5L-25.2 158.7C-34.2 154.9 -35.1 142.5 -26.7 137.4L34.4 100.2C37.7 98.2 39.8 94.7 40.2 90.9L46.2 19.5Z" fill="#FFBF91"/><path d="M95 263H155C147.3 248.9 147.3 240.6 122.8 238.1C103.2 236.1 96.1 253.8 95 263Z" fill="#D75A00"/><ellipse cx="139" cy="135" rx="90" ry="92" fill="#FF9E28"/><path d="M114 154.5A25 12.5 0 0 1 64 154.5Z" fill="#D75A00"/><path d="M181 154.5A25.5 12.5 0 0 1 130 154.5Z" fill="#D75A00"/><path d="M223.6 101.2L179.5 58.4C195.2 53.4 201.1 47.3 220.9 63C236.8 75.5 229.3 93.7 223.6 101.2Z" fill="#D75A00"/></svg>`,
    lilac: `<svg width="289" height="289" viewBox="0 0 289 289" fill="none"><rect width="289" height="289" fill="#FFD952"/><circle cx="210.5" cy="235.5" r="108.5" fill="#FFA5BD"/><circle cx="54" cy="57" r="70" fill="#FFA5BD"/><path d="M56.4 161.2L6.2 194.8C4.5 178.6 -0.1 171.5 18.9 155.7C34.2 143 50.2 154.1 56.4 161.2Z" fill="#BD56C7"/><path d="M226 220.5L287 225.1C280.4 210.2 281 201.7 256.3 197.3C236.5 193.7 227.8 211.3 226 220.5Z" fill="#BD56C7"/><ellipse cx="152.7" cy="128.3" rx="98.1" ry="98.3" fill="#E39CFF"/><path d="M49.3 145.5C49.7 140.8 51.1 136.3 53.3 132.1C55.5 128 58.4 124.3 62 121.3C65.7 118.3 69.8 116.1 74.3 114.7C78.8 113.3 83.5 112.8 88.1 113.3C92.8 113.7 97.3 115.1 101.5 117.3C105.6 119.5 109.3 122.4 112.3 126C115.3 129.7 117.5 133.8 118.9 138.3C120.3 142.8 120.8 147.5 120.3 152.1L84.8 148.8L49.3 145.5Z" fill="white"/><path d="M136.3 136.5C136.7 131.8 138.1 127.3 140.3 123.1C142.5 119 145.4 115.3 149 112.3C152.7 109.3 156.8 107.1 161.3 105.7C165.8 104.3 170.5 103.8 175.1 104.3C179.8 104.7 184.3 106.1 188.5 108.3C192.6 110.5 196.3 113.4 199.3 117C202.3 120.7 204.5 124.8 205.9 129.3C207.3 133.8 207.8 138.5 207.3 143.1L171.8 139.8L136.3 136.5Z" fill="white"/><path d="M61 146.6C61.3 143.4 62.2 140.4 63.7 137.6C65.1 134.9 67.1 132.4 69.6 130.4C72 128.4 74.8 126.9 77.8 126C80.8 125 83.9 124.7 87 125C90.2 125.3 93.2 126.2 96 127.7C98.8 129.1 101.2 131.1 103.2 133.6C105.2 136 106.7 138.8 107.6 141.8C108.6 144.8 108.9 147.9 108.6 151L84.8 148.8L61 146.6Z" fill="#BD56C7"/><path d="M148 137.6C148.3 134.4 149.2 131.4 150.7 128.6C152.1 125.9 154.1 123.4 156.6 121.4C159 119.4 161.8 117.9 164.8 117C167.8 116 170.9 115.7 174 116C177.2 116.3 180.2 117.2 183 118.7C185.8 120.1 188.2 122.1 190.2 124.6C192.2 127 193.7 129.8 194.6 132.8C195.6 135.8 195.9 138.9 195.6 142L171.8 139.8L148 137.6Z" fill="#BD56C7"/></svg>`,
  };

  // 임시 이야기(나중에 바꿀 자리). accent: 제목과 아래 눈물 모양 색
  const STORIES = [
    { art: "dizzy", accent: "#E8559A", ep: "EP.7", title: "발표 울렁증", director: "# 수줍은 고슴도치 1203", rating: 3.5,
      desc: ["모두의 시선이 쏠리는 발표 시간,", "머릿속이 하얘져 버린 모리.", "과연 무사히 발표를 끝낼 수 있을까?"] },
    { art: "blue", accent: "#3B81B4", ep: "EP.2", title: "나 어제 차였다", director: "# 비 오는 날의 우산 4410", rating: 4.5,
      desc: ["오랜 고민 끝에 건넨 고백,", "돌아온 대답은 생각과 달랐다.", "모리는 오늘 하루를 어떻게 버텨낼까?"] },
    { art: "wink", accent: "#18B07D", ep: "EP.5", title: "윙크는 신호였어", director: "# 장난꾸러기 해달 2291", rating: 4.0,
      desc: ["시험 시간, 짝꿍이 보낸 수상한 윙크.", "모른 척할까, 신호를 보낼까?", "모리의 선택은..!"] },
    { art: "teacher", accent: "#FF4A95", ep: "EP.1", title: "선생님의 무관심", director: "# 강력한 날다람쥐 7589", rating: 4.0,
      desc: ["시험기간이 코앞으로 다가온 고등학교,", "왜 이 선생님은 내 질문만 받아주시지 않는걸까?", "모리는 큰 맘을 먹고 직접 여쭤보러 교무실로 찾아가는데..!"] },
    { art: "purple", accent: "#8A3CF0", ep: "EP.3", title: "저요!라고 외치지마", director: "# 용감한 다람쥐 0815", rating: 3.0,
      desc: ["회의 시간마다 손을 번쩍 드는 동료,", "그런데 왜 일은 늘 내 몫이 될까?", "모리는 이번엔 꼭 말해 보기로 하는데.."] },
    { art: "orange", accent: "#E8740C", ep: "EP.6", title: "취업하는 동기들", director: "# 졸린 고양이 3372", rating: 5.0,
      desc: ["하나둘 합격 소식을 전하는 동기들,", "축하하는 마음과 조급한 마음 사이에서", "모리는 오늘도 지원서를 연다."] },
    { art: "lilac", accent: "#B550C8", ep: "EP.4", title: "상사님이 매일 혼내!", director: "# 퇴근하고 싶은 펭귄 9090", rating: 2.5,
      desc: ["출근하자마자 들려오는 이름 석 자,", "오늘은 또 무슨 일로 혼나게 될까?", "모리는 작은 반격을 준비한다."] },
  ];
  const COUNT = STORIES.length;
  const START = 3; // 처음에 가운데 올 이야기

  const root = document.querySelector('[data-screen="recommend"]');

  // ── 자리(슬롯) 7개: 피그마의 썸네일 중심 좌표 ──
  const CENTER = { x: 966, y: 958 };
  const SLOTS = [
    { x: 196.5, y: 885.5 },
    { x: 340.5, y: 561.5 },
    { x: 565.5, y: 318.5 },
    { x: 965.5, y: 223.5 },
    { x: 1365.5, y: 318.5 },
    { x: 1590.5, y: 561.5 },
    { x: 1735.5, y: 885.5 },
  ].map((p) => ({ angle: Math.atan2(p.x - CENTER.x, CENTER.y - p.y), radius: Math.hypot(p.x - CENTER.x, CENTER.y - p.y) }));
  const HIDDEN_ANGLE = (125 * Math.PI) / 180;
  const SIZE = 289;
  const SELECTED_SCALE = 411 / 289;

  const RATE_STAR =
    "M674.1 326.4C676.3 322.1 682.6 322.1 684.8 326.4L693.1 342.6C693.9 344.3 695.6 345.5 697.5 345.8L715.4 348.7C720.2 349.4 722.2 355.4 718.7 358.8L705.9 371.7C704.5 373 703.9 375 704.2 376.8L707 394.8C707.8 399.6 702.7 403.3 698.4 401.1L682.2 392.8C680.5 392 678.4 392 676.7 392.8L660.5 401.1C656.2 403.3 651.1 399.6 651.9 394.8L654.7 376.8C655 375 654.4 373 653 371.7L640.2 358.8C636.7 355.4 638.7 349.4 643.5 348.7L661.4 345.8C663.3 345.5 665 344.3 665.8 342.6L674.1 326.4Z";
  const star = (fill) => `<svg width="50" height="49" viewBox="637 320 86 84" fill="none" aria-hidden="true"><path d="${RATE_STAR}" fill="${fill}"/></svg>`;
  const hint = (cls, x, y, sign, label) =>
    `<div class="hint rc__hint ${cls}" style="left:${x}px;top:${y}px"><svg width="59" height="59" viewBox="0 0 59 59" fill="none" aria-hidden="true"><rect width="59" height="59" rx="29.5" fill="#FFFFFF"/>` +
    (sign === "+" ? `<path d="M31.5 28.4H46V31.5H31.5V46H28.4V31.5H14V28.4H28.4V14H31.5V28.4Z" fill="#3C3C3C"/>` : `<path d="M46 31.5H14V28.4H46V31.5Z" fill="#3C3C3C"/>`) +
    `</svg><span class="hint__label">${label}</span></div>`;

  root.innerHTML =
    `<svg class="rc__grid" width="1935" height="1047" viewBox="0 0 1935 1047" fill="none" aria-hidden="true"></svg>` +
    `<div class="rc__ring"></div><div class="rc__plate"></div>` +
    // 정보: 평점 · 제목 · 감독 · 줄거리
    `<div class="rc__rating">` +
    [0, 1, 2, 3, 4].map((i) => `<span class="rc__star" style="--i:${i}">${star("#D9D9D9")}<span class="rc__star-fill">${star("#FFC61C")}</span></span>`).join("") +
    `<b class="rc__score"></b></div>` +
    `<div class="rc__info"><p class="rc__title"></p><p class="rc__director"></p><p class="rc__desc"></p></div>` +
    `<div class="rc__dial"></div>` +
    // 가운데 썸네일 아래의 눈물 모양(위를 가리킨다)
    `<svg class="rc__marker" width="62.74" height="82.9" viewBox="936 18 62.74 82.9" fill="none" aria-hidden="true"><path d="M969.137 99.8916C968.15 101.232 966.144 101.223 965.17 99.874L942.502 68.4961L942.506 68.4961C938.427 63.2019 936 56.5699 936 49.3701C936 32.045 950.045 18 967.37 18C984.695 18.0001 998.74 32.0451 998.74 49.3701C998.74 56.57 996.312 63.2019 992.233 68.4961L992.237 68.4961L969.137 99.8916Z" fill="currentColor"/></svg>` +
    hint("rc__hint--ok", 1690, 850, "+", "선택") +
    hint("rc__hint--back", 1690, 945, "-", "뒤로");

  // 로비와 같은 바둑판 무늬
  (function grid() {
    const xs = [0, 193.2, 386.41, 579.61, 772.81, 966.01, 1159.22, 1352.42, 1545.62, 1738.82];
    const ys = [-177.8, 15.4, 208.61, 401.81, 595.01, 788.22, 981.42];
    let rects = "";
    xs.forEach((x) => ys.forEach((y) => (rects += `<rect x="${x + 0.5}" y="${y + 0.5}" width="195.175" height="195.175" rx="31.5" stroke="#CACACA"/>`)));
    root.querySelector(".rc__grid").innerHTML = rects;
  })();

  const dial = root.querySelector(".rc__dial");
  const marker = root.querySelector(".rc__marker");
  const info = root.querySelector(".rc__info");
  const titleEl = root.querySelector(".rc__title");
  const directorEl = root.querySelector(".rc__director");
  const descEl = root.querySelector(".rc__desc");
  const scoreEl = root.querySelector(".rc__score");
  const ratingEl = root.querySelector(".rc__rating");
  const stars = Array.from(root.querySelectorAll(".rc__star"));

  const nodes = STORIES.map((story, i) => {
    const el = document.createElement("div");
    el.className = "rc";
    el.innerHTML = `<div class="rc__pop"><div class="rc__disc">${ART[story.art]}</div></div>`;
    dial.appendChild(el);
    el.addEventListener("pointerdown", (e) => {
      if (active) clickIndex = i; // 이어서 판(root)의 pointerdown이 드래그를 시작한다
    });
    return { el, pop: el.querySelector(".rc__pop"), index: i };
  });

  // ── 다이얼 계산(로비와 같은 방식) ──
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);
  const mod = (n, m) => ((n % m) + m) % m;

  function place(s) {
    const a = Math.abs(s);
    let angle, radius;
    if (a <= 3) {
      const f = s + 3;
      const i = Math.min(Math.floor(f), 5);
      const t = f - i;
      angle = lerp(SLOTS[i].angle, SLOTS[i + 1].angle, t);
      radius = lerp(SLOTS[i].radius, SLOTS[i + 1].radius, t);
    } else {
      const edge = s > 0 ? SLOTS[6] : SLOTS[0];
      angle = lerp(edge.angle, Math.sign(s) * HIDDEN_ANGLE, Math.min((a - 3) / 0.3, 1));
      radius = edge.radius;
    }
    const sel = a < 1 ? smooth(1 - a) : 0;
    return { x: CENTER.x + radius * Math.sin(angle), y: CENTER.y - radius * Math.cos(angle), scale: lerp(1, SELECTED_SCALE, sel), sel };
  }

  let rot = START;
  let vel = 0;
  let target = START;
  let selected = -1;
  let active = false;
  let raf = 0;
  let last = 0;
  let drag = null;
  let clickIndex = -1;

  const replay = (el, className) => {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  };

  function render() {
    nodes.forEach((n) => {
      const s = mod(n.index - rot + COUNT / 2, COUNT) - COUNT / 2; // -3.5 … 3.5
      const p = place(s);
      const st = n.el.style;
      st.transform = `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px) scale(${p.scale.toFixed(4)})`;
      st.setProperty("--sel", p.sel.toFixed(3));
      st.zIndex = String(Math.round(p.sel * 10));
      n.el.classList.toggle("is-center", Math.abs(s) < 0.5);
    });
  }

  // 가운데 이야기의 정보를 보여 준다
  function showInfo(animate) {
    const story = STORIES[selected];
    titleEl.textContent = `${story.ep} : ${story.title}`;
    titleEl.style.color = story.accent;
    directorEl.textContent = `감독 : ${story.director} 님`;
    descEl.innerHTML = story.desc.join("<br>");
    marker.style.color = story.accent;
    scoreEl.textContent = story.rating.toFixed(1);
    stars.forEach((el, i) => el.style.setProperty("--part", String(Math.max(0, Math.min(1, story.rating - i)))));
    if (animate) {
      replay(info, "is-changing");
      replay(ratingEl, "is-changing");
      replay(marker, "is-ticking");
    }
  }

  function setSelected(next) {
    if (next === selected) return;
    selected = next;
    showInfo(true);
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.034);
    last = now;
    if (!drag) {
      for (let i = 0; i < 4; i++) {
        const h = dt / 4;
        vel += (-150 * (rot - target) - 15 * vel) * h;
        rot += vel * h;
      }
    }
    setSelected(mod(Math.round(rot), COUNT));
    render();
    if (active) raf = requestAnimationFrame(frame);
  }

  // → 는 시계 방향(썸네일들이 오른쪽으로 이동), ← 는 반시계 방향
  function turn(direction) {
    target = Math.round(target) - direction;
  }

  // 가까운 방향으로 돌려서 i번 이야기를 가운데로
  function turnTo(i) {
    let diff = mod(i - mod(Math.round(target), COUNT), COUNT);
    if (diff > COUNT / 2) diff -= COUNT;
    target = Math.round(target) + diff;
  }

  function pick() {
    replay(nodes[selected].pop, "is-picked");
    if (api.onPick) api.onPick(selected);
  }

  // ── 마우스·터치: 좌우로 밀어서 돌리고, 썸네일을 누르면 그 이야기로 ──
  root.addEventListener("pointerdown", (e) => {
    if (!active || (e.pointerType === "mouse" && e.button !== 0)) return;
    if (e.target.closest(".rc__hint")) return;
    drag = { x: Stage.point(e.clientX, e.clientY).x, rot, moved: false };
    vel = 0;
    try {
      root.setPointerCapture(e.pointerId);
    } catch (err) {}
  });

  root.addEventListener("pointermove", (e) => {
    if (!active || !drag) return;
    const dx = Stage.point(e.clientX, e.clientY).x - drag.x;
    if (Math.abs(dx) > 10) drag.moved = true;
    const next = drag.rot - dx / 380;
    vel = (next - rot) * 60;
    rot = next;
  });

  function endDrag(e) {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (moved) {
      target = Math.round(rot + Math.max(-0.45, Math.min(0.45, vel * 0.12)));
      vel = Math.max(-8, Math.min(8, vel));
    } else {
      target = Math.round(rot);
      if (e.type === "pointerup" && clickIndex >= 0) {
        if (clickIndex === selected) pick();
        else turnTo(clickIndex);
      }
    }
    clickIndex = -1;
  }
  root.addEventListener("pointerup", endDrag);
  root.addEventListener("pointercancel", endDrag);

  root.querySelector(".rc__hint--ok").addEventListener("pointerdown", () => active && pick());
  root.querySelector(".rc__hint--back").addEventListener("pointerdown", () => active && api.onBack && api.onBack());

  // 키 입력. 처리했으면 true, "back" 이면 로비로 돌아간다.
  function handleKey(e) {
    if (e.key === "ArrowRight") turn(1);
    else if (e.key === "ArrowLeft") turn(-1);
    else if (e.key === "Enter" || e.key === " " || e.key === "+" || e.key === "=") pick();
    else if (e.key === "-" || e.key === "Escape" || e.key === "Backspace") return "back";
    else return false;
    return true;
  }

  function enter() {
    active = true;
    rot = target = START;
    vel = 0;
    selected = -1;
    setSelected(START);
    render();
    replay(root, "is-entering");
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  function leave() {
    active = false;
    drag = null;
    cancelAnimationFrame(raf);
  }

  nodes.forEach((n) => n.el.style.setProperty("--size", SIZE + "px"));
  selected = START;
  showInfo(false);
  render();

  // onPick(이야기 번호): 선택했을 때. onBack: 화면의 − 버튼. js/flow.js가 연결한다.
  const api = { enter, leave, handleKey, turn, onPick: null, onBack: null, stories: STORIES };
  return api;
})();
