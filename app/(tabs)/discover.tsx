import { auth } from "@/firebase";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Discover() {
  const user = auth.currentUser || {
    photoURL: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    displayName: "rahul",
    email: "rahul@example.com"
  };
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  // Dummy data for posts
  const dummyPosts = [
    { id: 1, image: "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg", likes: 245, comments: 12 },
    { id: 2, image: "https://images.pexels.com/photos/708440/pexels-photo-708440.jpeg", likes: 189, comments: 8 },
    { id: 3, image: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg", likes: 320, comments: 15 },
    { id: 4, image: "https://images.pexels.com/photos/1036808/pexels-photo-1036808.jpeg", likes: 167, comments: 5 },
    { id: 5, image: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg", likes: 412, comments: 20 },
    { id: 6, image: "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg", likes: 298, comments: 10 },
    { id: 7, image: "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg", likes: 156, comments: 7 },
    { id: 8, image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg", likes: 234, comments: 9 },
    { id: 9, image: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg", likes: 387, comments: 14 },
  ];

  // Dummy data for suggested users
  const suggestedUsers = [
    { id: 1, name: "travelbug", photo: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg" },
    { id: 2, name: "foodiequeen", photo: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" },
    { id: 3, name: "artlover", photo: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg" },
    { id: 4, name: "naturevibes", photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg" },
  ];

  return (
    <ScrollView className="flex-1 bg-white mt-11 mx-3">
      {/* Header with Search Bar */}
      <View className="p-4 bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold">Discover</Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-gray-200 rounded-lg px-3 py-1"
          >
            <Text className="text-sm font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
        <View className="mt-3 bg-gray-100 rounded-full px-4 py-2">
          <TextInput
            placeholder="Search people, tags..."
            className="text-sm"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Suggested Users */}
      <View className="px-4 mb-4">
        <Text className="text-sm font-semibold mb-2">Suggested for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {suggestedUsers.map((sUser) => (
            <View key={sUser.id} className="items-center mr-4">
              <Image
                source={{ uri: sUser.photo }}
                className="w-16 h-16 rounded-full border border-gray-200"
              />
              <Text className="text-xs mt-1 text-center">{sUser.name}</Text>
              <TouchableOpacity className="mt-1 bg-blue-500 rounded-lg px-3 py-1">
                <Text className="text-white text-xs font-semibold">Follow</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Discover Posts Grid */}
      <View className="flex-row flex-wrap">
        {dummyPosts.map((post) => (
          <TouchableOpacity key={post.id} className="w-1/3 p-0.5">
            <Image
              source={{ uri: post.image }}
              className="w-full h-40"
              resizeMode="cover"
            />
            <View className="absolute bottom-2 left-2 flex-row items-center">
              <Text className="text-white text-xs font-semibold mr-2">❤️ {post.likes}</Text>
              <Text className="text-white text-xs font-semibold">💬 {post.comments}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}