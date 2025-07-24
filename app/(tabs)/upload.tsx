import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface UploadMediaProps {
  uploadType?: "base64" | "formdata"; // choose upload method
  uploadUrl: string; // API endpoint
}

export default function UploadMedia({
  uploadType = "formdata",
  uploadUrl,
}: UploadMediaProps) {
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState<string>("");

  // Dummy data for recent uploads
  const recentUploads = [
    {
      id: "1",
      uri: "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg",
      isVideo: false,
      caption: "Sunset vibes 🌅",
      likes: 124,
    },
    {
      id: "2",
      uri: "https://images.pexels.com/photos/708440/pexels-photo-708440.jpeg",
      isVideo: true,
      caption: "City lights at night 🎥",
      likes: 89,
    },
    {
      id: "3",
      uri: "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg",
      isVideo: false,
      caption: "Nature escape 🌿",
      likes: 203,
    },
    {
      id: "4",
      uri: "https://images.pexels.com/photos/1036808/pexels-photo-1036808.jpeg",
      isVideo: false,
      caption: "Beach day 🏖️",
      likes: 156,
    },
    {
      id: "5",
      uri: "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg",
      isVideo: true,
      caption: "Adventure time 🚴",
      likes: 95,
    },
  ];

  const pickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "We need access to your media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setMediaUri(asset.uri);
      const isVideoSelected = asset.type === "video";
      setIsVideo(isVideoSelected);

      if (uploadType === "base64") {
        const base64 = await FileSystem.readAsStringAsync(asset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setBase64Data(base64);
      }
    }
  };

  const uploadMedia = async () => {
    if (!mediaUri) {
      Alert.alert("No file", "Please select a media first!");
      return;
    }

    setIsUploading(true);
    try {
      let response;

      if (uploadType === "base64" && base64Data) {
        const payload = {
          file: `data:${isVideo ? "video/mp4" : "image/jpeg"};base64,${base64Data}`,
          caption,
        };

        response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const formData = new FormData();
        formData.append("file", {
          uri: mediaUri,
          name: isVideo ? "upload.mp4" : "upload.jpg",
          type: isVideo ? "video/mp4" : "image/jpeg",
        } as any);
        formData.append("caption", caption);

        response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
      }

      const data = await response.json();
      Alert.alert("Upload Successful", JSON.stringify(data));
      setMediaUri(null);
      setBase64Data(null);
      setCaption("");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white mt-11 mx-3">
      {/* Header */}
      <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
        <Text className="text-xl font-bold">Upload Media</Text>
        <TouchableOpacity
          className="p-2"
          onPress={() => {
            setMediaUri(null);
            setBase64Data(null);
            setCaption("");
          }}
          disabled={isUploading}
        >
          <Ionicons name="close-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Media Selection Section */}
      <View className="items-center p-4">
        {!mediaUri ? (
          <>
            {/* Upload Icon */}
            <View className="bg-gray-100 w-20 h-20 rounded-full justify-center items-center mb-4">
              <Ionicons name="cloud-upload-outline" size={40} color="#333" />
            </View>

            {/* Pick Button */}
            <TouchableOpacity
              className="bg-blue-500 px-8 py-3 rounded-xl"
              onPress={pickMedia}
              disabled={isUploading}
            >
              <Text className="text-white text-base font-semibold">
                Select Image or Video
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Media Preview */}
            <View className="w-full max-w-md">
              {isVideo ? (
                <Video
                  source={{ uri: mediaUri }}
                  className="w-full h-96 rounded-xl"
                  useNativeControls
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={{ uri: mediaUri }}
                  className="w-full h-96 rounded-xl"
                  resizeMode="cover"
                />
              )}
            </View>

            {/* Caption Input */}
            <TextInput
              className="w-full max-w-md border border-gray-300 rounded-lg p-3 mt-4"
              placeholder="Write a caption..."
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={2200}
              placeholderTextColor="#999"
            />

            {/* Upload and Cancel Buttons */}
            <View className="flex-row mt-4 space-x-4">
              <TouchableOpacity
                className={`bg-blue-500 px-8 py-3 rounded-xl ${isUploading ? "opacity-50" : ""}`}
                onPress={uploadMedia}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-base font-semibold">
                    Upload
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-200 px-8 py-3 rounded-xl"
                onPress={() => {
                  setMediaUri(null);
                  setBase64Data(null);
                  setCaption("");
                }}
                disabled={isUploading}
              >
                <Text className="text-gray-800 text-base font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Recent Uploads Section */}
      <View className="p-4">
        <Text className="text-lg font-semibold mb-3">Recent Uploads</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentUploads.map((item) => (
            <View key={item.id} className="mr-4 items-center">
              {item.isVideo ? (
                <Video
                  source={{ uri: item.uri }}
                  className="w-28 h-28 rounded-lg"
                  resizeMode="cover"
                  isMuted
                  shouldPlay
                  isLooping
                />
              ) : (
                <Image
                  source={{ uri: item.uri }}
                  className="w-28 h-28 rounded-lg"
                  resizeMode="cover"
                />
              )}
              <Text className="text-xs text-gray-600 mt-1 text-center">
                {item.caption}
              </Text>
              <Text className="text-xs text-gray-400 mt-1">❤️ {item.likes}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}