export const TAGS = [
  { value: "horror", label: "ホラー" },
  { value: "mystery", label: "ミステリー" },
  { value: "suspense", label: "サスペンス" },
  { value: "fantasy", label: "ファンタジー" },
  { value: "sf", label: "SF" },
  { value: "history", label: "歴史" },
  { value: "romance", label: "恋愛" },
  { value: "youth", label: "青春" },
  { value: "daily", label: "日常" },
  { value: "school", label: "学校" },
  { value: "work", label: "仕事" },
  { value: "travel", label: "旅行" },
  { value: "food", label: "グルメ" },
  { value: "sports", label: "スポーツ" },
  { value: "true_story", label: "実話" },
];

const TAG_LABELS = Object.fromEntries(TAGS.map((t) => [t.value, t.label]));

export function tagLabel(value: string) {
  return TAG_LABELS[value] ?? value;
}
