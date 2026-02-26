import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { AuthForm } from "@/components/auth/AuthForm";
import { DisclaimerBadge } from "@/components/DisclaimerBadge";
import { Stack } from "expo-router";
import { I18nContext } from "@/i18n/I18nContext";

export default function SignupScreen() {
  const { t, isRTL } = useContext(I18nContext);

  const handleSignup = (email: string, password: string) => {
    // Placeholder for signup logic
    console.log("Signup attempt:", { email, password });
    // In a real app, this would call an API
  };

  const handleOAuthSignup = (provider: string) => {
    // Placeholder for OAuth 2.0 PKCE flow
    console.log("OAuth signup with:", provider);
    // In a real app, this would initiate the OAuth flow
  };

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <Stack.Screen options={{ title: t("auth.signup.title") }} />
      <AuthForm
        type="signup"
        onSubmit={handleSignup}
        onOAuthLogin={handleOAuthSignup} // Reusing for signup, might be separate in future
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
  rtlContainer: {
    direction: "rtl",
  },
  disclaimerContainer: {
    marginTop: 20,
  },
});
