import { auth } from "@/firebase";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserData({
        photoURL:
          currentUser.photoURL ||
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        displayName: currentUser.displayName || "User",
        email: currentUser.email || "No Email",
      });
      setIsLoading(false);
    } else {
      setIsLoading(false); // No user, stop loading
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  // If not logged in, show login prompt
  if (!isLoading && !userData) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg font-semibold mb-4">
          You are not logged in
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="bg-blue-500 rounded-lg py-2 px-4"
        >
          <Text className="text-white text-center font-semibold">
            Login Here
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show loading indicator while fetching user data
  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render profile when user is logged in
  return (
    <ScrollView className="flex-1 bg-white mt-11 mx-3">
      {/* Profile Header */}
      <View className="flex-row items-center p-4">
        <View>
            <Text className="text-gray-600 mb-5 text-md">{userData.email }</Text>
        <Image
          source={{ uri: userData.photoURL }}
          className="w-24 h-24 rounded-full border border-gray-200"
        />
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-xl font-semibold ">
            {userData.displayName} creater
          </Text>
          <View className="flex-row mt-2  text-xl">
            <View className="items-center mr-4">
              <Text className="font-bold text-xl">120</Text>
              <Text className="text-gray-500 text-xl">Posts</Text>
            </View>
            <View className="items-center mr-4">
              <Text className="font-bold text-xl">80</Text>
              <Text className="text-gray-500 text-xl">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="font-bold text-xl">300</Text>
              <Text className="text-gray-500 text-xl">Following</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bio Section */}
      <View className="px-4">
        <Text className="text-sm font-semibold">{userData.displayName}</Text>
        <Text className="text-sm text-gray-600">
          Bio: Living my best life 📸✨
        </Text>
      </View>

      {/* Edit Profile and Logout Buttons */}
      <View className="flex-row px-4 mt-4">
        <TouchableOpacity className="flex-1 bg-gray-200 rounded-lg py-2 mr-2">
          <Text className="text-center font-semibold text-sm">Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-gray-200 rounded-lg py-2 px-4"
        >
          <Text className="text-center font-semibold text-sm">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Story Highlights */}
      <View className="mt-4 px-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[...Array(5)].map((_, index) => (
            <View key={index} className="items-center mr-4">
              <View className="w-16 h-16 rounded-full border-2 border-red-400 p-0.5">
                <Image
                  source={{ uri: userData.photoURL }}
                  className="w-full h-full rounded-full"
                />
              </View>
              <Text className="text-xs mt-1">Highlight {index + 1}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Tabs for Posts, Followers, Following */}
      <View className="flex-row border-t border-gray-200 mt-4">
        <TouchableOpacity className="flex-1 py-2 border-b-2 border-black">
          <Text className="text-center font-semibold">Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 py-2">
          <Text className="text-center text-gray-500">Reels</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 py-2">
          <Text className="text-center text-gray-500">Contacts</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Grid */}
      <View className="flex-row flex-wrap">
        {[...Array(9)].map((_, index) => (
          <Image
            key={index}
            source={{ uri: "https://via.placeholder.com/150" }}
            className="w-1/3 h-32"
          />
        ))}
      </View>
    </ScrollView>
  );
}