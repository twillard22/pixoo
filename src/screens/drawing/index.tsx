import {
  Canvas,
  Rect,
  rgbaColor,
  useCanvasRef,
} from '@shopify/react-native-skia';
import { Button, Center, HStack, View, VStack } from 'native-base';
import React, { useState } from 'react';
import { GestureResponderEvent } from 'react-native';
import { clearPixoo, updatePixooPixels } from '../../fetch/pixoo';
import { ColorSwatch } from './components/colorSwatch';

export function Drawing() {
  const ref = useCanvasRef();
  const colors = ['#FFFFFF', '#FF0000', '#00FF00'];

  const canvasSize = 64;
  const cellSize = 1;

  const [pixels, setPixels] = useState<
    { x: number; y: number; color: string }[][]
  >([]);
  const [currentColor, setCurrentColor] = useState(colors[0]);

  const roundAndFloor = (value: number) => {
    return Math.round(Math.floor(value / cellSize));
  };

  const touchStart = (event: GestureResponderEvent) => {
    const tempPixels = [...pixels];
    tempPixels.push([
      {
        x: roundAndFloor(event.nativeEvent.locationX),
        y: roundAndFloor(event.nativeEvent.locationY),
        color: currentColor,
      },
    ]);
    setPixels(tempPixels);
  };

  const touchMove = (event: GestureResponderEvent) => {
    const { locationX: x, locationY: y } = event.nativeEvent;

    const tempPixels = [...pixels];
    tempPixels[tempPixels.length - 1].push({
      x: roundAndFloor(x),
      y: roundAndFloor(y),
      color: currentColor,
    });
    tempPixels[tempPixels.length - 1].filter(
      (v, i, a) => a.findIndex(v2 => v.x === v2.x && v.y === v2.y) === i,
    );

    setPixels(tempPixels);
  };

  const touchEnd = () => {
    const data = pixels[pixels.length - 1].map(map => {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(map.color);

      return {
        x: map.x,
        y: map.y,
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      };
    });
    updatePixooPixels(data);
  };

  const clearPixooScreen = () => {
    clearPixoo();
    setPixels([]);
  };

  return (
    <View flex={1}>
      <View height={20} justifyContent={'center'}>
        <Center>
          <HStack space={2}>
            {colors.map(map => {
              return (
                <ColorSwatch
                  key={map}
                  color={map}
                  selected={currentColor === map}
                  onSelect={() => setCurrentColor(map)}
                />
              );
            })}
          </HStack>
        </Center>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            backgroundColor: '#000000',
            transform: [{ scale: 6 }],
          }}
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}>
          <Canvas
            ref={ref}
            style={{
              height: canvasSize,
              width: canvasSize,
            }}>
            {pixels.map(pixel =>
              pixel?.map((map, index) => (
                <Rect
                  key={index}
                  x={map.x}
                  y={map.y}
                  width={cellSize}
                  height={cellSize}
                  color={map.color}
                />
              )),
            )}
          </Canvas>
        </View>
      </View>
      <VStack space={2} p={2}>
        <Button onPress={clearPixooScreen}>Clear</Button>
      </VStack>
    </View>
  );
}
