import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import React, { useState } from 'react';
import { Dashboard } from './src/screens/dashboard';

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Dashboard />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
