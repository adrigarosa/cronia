import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { TabBar } from "../../components/TabBar";

const renderTabBar = (props: BottomTabBarProps) => <TabBar {...props} />;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
      <Tabs.Screen name="index" options={{ title: "Cronología" }} />
      <Tabs.Screen name="search" options={{ title: "Buscar" }} />
      <Tabs.Screen name="stats" options={{ title: "Seguimiento" }} />
    </Tabs>
  );
}
