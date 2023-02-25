import { SourceDocumentation } from '../../sml-slang-config';

const externalLibrariesDocumentation = {};

const MAX_CAPTION_LENGTH = 27;

function shortenCaption(name: string): string {
  if (name.length <= MAX_CAPTION_LENGTH) {
    return name;
  }

  return (name = name.substring(0, MAX_CAPTION_LENGTH - 3) + '...');
}

const builtinDocumentation = {};

// builtins
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

// keywords
const keywords = {}
Object.entries(SourceDocumentation.keywords).forEach((chapterDoc: any) => {
  const [chapter, docs] = chapterDoc;
  keywords[chapter] = Object.entries(docs).map((entry: any) => {
    const [name, info] = entry;
    return {
      caption: shortenCaption(name),
      value: name,
      meta: info.meta
    };
  });
});

// types
const types = {}
Object.entries(SourceDocumentation.types).forEach((chapterDoc: any) => {
  const [chapter, docs] = chapterDoc;
  types[chapter] = Object.entries(docs).map((entry: any) => {
    const [name, info] = entry;
    return {
      caption: shortenCaption(name),
      value: name,
      meta: info.meta
    };
  });
});

export const Documentation = {
  externalLibraries: externalLibrariesDocumentation,
  builtins: builtinDocumentation,
  keywords,
  types
};
