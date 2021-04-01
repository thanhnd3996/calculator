import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Calculator from './src/Calculator';
import Graph from './src/Graph';
import ShowGraph from './src/ShowGraph';
import React from 'react';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Calculator" component={Calculator} />
        <Stack.Screen name="Graph" component={Graph} />
        <Stack.Screen name="ShowGraph" component={ShowGraph} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
