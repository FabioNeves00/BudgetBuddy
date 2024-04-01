import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { HomeScreen } from "@/screens";
import { CategoriesScreen } from "@/screens/Categories";

const Drawer = createDrawerNavigator();

export const AppDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Categories"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Categories" component={CategoriesScreen} />
    </Drawer.Navigator>
  );
};
