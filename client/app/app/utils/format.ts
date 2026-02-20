import type { Paragraph } from "~/components/index/Paragraph";
type ResponseData = Array<Paragraph>;

export function formatPageContentData(
  data: ResponseData,
): Record<string, Paragraph> {
  const obj = data.reduce((prev, cur) => {
    prev[cur.slug] = cur;
    return prev;
  }, {});
  return obj;
}
