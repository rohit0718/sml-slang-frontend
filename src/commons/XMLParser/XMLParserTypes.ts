export const EDITING_ID = -1;

export type XmlParseStrTask = {
  $: XmlParseStrOverview;
  DEPLOYMENT: XmlParseStrDeployment[];
  GRADERDEPLOYMENT: XmlParseStrDeployment[];
  READING: string[];
  TEXT: string[];
  WEBSUMMARY?: string[];
};

export type XmlParseStrDeployment = {
  $: {
    interpreter: string;
  };
  GLOBAL?: Array<{
    IDENTIFIER: string[];
    VALUE: string[];
  }>;
  IMPORT?: Array<{
    $: {};
    SYMBOL: string[];
  }>;
  // deprecated EXTERNAL in DEPLOYMENT and GRADERDEPLOYMENT, use IMPORT instead
  EXTERNAL?: Array<{
    $: {};
    SYMBOL: string[];
  }>;
};

export type XmlParseStrOverview = {
  coverimage: string;
  duedate: string;
  kind: string;
  number: string;
  title: string;
  startdate: string;
  story: string | null;
};

export type XmlParseStrProblemChoice = {
  $: {
    correct: string;
  };
  TEXT: string[];
};

export type XmlParseStrTestcase = {
  $: {
    answer: string;
    score: string;
  };
  _: string;
};
