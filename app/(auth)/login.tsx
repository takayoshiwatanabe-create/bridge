import React from "react";
import { View, StyleSheet } from "react-native";
import { AuthForm } from "@/components/auth/AuthForm";
import { DisclaimerBadge } from "@/components/DisclaimerBadge";
import { t } from "@/i18n";
import { Stack } from "expo-router";

export default function LoginScreen() {
  const handleLogin = (email: string, password: string) => {
    // Placeholder for login logic
    console.log("Login attempt:", { email, password });
    // In a real app, this would call an API
  };

  const handleOAuthLogin = (provider: string) => {
    // Placeholder for OAuth 2.0 PKCE flow
    console.log("OAuth login with:", provider);
    // In a real app, this would initiate the OAuth flow
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t("auth.login.title") }} />
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        onOAuthLogin={handleOAuthLogin}
      />
      <View style={styles.disclaimerContainer}>
        <DisclaimerBadge />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  disclaimerContainer: {
    marginTop: 20,
  },
});
