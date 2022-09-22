import { Slider, View, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { updateBrightness } from '../../fetch/pixoo';

export function Settings() {
  const [brightness, setBrightness] = useState(100);

  useEffect(() => {
    updateBrightness(brightness);
  }, [brightness]);

  return (
    <View px={5} py={5}>
      <View>
        <View>
          <Text>Brightness</Text>
        </View>
        <View>
          <Slider
            minValue={0}
            maxValue={100}
            value={brightness}
            onChange={v => {
              setBrightness(Math.floor(v));
            }}
            onChangeEnd={v => {
              v && setBrightness(Math.floor(v));
            }}>
            <Slider.Track>
              <Slider.FilledTrack />
            </Slider.Track>
            <Slider.Thumb />
          </Slider>
        </View>
      </View>
    </View>
  );
}
