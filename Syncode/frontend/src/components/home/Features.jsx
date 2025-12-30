import { motion } from "framer-motion";
import {
  FileSearch,
  GitBranch,
  Shield,
  Zap,
  Database,
  FileOutput,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Automated Medical Code Extraction",
    description:
      "Upload large medical transcripts and automatically extract ICD, CPT, LOINC, and NDC codes — saving manual effort and time.",
  },
  {
    icon: FileSearch,
    title: "Full Text Traceability",
    description:
      "Every extracted code is linked directly to the exact page and sentence in the transcript, including confidence scores for verification.",
  },
  {
    icon: GitBranch,
    title: "Integrated Audit Processing",
    description:
      "Perform extraction and audit together or audit existing codes separately. Get accurate results with complete process transparency.",
  },
  {
    icon: Shield,
    title: "Policy & Compliance Checks",
    description:
      "Automatically review transcripts and codes for compliance with national and organizational standards, reducing regulatory risk.",
  },
  {
    icon: Database,
    title: "RAG-Powered AI Intelligence",
    description:
      "Leverages retrieval-augmented generation over verified medical knowledge bases for highly accurate code suggestions with transparent provenance.",
  },
  {
    icon: FileOutput,
    title: "Flexible Export & Integration",
    description:
      "Export results in JSON or CSV format with full process details. Seamlessly integrate with your EHR, insurance, or analytics systems.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12, // one-by-one animation
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const Features = () => {
  return (
    <section id="features" className="py-5 md:py-10">
      <div className="container mx-auto px-4">
        {/* Heading animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-500 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-slate-300">
            Everything you need to extract, audit, and validate medical reports
            with confidence and compliance.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  boxShadow: "0px 20px 40px rgba(17, 212, 98, 0.25)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative rounded-xl border border-[#11d462] bg-[#11d462]/5 p-6 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#11d4621a]"
                >
                  <Icon className="h-6 w-6 text-[#11d462]" />
                </motion.div>

                <h3 className="text-xl font-bold text-yellow-600 mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
