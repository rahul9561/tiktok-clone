import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        plan: 'free',
        createdAt: serverTimestamp(),
      });

      router.push('/(tabs)');
    } catch (err) {
      setError(err.message);
    }
  };




  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome  to <Text style={styles.highlight}>TIK TOK</Text>
      </Text>
      <Text style={styles.subtitle}>powered by Me</Text>


      {/* Google Sign In */}
     {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
        <Text style={styles.loginText}>Signup</Text>
      </TouchableOpacity>




  {/* Footer */}
      <Text style={styles.footer}>
         have an account?{" "}
        <Link href="/login" style={styles.link}>
          Login
        </Link>
      </Text>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  highlight: {
    color: "#ff4444",
  },
  subtitle: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#ff4444",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  guestButton: {
     width: "100%",
    backgroundColor: "transparent", // ✅ Transparent background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: "#333", // ✅ White border (TikTok style)
  },
  guestText: {
    color: "#fff", // ✅ White text for dark background
    fontSize: 16,
    fontWeight: "bold",
  },

  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4285F4",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    marginBottom: 20,
  },
  googleText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
  footer: {
    color: "#ccc",
    fontSize: 14,
  },
  link: {
    color: "#ff4444",
    fontWeight: "bold",
  }
});
