import { SagaIterator } from 'redux-saga';
import { fork } from 'redux-saga/effects';

import PlaygroundSaga from './PlaygroundSaga';
import WorkspaceSaga from './WorkspaceSaga';

export default function* MainSaga(): SagaIterator {
  yield fork(PlaygroundSaga);
  yield fork(WorkspaceSaga);
}
