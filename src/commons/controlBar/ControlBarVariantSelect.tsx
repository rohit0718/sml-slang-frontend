import { Button, Classes, Menu, MenuItem } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ItemListRenderer, ItemRenderer, Select } from '@blueprintjs/select';
import * as React from 'react';
import { Variant } from 'src/sml-integration';

import {
  SourceLanguage,
  sourceLanguages,
  styliseSublanguage
} from '../application/ApplicationTypes';

type ControlBarVariantSelectProps = DispatchProps & StateProps;

type DispatchProps = {
  handleVariantSelect?: (i: SourceLanguage, e?: React.SyntheticEvent<HTMLElement>) => void;
};

type StateProps = {
  sourceVariant: Variant;
  disabled?: boolean;
  key: string;
};

export function ControlBarVariantSelect(props: ControlBarVariantSelectProps) {
  const variantRenderer: ItemRenderer<SourceLanguage> = (lang, { handleClick }) => (
    <MenuItem key={lang.displayName} onClick={handleClick} text={lang.displayName} />
  );

  const variantListRenderer: ItemListRenderer<SourceLanguage> = ({
    itemsParentRef,
    renderItem
  }) => {
    const defaultChoices = sourceLanguages.map(renderItem);

    return <Menu ulRef={itemsParentRef}>{defaultChoices}</Menu>;
  };

  const VariantSelectComponent = Select.ofType<SourceLanguage>();

  const variantSelect = (
    currentVariant: Variant,
    handleSelect = (item: SourceLanguage, event?: React.SyntheticEvent<HTMLElement>) => {},
    disabled: boolean
  ) => (
    <VariantSelectComponent
      items={sourceLanguages}
      onItemSelect={handleSelect}
      itemRenderer={variantRenderer}
      itemListRenderer={variantListRenderer}
      filterable={false}
      disabled={disabled || false}
    >
      <Button
        className={Classes.MINIMAL}
        text={styliseSublanguage(currentVariant)}
        rightIcon={disabled ? null : IconNames.DOUBLE_CARET_VERTICAL}
        disabled={disabled || false}
      />
    </VariantSelectComponent>
  );

  return variantSelect(props.sourceVariant, props.handleVariantSelect, props.disabled || false);
}
