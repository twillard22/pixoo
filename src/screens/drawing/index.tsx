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
  const colors = ['#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#000000'];

  const canvasSize = 64;
  const cellSize = 1;

  const [pixels, setPixels] = useState<
    { x: number; y: number; color: string }[]
  >([]);
  const [currentColor, setCurrentColor] = useState(colors[0]);

  const roundAndFloor = (value: number) => {
    return Math.round(Math.floor(value / cellSize));
  };

  const filter = (pixels: { x: number; y: number; color: string }[]) => {
    return pixels
      .reverse()
      .filter(
        (v, i, a) => a.findIndex(v2 => v.x === v2.x && v.y === v2.y) === i,
      );
  };

  const touchStart = (event: GestureResponderEvent) => {
    const tempPixels = [...pixels];
    tempPixels.push({
      x: roundAndFloor(event.nativeEvent.locationX),
      y: roundAndFloor(event.nativeEvent.locationY),
      color: currentColor,
    });
    setPixels(filter(tempPixels));
  };

  const touchMove = (event: GestureResponderEvent) => {
    const { locationX: x, locationY: y } = event.nativeEvent;

    const tempPixels = [...pixels];
    tempPixels.push({
      x: roundAndFloor(x),
      y: roundAndFloor(y),
      color: currentColor,
    });
    setPixels(filter(tempPixels));
  };

  const touchEnd = () => {};

  const clearPixooScreen = () => {
    clearPixoo();
  };

  const savePixoo = () => {
    const data = pixels.map(map => {
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

  const reset = () => {
    setPixels([]);
  };

  return (
    <View flex={1}>
      <View>
        <VStack space={2} p={2}>
          <Button onPress={reset}>Reset</Button>
        </VStack>
      </View>
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
            {pixels.map((pixel, index) => (
              <Rect
                key={index}
                x={pixel.x}
                y={pixel.y}
                width={cellSize}
                height={cellSize}
                color={pixel.color}
              />
            ))}
          </Canvas>
        </View>
      </View>
      <VStack space={2} p={2}>
        <Button onPress={clearPixooScreen}>Clear</Button>
        <Button onPress={savePixoo}>Save</Button>
      </VStack>
    </View>
  );
}
