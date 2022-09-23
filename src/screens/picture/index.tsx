import {
  Camera,
  CameraCapturedPicture,
  CameraType,
  PermissionStatus,
} from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Button, View, Text, VStack, Image } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { clearPixoo, updateImage } from '../../fetch/pixoo';

export function Picture() {
  const camera = useRef<Camera>();
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [image, setImage] = useState<undefined | CameraCapturedPicture>();

  useEffect(() => {
    if (permission?.status === PermissionStatus.UNDETERMINED) {
      requestPermission();
    }
  }, [permission]);

  function toggleCameraType() {
    setType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  }

  async function takePicture() {
    const image = await camera.current?.takePictureAsync();
    const imageSize = Math.min(image.height, image.width);

    const manipResult = await manipulateAsync(image.uri, [
      {
        crop: {
          height: imageSize,
          width: imageSize,
          originX: 0,
          originY: 0,
        },
      },
      {
        resize: {
          height: 64,
          width: 64,
        },
      },
    ]);
    setImage(manipResult);
  }

  function clearPixooScreen() {
    clearPixoo();
  }

  function clearImage() {
    setImage(undefined);
  }

  function saveImage() {
    updateImage(
      Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
      'name',
    );
  }

  return (
    <View flex={1}>
      <View p={2}>
        <Button onPress={clearPixooScreen}>
          <Text>Clear</Text>
        </Button>
      </View>
      {permission?.status === PermissionStatus.GRANTED ? (
        <View flex={1}>
          {image?.uri ? (
            <View flex={1}>
              <View flex={1} px={2}>
                <Image flex={1} source={{ uri: image.uri }} alt={'image'} />
              </View>
              <View>
                <VStack space={2} p={2}>
                  <Button onPress={clearImage}>
                    <Text>Retake</Text>
                  </Button>
                  <Button onPress={saveImage}>
                    <Text>Save</Text>
                  </Button>
                </VStack>
              </View>
            </View>
          ) : (
            <View flex={1}>
              <View flex={1} px={2}>
                <Camera ref={camera} type={type} style={{ flex: 1 }} />
              </View>
              <View>
                <VStack space={2} p={2}>
                  <Button onPress={toggleCameraType}>
                    <Text>Flip Camera</Text>
                  </Button>
                  <Button onPress={takePicture}>
                    <Text>Take Picture</Text>
                  </Button>
                  <Button onPress={saveImage}>
                    <Text>Save</Text>
                  </Button>
                </VStack>
              </View>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}
