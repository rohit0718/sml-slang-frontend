import moment, { Moment } from 'moment';
import { Variant } from 'src/sml-integration';

const isTest = process.env.NODE_ENV === 'test';

const sourceAcademyVersion = process.env.REACT_APP_VERSION || 'local';
const sourceAcademyEnvironment = process.env.REACT_APP_ENVIRONMENT || 'dev';
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const cadetLoggerUrl = isTest ? undefined : process.env.REACT_APP_CADET_LOGGER;
const cadetLoggerInterval = parseInt(process.env.REACT_APP_CADET_LOGGER_INTERVAL || '10000', 10);
const defaultSourceVariant: Variant = 'sml-slang';
const defaultQuestionId = 0;
const maxBrowseIndex = 50;
const moduleBackendUrl = process.env.REACT_APP_MODULE_BACKEND_URL || 'modules';
const playgroundOnly = true;

const authProviders: Map<
  string,
  { name: string; endpoint: string; isDefault: boolean }
> = new Map();

for (let i = 1; ; ++i) {
  const id = process.env[`REACT_APP_OAUTH2_PROVIDER${i}`];
  if (!id) {
    break;
  }

  const name = process.env[`REACT_APP_OAUTH2_PROVIDER${i}_NAME`] || 'Unnamed provider';
  const endpoint = process.env[`REACT_APP_OAUTH2_PROVIDER${i}_ENDPOINT`] || '';

  authProviders.set(id, { name, endpoint, isDefault: i === 1 });
}

const disablePeriods: Array<{ start: Moment; end: Moment; reason?: string }> = [];

if (!isTest) {
  for (let i = 1; ; ++i) {
    const startStr = process.env[`REACT_APP_DISABLE${i}_START`];
    const endStr = process.env[`REACT_APP_DISABLE${i}_END`];
    if (!startStr || !endStr) {
      break;
    }
    const reason = process.env[`REACT_APP_DISABLE${i}_REASON`];
    const start = moment(startStr);
    const end = moment(endStr);
    if (end.isBefore(start) || moment().isAfter(end)) {
      continue;
    }
    disablePeriods.push({ start, end, reason });
  }
}

export enum Links {
  githubIssues = 'https://github.com/source-academy/cadet-frontend/issues',
  githubOrg = 'https://github.com/source-academy',

  moduleDetails = 'https://www.comp.nus.edu.sg/~cs1101s',
  luminus = 'https://luminus.nus.edu.sg/modules/41d42e9a-5880-43b5-8ee6-75f5a41355e3/announcements/active',
  piazza = 'https://piazza.com/class/kas136yscf8605',

  sourceAcademyAssets = 'https://source-academy-assets.s3-ap-southeast-1.amazonaws.com',
  sourceDocs = 'https://source-academy.github.io/source/',
  techSVC = 'mailto:techsvc@comp.nus.edu.sg',
  techSVCNumber = '6516 2736',
  textbook = 'https://source-academy.github.io/sicp/',
  textbookChapter2_2 = 'https://source-academy.github.io/sicp/chapters/2.2.html',
  textbookChapter3_2 = 'https://source-academy.github.io/sicp/chapters/3.2.html',

  aceHotkeys = 'https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts',
  sourceHotkeys = 'https://github.com/source-academy/cadet-frontend/wiki/Source-Academy-Keyboard-Shortcuts',

  source_1 = 'https://source-academy.github.io/source/source_1/',
  source_1_Lazy = 'https://source-academy.github.io/source/source_1_lazy/',
  source_1_Wasm = 'https://source-academy.github.io/source/source_1_wasm/',
  source_2 = 'https://source-academy.github.io/source/source_2/',
  source_2_Lazy = 'https://source-academy.github.io/source/source_2_lazy/',
  source_3 = 'https://source-academy.github.io/source/source_3/',
  source_3_Concurrent = 'https://source-academy.github.io/source/source_3_concurrent/',
  source_3_Nondet = 'https://source-academy.github.io/source/source_3_non-det/',
  source_4 = 'https://source-academy.github.io/source/source_4/',
  source_4_Gpu = 'https://source-academy.github.io/source/source_4_gpu/'
}

const Constants = {
  sourceAcademyVersion,
  sourceAcademyEnvironment,
  backendUrl,
  cadetLoggerUrl,
  defaultSourceVariant,
  defaultQuestionId,
  maxBrowseIndex,
  moduleBackendUrl,
  authProviders,
  playgroundOnly,
  disablePeriods,
  cadetLoggerInterval
};

export default Constants;
