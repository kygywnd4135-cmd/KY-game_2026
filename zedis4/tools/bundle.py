"""index.html과 CSS·JS·폰트를 파일 하나로 합쳐 미리보기용 HTML을 만든다.
사용: python3 tools/bundle.py <출력 경로> [--fragment]
--fragment: <html>/<head>/<body> 껍데기를 뺀 본문만 출력한다(호스팅 서비스가 껍데기를 씌우는 경우)."""
import base64, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "index.html").read_text(encoding="utf-8")
font = base64.b64encode((root / "fonts/SUITE-Variable.woff2").read_bytes()).decode()

def css(m):
    text = (root / m.group(1)).read_text(encoding="utf-8")
    text = re.sub(r'src: url\("\.\./fonts/SUITE-Variable\.woff2"\)[^;]*;',
                  'src: url("data:font/woff2;base64,' + font + '") format("woff2");', text)
    return "<style>\n" + text + "</style>"

def js(m):
    return "<script>\n" + (root / m.group(1)).read_text(encoding="utf-8") + "</script>"

html = re.sub(r'<link rel="preload"[^>]*>\s*', "", html)
html = re.sub(r'<link rel="stylesheet" href="([^"]+)" />', css, html)
html = re.sub(r'<script src="([^"]+)"></script>', js, html)
if "--fragment" in sys.argv:
    title = re.search(r"<title>.*?</title>", html).group(0)
    head = "".join(re.findall(r"<style>.*?</style>", html, re.S))
    body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
    html = title + "\n<style>:root { color-scheme: light; }</style>\n" + head + body
pathlib.Path(sys.argv[1]).write_text(html, encoding="utf-8")
