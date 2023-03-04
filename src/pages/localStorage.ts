import { compressToUTF16, decompressFromUTF16 } from 'lz-string';
import Constants from 'src/commons/utils/Constants';
import { Variant } from 'src/sml-integration';

import { OverallState } from '../commons/application/ApplicationTypes';
import { SessionState } from '../commons/application/types/SessionTypes';
import { showWarningMessage } from '../commons/utils/NotificationsHelper';

export type SavedState = {
  session: Partial<SessionState>;
  playgroundEditorValue: string | null;
  playgroundIsEditorAutorun: boolean;
  playgroundSourceVariant: Variant;
};

export const loadStoredState = (): SavedState | undefined => {
  try {
    const serializedState = localStorage.getItem('storedState');
    if (!serializedState) {
      return undefined;
    }
    const decompressed = decompressFromUTF16(serializedState);
    if (!decompressed) {
      return undefined;
    }
    return JSON.parse(decompressed) as SavedState;
  } catch (err) {
    showWarningMessage('Error loading from local storage');
    return undefined;
  }
};

export const saveState = (state: OverallState) => {
  try {
    const stateToBeSaved: SavedState = {
      session: {
        accessToken: state.session.accessToken,
        refreshToken: state.session.refreshToken,
        role: state.session.role,
        name: state.session.name,
        userId: state.session.userId
      },
      playgroundEditorValue: state.workspaces.playground.editorValue,
      playgroundIsEditorAutorun: state.workspaces.playground.isEditorAutorun,
      playgroundSourceVariant: Constants.defaultSourceVariant
    };
    const serialized = compressToUTF16(JSON.stringify(stateToBeSaved));
    localStorage.setItem('storedState', serialized);
  } catch (err) {
    showWarningMessage('Error saving to local storage');
  }
};
