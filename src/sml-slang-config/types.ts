export enum Chapter {
    SMLSlang = 1
}
  
export enum Variant {
    DEFAULT = 'SML-slang'
}

export interface Language {
    chapter: Chapter
    variant: Variant
}
