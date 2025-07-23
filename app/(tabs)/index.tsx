import React, { useRef, useState } from "react";
import { View, FlatList, Dimensions, TouchableOpacity, Text, Image } from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
const { height } = Dimensions.get("window");

const videos = [
  {
    id: "1",
    uri: "https://www.w3schools.com/html/mov_bbb.mp4",
    user: "John Doe",
    description: "Amazing sunset view 🌅",
    hashtags: "#nature #sunset #beautiful",
    likes: 120,
    comments: 15,
    shares: 8,
  },
  {
    id: "2",
    uri: "https://www.w3schools.com/html/movie.mp4",
    user: "Jane Smith",
    description: "This dog is too cute 🐶",
    hashtags: "#dog #pets #funny",
    likes: 340,
    comments: 52,
    shares: 20,
  },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const videoRefs = useRef<Video[]>([]);
  const [likedVideos, setLikedVideos] = useState<{ [key: string]: boolean }>({});

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index || 0;
      setActiveIndex(index);
    }
  });

  const toggleLike = (id: string) => {
    setLikedVideos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <FlatList
      data={videos}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <View className="relative" style={{ height }}>
          {/* Video */}
          <Video
            ref={(ref) => {
              if (ref) videoRefs.current[index] = ref;
            }}
            source={{ uri: item.uri }}
            style={{ flex: 1 }}
            resizeMode="cover"
            shouldPlay={index === activeIndex}
            isLooping
            isMuted={muted}
          />

          {/* Mute Button */}
          <TouchableOpacity
            className="absolute bottom-20 right-6"
            onPress={() => setMuted(!muted)}
          >
            <Ionicons
              name={muted ? "volume-mute" : "volume-high"}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>

          {/* Right Side Action Buttons */}
          <View className="absolute bottom-28 right-4 items-center">
            {/* Like */}
            <TouchableOpacity onPress={() => toggleLike(item.id)} className="items-center mb-5">
              <Ionicons
                name={likedVideos[item.id] ? "heart" : "heart-outline"}
                size={36}
                color={likedVideos[item.id] ? "red" : "#fff"}
              />
              <Text className="text-white text-xs mt-1">{item.likes + (likedVideos[item.id] ? 1 : 0)}</Text>
            </TouchableOpacity>

            {/* Comment */}
            <TouchableOpacity className="items-center mb-5">
              <Ionicons name="chatbubble-outline" size={32} color="#fff" />
              <Text className="text-white text-xs mt-1">{item.comments}</Text>
            </TouchableOpacity>

            {/* Share */}
            <TouchableOpacity className="items-center">
              <Ionicons name="arrow-redo-outline" size={32} color="#fff" />
              <Text className="text-white text-xs mt-1">{item.shares}</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Left: User, Description, Hashtags */}
          <View className="absolute bottom-16 left-4 w-3/5">
            <Text className="text-white font-bold text-base">@{item.user}</Text>
            <Text className="text-white text-sm mt-1">{item.description}</Text>
            <Text className="text-gray-300 text-sm mt-1">{item.hashtags}</Text>
            <p className="text-lg font-medium">Welcome to Tailwind</p>
          </View>
        </View>
      )}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
    />
  );
}
