import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";

const dummyData = [
  { id: "1", thumbnail: "https://placekitten.com/300/500" },
  { id: "2", thumbnail: "https://placekitten.com/301/500" },
  { id: "3", thumbnail: "https://placekitten.com/302/500" },
  { id: "4", thumbnail: "https://placekitten.com/303/500" },
  { id: "5", thumbnail: "https://placekitten.com/304/500" },
  { id: "6", thumbnail: "https://placekitten.com/305/500" },
];

export default function Discover() {
  return (
    <View className="flex-1 bg-black px-1 pt-4">
      {/* Header */}
      <Text className="text-white text-2xl font-bold mb-4 px-2">
        🔥 Discover
      </Text>

      {/* Grid Thumbnails */}
      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-1 m-1 rounded-lg overflow-hidden bg-gray-800"
          >
            <Image
              source={{ uri: item.thumbnail }}
              className="w-full h-64"
              resizeMode="cover"
              onError={() => console.log("Image failed to load:", item.thumbnail)}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
