import { Shield, Lock, Eye, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "AES-256 encryption at rest, TLS 1.2+ in transit",
  },
  {
    icon: Eye,
    title: "Role-Based Access Control",
    description:
      "Admin, Coder, Auditor, Viewer roles with granular permissions",
  },
  {
    icon: FileCheck,
    title: "Complete Audit Logging",
    description: "Track every action: who, when, what changed",
  },
  {
    icon: Shield,
    title: "HIPAA Compliance Ready",
    description: "Built with BAA-ready infrastructure and controls",
  },
];

const securityContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // one-by-one
    },
  },
};

const securityItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const Security = () => {
  return (
    <section id="security" className="py-5 md:py-10 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <Badge variant="secondary" className="mb-4 border border-[#11d462]">
              <Shield className="mr-1 h-3 w-3 text-[#11d462]" />
              Enterprise Security
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-500 mb-6">
              Built for Healthcare Compliance
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We understand that healthcare data requires the highest level of
              security and compliance. Our platform is designed from the ground
              up to meet HIPAA requirements and protect patient privacy.
            </p>

            <div className="bg-red-50 border-4 border-red-600 rounded-xl p-3">
              <p className="text-sm text-black leading-relaxed">
                <strong>Important:</strong> This application provides coding
                suggestions and traceability to source text. It does not make
                claim decisions or payment determinations. All production
                deployments require appropriate legal safeguards, Business
                Associate Agreements (BAA), and compliance reviews.
              </p>
            </div>
          </div>

          <motion.div
            variants={securityContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6"
          >
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={securityItemVariants}
                  whileHover={{
                    y: -5,
                    boxShadow: "0px 20px 40px rgba(17, 212, 98, 0.25)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex gap-4 p-6 rounded-xl border-2 border-[#11d462] bg-[#11d462]/5 cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#11d4621a]">
                      <Icon className="h-6 w-6 text-[#11d462]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-yellow-600 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
