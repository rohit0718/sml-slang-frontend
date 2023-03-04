import { compressToEncodedURIComponent } from 'lz-string';
import * as qs from 'query-string';
import { SagaIterator } from 'redux-saga';
import { call, delay, put, race, select } from 'redux-saga/effects';
import { Variant } from 'src/sml-integration';

import {
  changeQueryString,
  shortenURL,
  updateShortURL
} from '../../features/playground/PlaygroundActions';
import { GENERATE_LZ_STRING, SHORTEN_URL } from '../../features/playground/PlaygroundTypes';
import { defaultEditorValue, OverallState } from '../application/ApplicationTypes';
import Constants from '../utils/Constants';
import { showSuccessMessage, showWarningMessage } from '../utils/NotificationsHelper';
import { safeTakeEvery as takeEvery } from './SafeEffects';

export default function* PlaygroundSaga(): SagaIterator {
  yield takeEvery(GENERATE_LZ_STRING, updateQueryString);

  yield takeEvery(SHORTEN_URL, function* (action: ReturnType<typeof shortenURL>) {
    const queryString: string = yield select((state: OverallState) => state.playground.queryString);
    const keyword = action.payload;
    const errorMsg = 'ERROR';

    let resp, timeout;

    //we catch and move on if there are errors (plus have a timeout in case)
    try {
      const { result, hasTimedOut } = yield race({
        result: call(shortenURLRequest, queryString, keyword),
        hasTimedOut: delay(10000)
      });

      resp = result;
      timeout = hasTimedOut;
    } catch (_) {}

    if (!resp || timeout) {
      yield put(updateShortURL(errorMsg));
      return (yield call(
        showWarningMessage,
        'Something went wrong trying to create the link.'
      )) as string;
    }

    if (resp.status !== 'success' && !resp.shorturl) {
      yield put(updateShortURL(errorMsg));
      return (yield call(showWarningMessage, resp.message)) as string;
    }

    if (resp.status !== 'success') {
      yield call(showSuccessMessage, resp.message);
    }
    yield put(updateShortURL(resp.shorturl));
    return '';
  });
}

function* updateQueryString() {
  const code: string | null = yield select(
    (state: OverallState) => state.workspaces.playground.editorValue
  );
  if (!code || code === defaultEditorValue) {
    yield put(changeQueryString(''));
    return;
  }
  const codeString: string = code as string;
  const variant: Variant = Constants.defaultSourceVariant;
  const execTime: number = yield select(
    (state: OverallState) => state.workspaces.playground.execTime
  );
  const newQueryString: string = qs.stringify({
    prgrm: compressToEncodedURIComponent(codeString),
    variant,
    exec: execTime
  });
  yield put(changeQueryString(newQueryString));
}

/**
 * Gets short url from microservice
 * @returns {(Response|null)} Response if successful, otherwise null.
 */
export async function shortenURLRequest(
  queryString: string,
  keyword: string
): Promise<Response | null> {
  return null;
}
