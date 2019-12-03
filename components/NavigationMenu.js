import React, { Component } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import GameScreen from "../screens/GameScreen";

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
      {/* <Image source={require('')}/> */}
      <ScrollView>
        <DrawerItems {...props} />
      </ScrollView>
    </View>
  </SafeAreaView>
);

const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: HomeScreen,
    Game: GameScreen,
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
