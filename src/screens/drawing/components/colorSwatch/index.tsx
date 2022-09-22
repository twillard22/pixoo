import { View } from 'native-base';
import React from 'react';

type ColorSwatchProps = {
  color: string;
  selected?: boolean;
  onSelect: () => void;
};

export function ColorSwatch({ color, selected, onSelect }: ColorSwatchProps) {
  return (
    <View
      height={10}
      width={10}
      borderRadius={10}
      bgColor={color}
      borderWidth={selected ? 4 : 0}
      borderColor={'grey'}
      onTouchEnd={onSelect}
    />
  );
}
