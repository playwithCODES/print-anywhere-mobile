
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";

import { useAuth } from "@/context/auth.context";

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing fields",
        "Please enter your email and password."
      );
      return;
    }

    try {
      setIsLoading(true);

      await signIn(email.trim().toLowerCase(), password);

      router.replace("/(app)");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Unable to login. Please try again.";

      Alert.alert("Login failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>P</Text>
          </View>

          <Text style={styles.title}>PrintAnywhere</Text>

          <Text style={styles.subtitle}>
            Print your documents from anywhere.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            <Text style={styles.label}>Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="current-password"
            />

            <Pressable
              style={[
                styles.loginButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>
                  Login
                </Text>
              )}
            </Pressable>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>

            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text style={styles.registerLink}>
                  Register
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  content: {
    paddingHorizontal: 28,
    paddingVertical: 40,
    alignItems: "center",
  },

  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 36,
    textAlign: "center",
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
    marginTop: 16,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
  },

  loginButton: {
    height: 54,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  disabledButton: {
    opacity: 0.7,
  },

  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    gap: 6,
  },

  registerText: {
    fontSize: 14,
    color: "#64748B",
  },

  registerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
  },
});
