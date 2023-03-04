import { HistoryHelper } from '../../utils/HistoryHelper';
import { Role } from '../ApplicationTypes';

export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS';
export const ACKNOWLEDGE_NOTIFICATIONS = 'ACKNOWLEDGE_NOTIFICATIONS';
export const UPDATE_NOTIFICATIONS = 'UPDATE_NOTIFICATIONS';

export const UPLOAD_KEYSTROKE_LOGS = 'UPLOAD_KEYSTROKE_LOGS';
export const UPLOAD_UNSENT_LOGS = 'UPLOAD_UNSENT_LOGS';

export type SessionState = {
  readonly accessToken?: string;
  readonly group: string | null;
  readonly historyHelper: HistoryHelper;
  readonly refreshToken?: string;
  readonly role?: Role;
  readonly name?: string;
  readonly userId?: number;
  readonly notifications: Notification[];
  readonly googleUser?: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  userId: number;
  name: string;
  role: Role;
  group: string | null;
};
