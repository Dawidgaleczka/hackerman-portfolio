import { motion } from "framer-motion";

const MessageDotsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-0.5 -0.5 16 16"
      fill="none"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="34"
      width="34"
    >
      <desc>Message Dots Streamline Icon: https://streamlinehq.com</desc>

      {/* Animated Dots */}
      <motion.circle
        cx="5"
        cy="6.875"
        r="0.5"
        strokeWidth="1"
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay: 0 }}
      />
      <motion.circle
        cx="7.5"
        cy="6.875"
        r="0.5"
        strokeWidth="1"
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.circle
        cx="10"
        cy="6.875"
        r="0.5"
        strokeWidth="1"
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay: 0.6 }}
      />

      {/* Speech Bubble */}
      <path
        d="M11.25 2.5a1.875 1.875 0 0 1 1.875 1.875v5a1.875 1.875 0 0 1 -1.875 1.875h-3.125l-3.125 1.875v-1.875H3.75a1.875 1.875 0 0 1 -1.875 -1.875V4.375a1.875 1.875 0 0 1 1.875 -1.875z"
        strokeWidth="1"
      />
    </svg>
  );
};

export default MessageDotsIcon;
