import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 lg:px-12 mt-4">
      <div className="relative rounded-xl overflow-hidden">
        {/* VIDEO BACKGROUND */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/src/assets/hero-video.mp4" type="video/mp4" />
        </video>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-[rgba(16,29,34,0.75)]"></div>

        {/* CONTENT */}
        <div
          className="
            relative max-w-7xl mx-auto 
            px-4 sm:px-6 lg:px-12 
            flex flex-col 
            justify-start      
            pt-24              
            min-h-[500px] 
            text-center
        "
        >
          {/* LEFT-ALIGNED HEADING ONLY */}
          <div className="w-full flex flex-col items-start">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white text-5xl sm:text-5xl font-black max-w-6xl leading-tight"
            >
              Automated{" "}
              <span className="text-[#11d462]">Medical Coding & Audit</span> for
              India’s
              <br />
              Insurance Workflows
            </motion.h1>
          </div>

          {/* CENTERED SUBHEADING + BUTTONS */}
          <div className="w-full flex flex-col items-center text-center mt-2">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white text-2xl sm:text-3xl"
            >
              Upload, Automate, and Accelerate
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 mt-6 flex-wrap justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.08, x: 3 }}
                transition={{ type: "spring", stiffness: 250, damping: 15 }}
                onClick={() => navigate("/login")}
                className="
                border-primary 
                text-primary 
                px-6 py-3 
                rounded-md 
                flex items-center gap-2 
                transition-all duration-300 
                group
                hover:bg-#11d462
                "
              >
                Start Demo
                <span className="transform transition-all duration-300 group-hover:translate-x-2">
                  ➜
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
