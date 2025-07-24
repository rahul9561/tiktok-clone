/** @format */

import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
    uri: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_30MB.mp4",
    user: "Jane Smith",
    description: "This dog is too cute 🐶",
    hashtags: "#dog #pets #funny",
    likes: 340,
    comments: 52,
    shares: 20,
  },
  {
    id: "3",
    uri: "https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-the-beach-1416-large.mp4",
    user: "Emma Brown",
    description: "Beach vibes all day 🏖️",
    hashtags: "#beach #ocean #summer",
    likes: 256,
    comments: 28,
    shares: 12,
  },
  {
    id: "4",
    uri: "https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-1361-large.mp4",
    user: "Michael Lee",
    description: "City lights at night 🌃",
    hashtags: "#citylife #night #urban",
    likes: 189,
    comments: 10,
    shares: 15,
  },
  {
    id: "5",
    uri: "https://assets.mixkit.co/videos/preview/mixkit-person-playing-guitar-151-large.mp4",
    user: "Sarah Davis",
    description: "Chasing melodies 🎸",
    hashtags: "#music #guitar #vibes",
    likes: 432,
    comments: 45,
    shares: 25,
  },
  {
    id: "6",
    uri: "https://assets.mixkit.co/videos/preview/mixkit-hiker-walking-in-the-forest-146-large.mp4",
    user: "Alex Johnson",
    description: "Lost in the forest 🌲",
    hashtags: "#hiking #nature #adventure",
    likes: 298,
    comments: 33,
    shares: 18,
  },
  {
    id: "7",
    uri: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-coffee-cup-156-large.mp4",
    user: "Lisa Wong",
    description: "Morning coffee ritual ☕",
    hashtags: "#coffee #morning #cozy",
    likes: 165,
    comments: 20,
    shares: 9,
  },
  {
    id: "8",
    uri: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-hip-hop-149-large.mp4",
    user: "Chris Evans",
    description: "Dance like nobody’s watching 💃",
    hashtags: "#dance #hiphop #energy",
    likes: 387,
    comments: 60,
    shares: 30,
  },
];

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const isFocused = useIsFocused();
  const [likedVideos, setLikedVideos] = useState<{ [key: string]: boolean }>({});
  const [progress, setProgress] = useState<number[]>(videos.map(() => 0));
  const [following, setFollowing] = useState<{ [key: string]: boolean }>({});
  const [showComments, setShowComments] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollBarOpacity = useRef(new Animated.Value(0)).current;
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const videoRefs = useRef<Video[]>([]);
  // ✅ Pause all videos when the tab changes
  useFocusEffect(
    useCallback(() => {
      return () => {
        videoRefs.current.forEach(async (video) => {
          if (video) {
            await video.pauseAsync(); // ✅ Pause video
          }
        });
      };
    }, [])
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index || 0;
      setActiveIndex(index);
    }
  });

 



  const [comments, setComments] = useState([
    { id: 1, text: "@user1: Wow amazing!" },
    { id: 2, text: "@user2: So cute 😍" },
    { id: 3, text: "@user3: Love this video ❤️" },
    { id: 4, text: "@user4: Awesome 🔥" },
    { id: 5, text: "@user5: Great shot!" },
    { id: 6, text: "@user6: More please 😁" },
  ]);

  const handlePress = () => {
    if (!inputValue.trim()) return;
    const newComment = { id: Date.now(), text: `@you: ${inputValue}` };
    setComments((prev) => [...prev, newComment]);
    setInputValue("");
    console.log("Input submitted:", inputValue);
  };

  const toggleLike = (id: string) =>
    setLikedVideos((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleFollow = (id: string) =>
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));

  const handlePlaybackUpdate = (status: any, index: number) => {
    if (!status.isLoaded || !status.durationMillis) return;
    const percentage = (status.positionMillis / status.durationMillis) * 100;
    setProgress((prev) => {
      const updated = [...prev];
      updated[index] = percentage;
      return updated;
    });
  };

  const handleScrollBegin = () => {
    setIsScrolling(true);
    Animated.timing(scrollBarOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
  };

  const handleScrollEnd = () => {
    scrollTimeout.current = setTimeout(() => {
      Animated.timing(scrollBarOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setIsScrolling(false));
    }, 1000);
  };

  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    if (contentHeight <= scrollViewHeight) return;

    const scrollPercentage = contentOffsetY / (contentHeight - scrollViewHeight);
    const scrollBarHeight = (height / videos.length) * 0.5;
    const maxScrollBarTop = height - scrollBarHeight - 16;
    const scrollBarTop = scrollPercentage * maxScrollBarTop;
  };

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={videos}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={handleScroll}
        renderItem={({ item, index }) => (
          <View style={styles.videoContainer}>
            {/* Video */}
<Video
  ref={(ref) => {
    if (ref) videoRefs.current[index] = ref;
  }}
  source={{ uri: item.uri }}
  style={styles.video}
  resizeMode="cover"
  shouldPlay={index === activeIndex}
  isLooping
  isMuted={muted}
  onPlaybackStatusUpdate={(status) =>
    handlePlaybackUpdate(status, index)
  }
/>


            {/* Gradient Overlay */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.gradientOverlay}
            />

            {/* Video Progress */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress[index]}%` }]} />
            </View>

            {/* Mute Button */}
            <TouchableOpacity
              style={styles.muteButton}
              onPress={() => setMuted(!muted)}
            >
              <Ionicons
                name={muted ? "volume-mute" : "volume-high"}
                size={26}
                color="#fff"
              />
            </TouchableOpacity>

            {/* Right Side Buttons */}
            <View style={styles.rightButtons}>
              <TouchableOpacity
                onPress={() => toggleLike(item.id)}
                style={styles.iconContainer}
              >
                <Ionicons
                  name={likedVideos[item.id] ? "heart" : "heart-outline"}
                  size={32}
                  color={likedVideos[item.id] ? "#FF3040" : "#fff"}
                />
                <Text style={styles.iconText}>
                  {item.likes + (likedVideos[item.id] ? 1 : 0)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setShowComments(true)}
              >
                <Ionicons name="chatbubble-outline" size={30} color="#fff" />
                <Text style={styles.iconText}>{item.comments}</Text>
               
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconContainer}>
                <Ionicons name="arrow-redo-outline" size={30} color="#fff" />
                <Text style={styles.iconText}>{item.shares}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconContainer}>
                <Ionicons name="ellipsis-vertical" size={26} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Bottom Left Info */}
            <View style={styles.bottomInfo}>
              <View style={styles.userInfo}>
                <Text style={styles.username}>@{item.user}</Text>
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={() => toggleFollow(item.id)}
                >
                  <Text style={styles.followButtonText}>
                    {following[item.id] ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.hashtags}>{item.hashtags}</Text>
            </View>

            {/* Custom Scroll Indicator */}
            <Animated.View
              style={[
                styles.scrollIndicator,
                {
                  opacity: scrollBarOpacity,
                  height: (height / videos.length) * 0.5,
                  top: 16,
                },
              ]}
            />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 100 }}
      />

      {/* Comment Modal */}
      <Modal
        visible={showComments}
        transparent
        animationType="slide"
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>

            <Text style={styles.modalTitle}>Comments</Text>

            <FlatList
              data={comments}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Ionicons name="person-circle" size={36} color="#6B7280" />
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text className="text-red-500 text-[11px] ">Reply</Text>
                </View>
              )}
            />
           

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowComments(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Add a comment..."
                placeholderTextColor="#9CA3AF"
                value={inputValue}
                onChangeText={setInputValue}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handlePress}
              >
                <Ionicons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    height: height,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '33%',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  muteButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 9999,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  rightButtons: {
    position: 'absolute',
    bottom: 128,
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 110,
    left: 16,
    width: '80%',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  followButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  hashtags: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dragHandle: {
    width: 48,
    height: 6,
    backgroundColor: '#D1D5DB',
    borderRadius: 9999,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  commentText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#EF4444',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  inputContainer: {
    marginTop: 16,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 9999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sendButton: {
    position: 'absolute',
    right: 1,
    top: '58%',
    transform: [{ translateY: -10 }],
    backgroundColor: '#3B82F6',
    borderRadius: 9999,
    padding: 10,
  },
  scrollIndicator: {
    position: 'absolute',
    right: 8,
    width: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 9999,
  },
});