import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Drawing } from '../drawing';
import { Picture } from '../picture';
import { Settings } from '../settings';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export function Dashboard(): JSX.Element {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Drawing"
        component={Drawing}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons name={'pencil-outline'} size={size} color={color} />
            );
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        }}
      />
      <Tab.Screen
        name="Picture"
        component={Picture}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons name={'camera-outline'} size={size} color={color} />
            );
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name={'cog-outline'} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        }}
      />
    </Tab.Navigator>
  );
}
