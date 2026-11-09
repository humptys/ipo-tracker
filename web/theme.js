// 저장된 테마를 화면 그리기 전에 적용 (깜빡임 방지). 보안 정책상 인라인 스크립트를 못 쓰므로 별도 파일
try { var t = localStorage.getItem("theme"); if (t === '"light"' || t === '"dark"') document.documentElement.dataset.theme = JSON.parse(t); } catch (e) {}
