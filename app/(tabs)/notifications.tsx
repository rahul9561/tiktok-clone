import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const notifications = [
  {
    id: "1",
    user: "John Doe",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    message: "liked your video",
    time: "2h ago",
    type: "like",
    postImage: "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg",
  },
  {
    id: "2",
    user: "Jane Smith",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    message: "commented: Amazing work! 😍",
    time: "5h ago",
    type: "comment",
    postImage: "https://images.pexels.com/photos/708440/pexels-photo-708440.jpeg",
  },
  {
    id: "3",
    user: "Alex Johnson",
    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
    message: "started following you",
    time: "1d ago",
    type: "follow",
  },
  {
    id: "4",
    user: "Emma Brown",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    message: "liked your photo",
    time: "3h ago",
    type: "like",
    postImage: "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg",
  },
  {
    id: "5",
    user: "Michael Lee",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    message: "mentioned you in a story",
    time: "6h ago",
    type: "mention",
    postImage: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
  },
  {
    id: "6",
    user: "Sarah Davis",
    avatar: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg",
    message: "shared your post",
    time: "12h ago",
    type: "share",
    postImage: "https://images.pexels.com/photos/1036808/pexels-photo-1036808.jpeg",
  },
];

export default function Notifications() {
  return (
    <View className="flex-1 bg-white mt-11 mx-3">
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <Text className="text-xl font-bold">Notifications</Text>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center p-3 border-b border-gray-100">
            {/* Avatar */}
            <Image
              source={{ uri: item.avatar }}
              className="w-12 h-12 rounded-full mr-3 border border-gray-200"
            />

            {/* Text Content */}
            <View className="flex-1">
              <Text className="text-sm font-semibold">
                {item.user}{" "}
                <Text className="text-gray-600 font-normal">{item.message}</Text>
              </Text>
              <Text className="text-gray-400 text-xs mt-1">{item.time}</Text>
            </View>

            {/* Action or Post Preview */}
            {item.type === "follow" ? (
              <TouchableOpacity className="bg-blue-500 rounded-lg px-3 py-1.5">
                <Text className="text-white text-xs font-semibold">Follow</Text>
              </TouchableOpacity>
            ) : (
              item.postImage && (
                <Image
                  source={{ uri: item.postImage }}
                  className="w-12 h-12 rounded-lg"
                />
              )
            )}
          </View>
        )}
      />
    </View>
  );
}