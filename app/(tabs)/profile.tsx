import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

export default function Profile() {
  const user = auth.currentUser || "rahul";
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };


  return (
    <View className="flex-1 bg-black items-center pt-16">
      {/* User Avatar */}
      {user && (
        <>
          <Image
            source={{ uri: user.photoURL || "" }}
            className="w-24 h-24 rounded-full border-2 border-white"
          />
          <Text className="text-white text-xl font-bold mt-4">
            {user.displayName}
          </Text>
          <Text className="text-gray-400 text-sm">{user.email}</Text>

          {/* Stats Row */}
          <View className="flex-row justify-between w-3/4 mt-6">
            <View className="items-center">
              <Text className="text-white text-lg font-bold">120</Text>
              <Text className="text-gray-400 text-xs">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-lg font-bold">80</Text>
              <Text className="text-gray-400 text-xs">Following</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-lg font-bold">300</Text>
              <Text className="text-gray-400 text-xs">Likes</Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-600 rounded-full px-6 py-2 mt-8"
          >
            <Text className="text-white font-semibold text-sm">Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
