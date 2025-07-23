import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";

export default function Upload() {
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);

  const pickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "We need access to your media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // ✅ Supports both Image & Video
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setMediaUri(asset.uri);
      setIsVideo(asset.type === "video");
    }
  };

  return (
    <View className="flex-1 bg-black justify-center items-center px-4">
      {!mediaUri ? (
        <>
          {/* Upload Icon */}
          <View className="bg-gray-800 w-28 h-28 rounded-2xl justify-center items-center mb-6">
            <Ionicons name="cloud-upload-outline" size={60} color="white" />
          </View>

          {/* Button */}
          <TouchableOpacity
            className="bg-red-600 px-6 py-3 rounded-full"
            onPress={pickMedia}
          >
            <Text className="text-white text-lg font-semibold">Select Image or Video</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Preview Media */}
          {isVideo ? (
            <Video
              source={{ uri: mediaUri }}
              className="w-72 h-96 rounded-lg"
              useNativeControls
              resizeMode="contain"
            />
          ) : (
            <Image
              source={{ uri: mediaUri }}
              className="w-72 h-96 rounded-lg"
              resizeMode="cover"
            />
          )}

          {/* Choose Again */}
          <TouchableOpacity
            className="bg-gray-700 px-6 py-2 rounded-full mt-4"
            onPress={() => setMediaUri(null)}
          >
            <Text className="text-white">Choose Another</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
