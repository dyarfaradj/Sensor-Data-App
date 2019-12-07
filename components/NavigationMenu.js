import React, { Component } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import GraphScreen from "../screens/GraphScreen";

export default class NavigationMenu extends Component {
  constructor() {
    super();
  }

  render() {
    const AppNavigation = createAppContainer(AppDrawerNavigator);
    return <AppNavigation />;
  }
}

const CustomDrawerComponent = props => (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={{ height: 150, backgroundColor: "white" }}>
      <ScrollView>
        <DrawerItems {...props} />
      </ScrollView>
    </View>
  </SafeAreaView>
);

const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: HomeScreen,
    Graph: GraphScreen,
    Settings: SettingsScreen
  },
  {
    contentComponent: CustomDrawerComponent
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%"
  }
});
