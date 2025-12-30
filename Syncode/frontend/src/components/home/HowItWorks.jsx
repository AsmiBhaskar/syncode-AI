import { Upload, Scan, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Medical Reports",
    description:
      "Drag and drop PDF, DOCX, or scanned documents. Our OCR handles both native and scanned text with 99%+ accuracy.",
    step: "01",
  },
  {
    icon: Scan,
    title: "Extract & Code Automatically",
    description:
      "Clinical NER and RAG process your documents to extracts relevant codes from vetted knowledge bases, validates them and checks compliance automatically.",
    step: "02",
  },
  {
    icon: CheckCircle,
    title: "Get Results",
    description:
      "Review and export the suggested codes with complete provenance. Each suggested code comes with a confidence score. ",
    step: "03",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-5 md:py-10 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-500 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps from raw medical report to audit-ready coded data
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3 relative">
          {/* Connection lines - hidden on mobile */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-border -z-10" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center text-center"
              >
                <div className="mb-6 relative">
                  <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#11d462] shadow-clinical">
                    <Icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-accent font-bold text-sm flex items-center justify-center text-black bg-yellow-500">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-yellow-600 mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
