// Importerer nødvendige moduler
import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { getApps, initializeApp } from "firebase/app";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Importerer komponenter for de forskellige skærme
import CreatePage from "./components/mainPage"; 
import OfferPage from "./components/offerPage"; 
import MainPage from "./components/createPage"; 

// Firebase-konfiguration der forbinder til database
const firebaseConfig = {
  apiKey: "AIzaSyCLRbQdp6oSPbiceBcR1JlrYQmIBGb52_0",
  authDomain: "inno-95b61.firebaseapp.com",
  projectId: "inno-95b61",
  storageBucket: "inno-95b61.appspot.com",
  messagingSenderId: "1043791623724",
  appId: "1:1043791623724:web:fb40e9d8ceb06df9abc389",
  databaseURL:
    "https://inno-95b61-default-rtdb.europe-west1.firebasedatabase.app",
};

if (getApps().length < 1) {
  initializeApp(firebaseConfig); // starter Firebase
  console.log("Firebase On!"); // kontrollerer at den køre.
}

// Definerer Stack Navigator til at håndtere navigation mellem skærme
const Stack = createStackNavigator();
const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="CreatePage">
      <Stack.Screen name="CreatePage" component={CreatePage} />
      <Stack.Screen name="OfferPage" component={OfferPage} />
      <Stack.Screen name="Edit Tutor Offer" component={MainPage} />
    </Stack.Navigator>
  );
};

// Definerer Tab Navigator til at skifte mellem forskellige hovedskærme
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Tilgængelig Tider"
          component={StackNavigation}
          options={{
            tabBarIcon: () => <Ionicons name="home" size={20} />,
            headerShown: null,
          }}
        />
        <Tab.Screen
          name="Tilføj Opslag"
          component={MainPage}
          options={{
            tabBarIcon: () => <Ionicons name="add" size={20} />,
            headerShown: null,
          }}
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
