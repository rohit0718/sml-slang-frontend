import { action } from 'typesafe-actions'; // EDITED

import { FETCH_NOTIFICATIONS, UPDATE_NOTIFICATIONS } from '../types/SessionTypes';

/**
 * Notification actions
 */

export const fetchNotifications = () => action(FETCH_NOTIFICATIONS);

export const updateNotifications = (notifications: Notification[]) =>
  action(UPDATE_NOTIFICATIONS, notifications);
