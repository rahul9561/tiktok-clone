import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import { auth, db } from "../firebase";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com", 
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (result) => {
          const user = result.user;
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
          });
          router.replace("(tabs)");
        })
        .catch((error) => {
          console.error("Login error:", error);
          Alert.alert("Login Failed", "Something went wrong while signing in.");
        });
    }
  }, [response]);

  return (
    <View className="flex-1 bg-black justify-center items-center px-4">
      {/* App Logo */}
      <Image
        source={require("../assets/icons8.png")}
        className="w-24 h-24 mb-6 rounded-xl"
      />

      <Text className="text-white text-2xl font-bold mb-2">Welcome to TikTok Clone</Text>
      <Text className="text-gray-400 text-sm mb-8">Sign in to continue</Text>

      {/* Google Login Button */}
      <TouchableOpacity
        className="flex-row items-center bg-white px-5 py-3 rounded-full"
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Ionicons name="logo-google" size={20} color="#DB4437" />
        <Text className="text-black text-base font-semibold ml-2">
          Sign in with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
}
