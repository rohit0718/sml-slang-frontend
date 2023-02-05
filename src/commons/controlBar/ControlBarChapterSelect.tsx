import { Button, Classes, Menu, MenuItem } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ItemListRenderer, ItemRenderer, Select } from '@blueprintjs/select';
import { Chapter, Variant } from 'calc-slang/dist/types';
import React from 'react';

import {
  defaultLanguages,
  SALanguage,
  sourceLanguages,
  styliseSublanguage
} from '../application/ApplicationTypes';

type ControlBarChapterSelectProps = DispatchProps & StateProps;

type DispatchProps = {
  handleChapterSelect?: (i: SALanguage, e?: React.SyntheticEvent<HTMLElement>) => void;
};

type StateProps = {
  sourceChapter: Chapter;
  sourceVariant: Variant;
  disabled?: boolean;
};

const chapterListRenderer: ItemListRenderer<SALanguage> = ({ itemsParentRef, renderItem }) => {
  const defaultChoices = defaultLanguages.map(renderItem);
  return (
    <Menu ulRef={itemsParentRef}>
      {defaultChoices}
    </Menu>
  );
};

const chapterRenderer: ItemRenderer<SALanguage> = (lang, { handleClick }) => (
  <MenuItem key={lang.displayName} onClick={handleClick} text={lang.displayName} />
);

const ChapterSelectComponent = Select.ofType<SALanguage>();

export const ControlBarChapterSelect: React.FC<ControlBarChapterSelectProps> = ({
  sourceChapter,
  sourceVariant,
  handleChapterSelect = () => {},
  disabled = false
}) => {
  return (
    <ChapterSelectComponent
      items={sourceLanguages}
      onItemSelect={handleChapterSelect}
      itemRenderer={chapterRenderer}
      itemListRenderer={chapterListRenderer}
      filterable={false}
      disabled={disabled}
    >
      <Button
        className={Classes.MINIMAL}
        text={styliseSublanguage(sourceChapter, sourceVariant)}
        rightIcon={disabled ? null : IconNames.DOUBLE_CARET_VERTICAL}
        disabled={disabled}
      />
    </ChapterSelectComponent>
  );
};
