# 호흡 훈련 앱 - PWA 설치 가이드

## 파일 구성
```
breathing-app/
├── index.html      ← 메인 앱
├── manifest.json   ← PWA 설정
├── sw.js           ← 서비스 워커 (오프라인 지원)
└── icons/          ← 앱 아이콘
```

---

## 1단계: 무료 호스팅에 올리기

### Netlify (가장 쉬움, 추천)
1. https://netlify.com 가입 (무료)
2. 사이트에서 **breathing-app 폴더 전체**를 끌어다 놓기(드래그앤드롭)
3. 자동으로 주소 생성됨 (예: https://mybreath.netlify.app)

### GitHub Pages (무료)
1. https://github.com 가입
2. 새 저장소(repository) 생성
3. 파일 전체 업로드
4. Settings → Pages → Branch: main 선택
5. 주소 생성됨 (예: https://아이디.github.io/저장소명)

---

## 2단계: 스마트폰에 앱으로 설치

### 아이폰 (iOS Safari)
1. Safari에서 앱 주소 열기
2. 하단 공유 버튼(□↑) 탭
3. **"홈 화면에 추가"** 선택
4. 이름 확인 후 **추가** 탭
5. 홈 화면에 앱 아이콘 생성 완료!

### 안드로이드 (Chrome)
1. Chrome에서 앱 주소 열기
2. 주소창 옆 메뉴(⋮) 탭
3. **"홈 화면에 추가"** 또는 **"앱 설치"** 선택
4. 설치 완료!

---

## 특징
- 오프라인에서도 작동 (서비스 워커)
- 훈련 기록이 기기에 영구 저장 (localStorage)
- 다크모드 자동 지원
- 아이폰/안드로이드 safe-area 대응
- 카카오톡·블로그 공유 기능
