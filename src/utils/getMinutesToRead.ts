import { RichText } from "prismic-dom";

export function getMinutesToRead(
  content: Array<{ heading: string; body: any }>,
): string {
  const allContentText = content.reduce<string>((text, content) => {
    text += ` ${content.heading}`;

    if (Array.isArray(content.body)) {
      text += ` ${RichText.asText(content.body)}`;
    }

    return text;
  }, "");

  const words = allContentText.split(/\s+/g).filter(Boolean);
  return `${Math.ceil(words.length / 200)} min`;
}
