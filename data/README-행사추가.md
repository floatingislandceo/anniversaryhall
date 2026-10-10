# 대표 행사 스토리 추가하는 법

행사 사례 페이지(events.html)의 "대표 행사 스토리"는 이 폴더의 `cases.json`을 읽어서 자동으로 만들어집니다.
새 행사를 추가하려면 **사진 올리기 + JSON에 한 덩어리 추가** 두 단계면 됩니다. 코드 수정 없음.

## 1. 사진 올리기
- GitHub 저장소 → `img` 폴더 → **Add file → Upload files**
- 파일 이름은 영문 소문자·하이픈으로 (예: `gala2026-stage.jpg`, `gala2026-table.jpg`)
- 가로 1600px 전후, 1장당 500KB 이하 권장

## 2. cases.json에 행사 추가
- GitHub 저장소 → `data/cases.json` → 연필(Edit) 아이콘
- 맨 앞 `[` 바로 뒤에 아래 블록을 붙여 넣으면 **가장 위(최신)** 에 나옵니다. 블록 끝의 쉼표(,)를 잊지 마세요.

```json
 {
  "id": "case-gala2026",
  "eyebrow": "Case 08 · Year-end Gala",
  "title": {"ko": "OO기업 2026 송년 갈라", "en": "OO Corp. 2026 year-end gala", "zh": "OO公司2026年终晚宴"},
  "text": {
   "ko": "행사 소개 두세 문장. 어떤 공간을 어떻게 썼는지.",
   "en": "Two or three sentences in English.",
   "zh": "中文简介两三句。"
  },
  "facts": [
   {"ko": "메인홀: 라운드 테이블 180석 · LED 무대", "en": "Main Hall: 180 round-table seats, LED stage", "zh": "主厅：圆桌180席、LED舞台"},
   {"ko": "리셉션홀: 웰컴 드링크 · 포토월", "en": "Reception: welcome drinks, photo wall", "zh": "接待厅：迎宾饮品、照片墙"}
  ],
  "photos": [
   {"src": "gala2026-stage.jpg", "alt": "메인 무대", "wide": true},
   {"src": "gala2026-table.jpg", "alt": "테이블 세팅", "wide": false},
   {"src": "gala2026-photo.jpg", "alt": "포토월", "wide": false}
  ]
 },
```

- `id`는 영문으로 고유하게 (`case-` 로 시작)
- `wide: true` 인 사진은 두 칸 너비로 크게 나옵니다 (첫 사진 권장)
- 영문·중문이 없으면 한국어 값을 복사해 넣어도 됩니다

## 3. 저장
- 아래 **Commit changes** 클릭 → 1~2분 뒤 anniversaryhall.com/events.html 에 반영

쉼표나 따옴표가 빠지면 페이지에 사례가 안 뜹니다. 그럴 땐 https://jsonlint.com 에 내용을 붙여 넣어 오류 위치를 확인하세요.
