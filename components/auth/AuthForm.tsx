import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { I18nContext } from "@/i18n/I18nContext";

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (email: string, password: string) => void;
  onOAuthLogin: (provider: string) => void;
}

export function AuthForm({ type, onSubmit, onOAuthLogin }: AuthFormProps) {
  const { t, isRTL } = useContext(I18nContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const isSignup = type === "signup";

  const validateEmail = (email: string): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = () => {
    setError(""); // Clear previous errors

    if (!email || !password) {
      setError(t("auth.error.empty_fields"));
      return;
    }

    if (!validateEmail(email)) {
      setError(t("auth.error.invalid_email"));
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError(t("auth.error.password_mismatch"));
      return;
    }

    // Password strength check (basic example)
    if (password.length < 8) {
      setError(t("auth.error.password_too_short"));
      return;
    }

    onSubmit(email, password);
  };

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <Text style={styles.title}>
        {isSignup ? t("auth.signup.title") : t("auth.login.title")}
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={[styles.input, isRTL && styles.rtlInput]}
        placeholder={t("auth.email_placeholder")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      <TextInput
        style={[styles.input, isRTL && styles.rtlInput]}
        placeholder={t("auth.password_placeholder")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      {isSignup && (
        <TextInput
          style={[styles.input, isRTL && styles.rtlInput]}
          placeholder={t("auth.confirm_password_placeholder")}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isSignup ? t("auth.signup_button") : t("auth.login_button")}
        </Text>
      </TouchableOpacity>

      <View style={styles.oauthContainer}>
        <Text style={styles.orText}>{t("auth.or_separator")}</Text>
        <TouchableOpacity
          style={[styles.oauthButton, styles.googleButton]}
          onPress={() => onOAuthLogin("Google")}
        >
          <Text style={styles.oauthButtonText}>
            {t("auth.oauth_google", { action: isSignup ? t("auth.signup_action") : t("auth.login_action") })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.oauthButton, styles.appleButton]}
          onPress={() => onOAuthLogin("Apple")}
        >
          <Text style={styles.oauthButtonText}>
            {t("auth.oauth_apple", { action: isSignup ? t("auth.signup_action") : t("auth.login_action") })}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  rtlContainer: {
    direction: "rtl",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  rtlInput: {
    textAlign: "right",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  oauthContainer: {
    marginTop: 30,
    borderTopColor: "#eee",
    borderTopWidth: 1,
    paddingTop: 20,
  },
  orText: {
    textAlign: "center",
    color: "#888",
    marginBottom: 20,
    fontSize: 16,
  },
  oauthButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  googleButton: {
    backgroundColor: "#db4437", // Google red
    borderColor: "#db4437",
  },
  appleButton: {
    backgroundColor: "#000", // Apple black
    borderColor: "#000",
  },
  oauthButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});
