import { motion } from "framer-motion";

interface AnimatedEyeProps {
  isOpen: boolean;
  className?: string;
}

const AnimatedEye = ({ isOpen, className = "" }: AnimatedEyeProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Eye outline */}
      <motion.path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        initial={false}
        animate={{
          d: isOpen 
            ? "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            : "M1 12s4-2 11-2 11 2 11 2-4 2-11 2-11-2-11-2z"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      
      {/* Pupil */}
      <motion.circle
        cx="12"
        cy="12"
        initial={false}
        animate={{
          r: isOpen ? 3 : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
      
      {/* Eyelid (closing line) */}
      <motion.path
        d="M12 12 L12 12"
        initial={false}
        animate={{
          d: isOpen ? "M12 12 L12 12" : "M3 12 L21 12",
          opacity: isOpen ? 0 : 1
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        strokeWidth="2.5"
      />
      
      {/* Upper eyelash effect when closed */}
      <motion.path
        initial={false}
        animate={{
          d: isOpen 
            ? "M12 4 L12 4" 
            : "M6 10 L4 8 M12 9 L12 6 M18 10 L20 8",
          opacity: isOpen ? 0 : 1,
          pathLength: isOpen ? 0 : 1
        }}
        transition={{ duration: 0.3, ease: "easeOut", delay: isOpen ? 0 : 0.1 }}
      />
    </svg>
  );
};

export default AnimatedEye;
