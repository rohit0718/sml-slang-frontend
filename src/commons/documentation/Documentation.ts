import { SourceDocumentation } from 'src/sml-integration';

const externalLibrariesDocumentation = {};

const MAX_CAPTION_LENGTH = 25;

function shortenCaption(name: string): string {
  if (name.length <= MAX_CAPTION_LENGTH) {
    return name;
  }

  return (name = name.substring(0, MAX_CAPTION_LENGTH - 3) + '...');
}

const builtinDocumentation = {};

Object.entries(SourceDocumentation.builtins).forEach((chapterDoc: any) => {
  const [chapter, docs] = chapterDoc;
  builtinDocumentation[chapter] = Object.entries(docs).map((entry: any) => {
    const [name, info] = entry;
    return {
      caption: shortenCaption(name),
      value: name,
      meta: info.meta,
      docHTML: info.description
    };
  });
});

const keywords = {};
const KEYWORD_SCORE = 20000;

Object.entries(SourceDocumentation.keywords).forEach((chapterDoc: any) => {
  const [chapter, docs] = chapterDoc;
  keywords[chapter] = Object.entries(docs).map((entry: any) => {
    const [name, info] = entry;
    return {
      caption: shortenCaption(name),
      value: name,
      meta: info.meta,
      score: KEYWORD_SCORE
    };
  });
});

const types = {};
const TYPE_SCORE = 21000;

Object.entries(SourceDocumentation.types).forEach((chapterDoc: any) => {
  const [chapter, docs] = chapterDoc;
  types[chapter] = Object.entries(docs).map((entry: any) => {
    const [name, info] = entry;
    return {
      caption: shortenCaption(name),
      value: name,
      meta: info.meta,
      score: TYPE_SCORE
    };
  });
});

export const Documentation = {
  builtins: builtinDocumentation,
  keywords,
  types,
  externalLibraries: externalLibrariesDocumentation
};
