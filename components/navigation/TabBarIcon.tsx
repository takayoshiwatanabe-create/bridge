import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { View } from "react-native"; // Import View for RTL wrapping

interface TabBarIconProps {
  name: ComponentProps<typeof FontAwesome>["name"];
  color: string;
  isRTL: boolean;
}

export function TabBarIcon({ name, color, isRTL }: TabBarIconProps) {
  return (
    <View style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}>
      <FontAwesome
        name={name}
        size={24}
        color={color}
      />
    </View>
  );
}

