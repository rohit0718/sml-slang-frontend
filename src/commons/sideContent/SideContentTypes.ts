import { IconName } from '@blueprintjs/core';

export const NOTIFY_PROGRAM_EVALUATED = 'NOTIFY_PROGRAM_EVALUATED';

export enum SideContentType {
  introduction = 'introduction'
}

export type SideContentTab = {
  label: string;
  iconName: IconName;
  body: JSX.Element;
  id?: SideContentType;
  disabled?: boolean;
};
