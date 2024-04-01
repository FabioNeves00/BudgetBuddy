import React from "react";
import 'react-native-gesture-handler';
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider, useAuth } from "@/contexts";
import { AppDrawer, GuestStack } from "@/navigation";


const AppContent = () => {
  const { loggedInUser } = useAuth();
  return (
    <NavigationContainer>
      {loggedInUser ? <AppDrawer /> : <GuestStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
