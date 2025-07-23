import { View, Text, FlatList, Image } from "react-native";

const notifications = [
  {
    id: "1",
    user: "John Doe",
    avatar: "https://placekitten.com/100/100",
    message: "liked your video",
    time: "2h ago",
  },
  {
    id: "2",
    user: "Jane Smith",
    avatar: "https://placekitten.com/101/101",
    message: "commented: Amazing work! 😍",
    time: "5h ago",
  },
  {
    id: "3",
    user: "Alex Johnson",
    avatar: "https://placekitten.com/102/102",
    message: "started following you",
    time: "1d ago",
  },
];

export default function Notifications() {
  return (
    <View className="flex-1 bg-black px-3 pt-4">
      {/* Header */}
      <Text className="text-white text-2xl font-bold mb-4">🔔 Notifications</Text>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center bg-gray-900 rounded-xl p-3 mb-3">
            {/* Avatar */}
            <Image
              source={{ uri: item.avatar }}
              className="w-12 h-12 rounded-full mr-3"
            />

            {/* Text Content */}
            <View className="flex-1">
              <Text className="text-white font-semibold">
                {item.user}{" "}
                <Text className="text-gray-300 font-normal">{item.message}</Text>
              </Text>
              <Text className="text-gray-500 text-xs mt-1">{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
