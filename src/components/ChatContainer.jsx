import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/AuthContext";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
    deleteMessage,
    setMessages,
  } = useContext(ChatContext);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const handleDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
  };

  const confirmDelete = async () => {
    try {
      await deleteMessage(messageToDelete);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageToDelete));
      toast.success("Сообщение удалено", {
        icon: "✅",
        style: {
          background: "#059669",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Ошибка удаления:", error);
      toast.error(error.response?.data?.message || "Ошибка при удалении", {
        icon: "❌",
        style: {
          background: "#dc2626",
          color: "#fff",
        },
      });
    } finally {
      setMessageToDelete(null);
    }
  };

  const cancelDelete = () => {
    setMessageToDelete(null);
  };

  const scrollEnd = useRef();
  const fileInputRef = useRef();
  const [input, setInput] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showFormatTooltip, setShowFormatTooltip] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const typingTimeout = useRef(null);

  // Увеличенные лимиты
  const supportedFormats = {
    images: ["jpg", "jpeg", "png", "gif", "webp", "bmp"],
    videos: ["mp4", "webm", "mov", "avi", "mkv"],
    maxSize: 300, // 300MB
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (input.trim() === "" && !mediaPreview) return;

    setIsTyping(true);

    const messageData = {
      text: input.trim(),
      replyTo: replyingTo?._id || null,
    };

    if (mediaPreview) {
      messageData[mediaType] = mediaPreview;
      messageData.fileType = mediaType;
    }

    await sendMessage(messageData);

    setInput("");
    setMediaPreview(null);
    setMediaType(null);
    setReplyingTo(null);
    setIsTyping(false);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Get file extension
    const fileExt = file.name.split(".").pop().toLowerCase();
    const isImage = supportedFormats.images.includes(fileExt);
    const isVideo = supportedFormats.videos.includes(fileExt);

    if (!isImage && !isVideo) {
      toast.error(
        `Unsupported file format. Supported: ${[
          ...supportedFormats.images,
          ...supportedFormats.videos,
        ].join(", ")}`
      );
      return;
    }

    if (file.size > supportedFormats.maxSize * 1024 * 1024) {
      toast.error(
        `File size should be less than ${supportedFormats.maxSize}MB`
      );
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () =>
      toast.loading(`Uploading ${isImage ? "image" : "video"}...`);
    reader.onloadend = () => {
      toast.dismiss();
      setMediaType(isImage ? "image" : "video");
      setMediaPreview(reader.result);
      e.target.value = "";
    };
    reader.onerror = () => {
      toast.error(`Error uploading ${isImage ? "image" : "video"}`);
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const cancelMediaUpload = () => {
    setMediaPreview(null);
    setMediaType(null);
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    // Focus on input field
    document.querySelector('input[type="text"]')?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    const scrollContainer = scrollEnd.current?.parentElement;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollContainer.scrollTimeout);
      scrollContainer.scrollTimeout = setTimeout(
        () => setIsScrolling(false),
        500
      );
    };

    scrollContainer?.addEventListener("scroll", handleScroll);
    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(input.length > 0);
    }, 300); // adjust delay as needed

    return () => clearTimeout(timeout);
  }, [input]);

  useEffect(() => {
    if (scrollEnd.current && messages && !isScrolling) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isScrolling]);

  useEffect(() => {
    if (input.trim().length > 0) {
      setIsTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        setIsTyping(false);
      }, 1500);
    } else {
      setIsTyping(false);
    }

    // Заглушка для удаления сообщений (если deleteMessage не передан через контекст)
    const deleteMessage = async (messageId) => {
      try {
        // Здесь можно сделать реальный API-запрос, например axios.delete(...)
        console.log("Mock delete:", messageId);
        return { success: true };
      } catch (error) {
        throw new Error("Ошибка при удалении сообщения");
      }
    };

    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [input]);

  return selectedUser ? (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-[#0f0a1f] to-gray-800 relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800/90 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="px-5 py-3.5">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setSelectedUser(null)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-700/60 transition-all duration-300"
              whileHover={{ scale: 1.05, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 15l-3-3m0 0l3-3m-3 3h12M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                />
              </svg>
            </motion.button>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <img
                    src={selectedUser.profilePic || assets.avatar_icon}
                    alt="Profile"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-purple-500/80 shadow-lg"
                  />
                </motion.div>
                {onlineUsers.includes(selectedUser._id) && (
                  <motion.div
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-800 shadow-sm"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>

              <div>
                <h2 className="text-md font-semibold text-gray-100 tracking-tight">
                  {selectedUser.fullName}
                </h2>
                <div className="flex items-center h-4">
                  <AnimatePresence>
                    {isTyping ? (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span className="text-xs text-purple-300 font-medium mr-1">
                          typing
                        </span>
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.span
                              key={i}
                              className="block w-1 h-1 bg-purple-300 rounded-full"
                              animate={{ y: [0, -3, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 0.8,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    ) : onlineUsers.includes(selectedUser._id) ? (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
                        <span className="text-xs text-green-300 font-medium">
                          Online
                        </span>
                      </motion.div>
                    ) : (
                      <motion.span
                        className="text-xs text-gray-400/90"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Last seen {formatMessageTime(selectedUser.lastSeen)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {["phone", "video", "menu"].map((icon, idx) => (
                <motion.button
                  key={idx}
                  className="p-2 rounded-xl hover:bg-gray-700/60 transition-all duration-200 text-purple-300 hover:text-white"
                  whileHover={{ scale: 1.1, rotate: idx === 2 ? 90 : 0 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={
                        icon === "phone"
                          ? "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          : icon === "video"
                          ? "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-900/30 via-gray-850/20 to-gray-800/10">
        {messages.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="bg-purple-500/10 p-7 rounded-2xl mb-5 shadow-lg"
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-purple-400/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-100 mb-1 tracking-tight">
              Start a conversation
            </h3>
            <p className="text-gray-400/80 mt-1 text-sm max-w-xs text-center">
              Send your first message to <b>{selectedUser.fullName}</b>
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => {
              const isOwn = msg.senderId === authUser._id;
              const isSameSender =
                index > 0 && messages[index - 1].senderId === msg.senderId;
              const repliedMessage = msg.replyTo
                ? messages.find((m) => m._id === msg.replyTo)
                : null;

              return (
                <motion.div
                  key={msg._id || index}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, type: "spring" }}
                >
                  <div
                    className={`max-w-[70%] flex flex-col ${
                      isSameSender ? "mt-1" : "mt-3"
                    }`}
                  >
                    {!isSameSender && !isOwn && (
                      <span className="text-xs text-gray-400 mb-1 ml-1">
                        {msg.senderName}
                      </span>
                    )}

                    {/* Reply preview */}
                    {repliedMessage && (
                      <motion.div
                        className={`mb-1 px-3 py-1.5 rounded-lg border-l-4 ${
                          isOwn
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-gray-500 bg-gray-700/50"
                        } text-xs text-gray-300 truncate`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="font-medium text-purple-300">
                          {repliedMessage.senderId === authUser._id
                            ? "Вы"
                            : repliedMessage.senderName}
                        </div>
                        <div className="truncate">
                          {repliedMessage.text ||
                            (repliedMessage.image
                              ? "📷 Фото"
                              : repliedMessage.video
                              ? "🎥 Видео"
                              : "Медиа")}
                        </div>
                      </motion.div>
                    )}

                    <div className="relative group">
                      {isOwn && (
                        <motion.button
                          className="p-1.5 hover:bg-red-600/30 rounded-md"
                          onClick={() => handleDeleteMessage(msg._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Удалить"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </motion.button>
                      )}

                      <motion.div
                        className={`px-4 py-2 rounded-3xl shadow-lg ${
                          isOwn
                            ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-br-none"
                            : "bg-gray-700/90 text-gray-300 rounded-bl-none"
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        {msg.text && (
                          <p className="whitespace-pre-wrap break-words">
                            {msg.text}
                          </p>
                        )}
                        {msg.image && (
                          <motion.div className="mt-2">
                            <motion.img
                              src={msg.image}
                              alt="Sent media"
                              className="rounded-xl max-w-full max-h-60 object-cover cursor-pointer"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              whileHover={{ scale: 1.05 }}
                            />
                            {msg.caption && (
                              <div className="mt-2 px-2 py-1 bg-black/30 rounded-lg">
                                <p className="text-sm text-white/90 italic">
                                  {msg.caption}
                                </p>
                              </div>
                            )}
                          </motion.div>
                        )}
                        {msg.video && (
                          <motion.div className="mt-2">
                            <motion.div
                              className="rounded-xl overflow-hidden relative"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <video
                                src={msg.video}
                                controls
                                className="max-w-full max-h-60"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition-all">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-12 w-12 text-white/90"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                            </motion.div>
                            {msg.caption && (
                              <div className="mt-2 px-2 py-1 bg-black/30 rounded-lg">
                                <p className="text-sm text-white/90 italic">
                                  {msg.caption}
                                </p>
                              </div>
                            )}
                          </motion.div>
                        )}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-white/80 select-none">
                            {formatMessageTime(msg.createdAt)}
                          </span>
                        </div>
                      </motion.div>

                      {/* Reply button (like Telegram) */}
                      {!isOwn && (
                        <motion.button
                          className="p-1.5 hover:bg-gray-700/60 rounded-md"
                          onClick={() => handleReply(msg)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Ответить"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                            />
                          </svg>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        <div ref={scrollEnd} />
      </div>

      {/* Message Input & Controls */}
      <form
        onSubmit={handleSendMessage}
        className="flex flex-col px-4 py-3 border-t border-purple-500/20 bg-gray-900/80 backdrop-blur-md sticky bottom-0 z-40"
      >
        {/* Reply preview */}
        {replyingTo && (
          <motion.div
            className="flex items-center justify-between mb-2 px-3 py-2 bg-gray-800/80 rounded-lg border-l-4 border-purple-500"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex-1 truncate">
              <div className="text-xs font-medium text-purple-300">
                Replying to{" "}
                {replyingTo.senderId === authUser._id
                  ? "yourself"
                  : replyingTo.senderName}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {replyingTo.text ||
                  (replyingTo.image
                    ? "Photo"
                    : replyingTo.video
                    ? "Video"
                    : "Media")}
              </div>
            </div>
            <motion.button
              type="button"
              className="p-1 text-gray-400 hover:text-white"
              onClick={cancelReply}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </motion.div>
        )}

        {/* Media preview */}
        {mediaPreview && (
          <motion.div
            className="relative mb-2 rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {mediaType === "image" ? (
              <img
                src={mediaPreview}
                alt="Preview"
                className="max-h-40 w-full object-cover rounded-xl"
              />
            ) : (
              <video
                src={mediaPreview}
                className="max-h-40 w-full object-cover rounded-xl"
                controls={false}
              />
            )}
            <motion.button
              className="absolute top-2 right-2 p-1.5 bg-gray-900/80 rounded-full hover:bg-gray-800"
              onClick={cancelMediaUpload}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </motion.div>
        )}

        <div className="flex items-center gap-3">
          {/* File Upload Button with Tooltip */}
          <div className="relative">
            <motion.button
              type="button"
              className="p-2 rounded-xl hover:bg-gray-700/60 transition-all duration-300 text-purple-300 hover:text-white"
              onClick={() => fileInputRef.current.click()}
              onMouseEnter={() => setShowFormatTooltip(true)}
              onMouseLeave={() => setShowFormatTooltip(false)}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Attach media"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.172 7l-6.586 6.586a2 2 0 11-2.828-2.828l6.414-6.414a4 4 0 115.656 5.656L10 17"
                />
              </svg>
              <input
                type="file"
                accept={`image/*, ${supportedFormats.videos
                  .map((ext) => `video/${ext}`)
                  .join(", ")}`}
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </motion.button>

            {/* Format Tooltip */}
            <AnimatePresence>
              {showFormatTooltip && (
                <motion.div
                  className="absolute bottom-full mb-2 left-0 z-50"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-gray-800 border border-purple-500/30 rounded-lg p-3 shadow-xl w-64">
                    <div className="absolute -bottom-1 left-3 w-3 h-3 bg-gray-800 transform rotate-45 border-b border-r border-purple-500/30"></div>

                    <h4 className="text-sm font-semibold text-purple-300 mb-3 text-center">
                      Supported formats
                    </h4>

                    <div className="flex justify-between">
                      {/* Images */}
                      <div className="flex-1 pr-2">
                        <div className="flex items-center mb-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-purple-300 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <div className="font-medium text-purple-200 text-xs">
                            Images:
                          </div>
                        </div>
                        <ul className="text-xs text-gray-300 space-y-1">
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                            JPG/JPEG
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                            PNG
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                            GIF
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                            WEBP
                          </li>
                        </ul>
                      </div>

                      {/* Videos */}
                      <div className="flex-1 pl-2 border-l border-purple-500/20">
                        <div className="flex items-center mb-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-purple-300 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          <div className="font-medium text-purple-200 text-xs">
                            Videos:
                          </div>
                        </div>
                        <ul className="text-xs text-gray-300 space-y-1">
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                            MP4
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                            WEBM
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                            MOV
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-purple-500/10 text-xs text-center">
                      <span className="text-gray-400">Max size: </span>
                      <span className="text-purple-300 font-medium">20MB</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Emoji Picker Button */}
          <motion.button
            type="button"
            className="p-2 rounded-xl hover:bg-gray-700/60 transition-all duration-300 relative"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle emoji picker"
          >
            <motion.div
              className="text-2xl"
              animate={showEmojiPicker ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              😊
            </motion.div>
            {showEmojiPicker && (
              <motion.div
                className="absolute -top-2 -right-1 w-2 h-2 bg-purple-500 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              />
            )}
          </motion.button>

          <input
            type="text"
            placeholder={
              mediaPreview ? "Add a caption..." : "Type a message..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-xl bg-gray-700/70 py-3 px-4 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-700/90 transition-all"
            autoComplete="off"
          />

          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="absolute -top-7 right-14 text-sm text-gray-400 flex items-center"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                <span>typing</span>
                <div className="flex ml-1 space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="block w-1 h-1 bg-gray-400 rounded-full"
                      animate={{ y: [0, -2, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={input.trim() === "" && !mediaPreview}
            className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{
              scale: input.trim() === "" && !mediaPreview ? 1 : 1.05,
            }}
            whileTap={{
              scale: input.trim() === "" && !mediaPreview ? 1 : 0.95,
            }}
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </div>
      </form>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            className="absolute bottom-[70px] left-4 right-4 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              width="100%"
              height={380}
              previewConfig={{ showPreview: false }}
              searchDisabled={false}
              skinTonesDisabled
              theme="dark"
              suggestedEmojisMode="recent"
              skinTonePickerLocation="PREVIEW"
              lazyLoadEmojis={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {messageToDelete && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-xl font-semibold text-gray-100 mb-4">
                Удалить сообщение?
              </h3>
              <p className="text-gray-400 mb-6">
                Это действие нельзя отменить.
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Отмена
                </motion.button>
                <motion.button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Удалить
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-[#1e1b4b] via-[#1e1f38] to-[#0f172a] p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-900/10 blur-xl"
            style={{
              width: Math.random() * 150 + 50,
              height: Math.random() * 150 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${
                Math.random() * 15 + 10
              }s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        <motion.div
          className="mb-8"
          animate={{
            rotate: [0, 5, -5, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <img
            src={assets.avatar_icon}
            alt="No chat selected"
            className="w-32 h-32 opacity-90 mx-auto"
          />
        </motion.div>

        <motion.h2
          className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-white bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Select a user to start chatting
        </motion.h2>

        <motion.p
          className="text-gray-300/90 mb-8 text-lg max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Choose a contact from your list to begin your conversation. Your
          messages will appear here.
        </motion.p>

        <motion.div
          className="flex justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="w-3 h-3 rounded-full bg-purple-500/80 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-pink-500/80 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500/80 animate-pulse delay-200"></div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default ChatContainer;
