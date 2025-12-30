import { motion } from "framer-motion";

export const Comaparasion = () => {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 relative">
          {/* vertical divider */}
          <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-px bg-border"></div>

          {/* Manual side */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="text-yellow-600 text-4xl">⚠️</span>
              </div>
              <div className="flex items-center gap-3">
                <h3 className="text-4xl font-bold text-yellow-500">
                  Manual Coding
                </h3>
                <p className="text-white text-xl">- Current Workflow</p>
              </div>
            </div>

            <div className="bg-[#11d462]/5 border border-[#11d462] rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">
                    Document: Discharge Summary
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ~420 pages (scanned)
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Team effort • multi-day
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Typical problems:
                <ul className="list-disc ml-5 mt-2">
                  <li>Missed diagnosis mentions (low recall)</li>
                  <li>Ambiguous coding due to lack of provenance</li>
                  <li>No insurer-policy mapping during coding</li>
                </ul>
              </div>

              <div className="bg-red-50 border-2 border-red-400 rounded-xl p-3">
                <div className="flex items-start gap-3">
                  <div className="text-red-600">⚠</div>
                  <div>
                    <div className="text-sm font-semibold text-red-700">
                      Example error found manually:
                    </div>
                    <div className="text-sm text-red-600">
                      Assigned ICD: J11 (Influenza) - evidence points to A90
                      (Dengue) instead.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SynCode AI side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="text-emerald-600 text-4xl">🧠</span>
              </div>
              <div className="flex items-center gap-3">
                <h3 className="text-4xl font-bold text-yellow-500">
                  SynCode AI
                </h3>
                <p className="text-white text-xl">
                  - Extraction & Audit Support
                </p>
              </div>
            </div>

            <div className="bg-[#11d462]/5 border border-[#11d462] rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Automated Run</div>
                  <div className="text-sm text-muted-foreground">
                    Processed: 420 pages • streaming results
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Pipeline: NLP → Code Mapping → Audit Support
                </div>
              </div>

              {/* Confidence + Action row */}
              <div>
                <div>
                  <div className="text-sm font-medium">
                    Overall Extraction Confidence
                  </div>

                  <div className="mt-2">
                    <div className="w-full bg-[#1a1a1a] h-2 rounded overflow-hidden">
                      <div
                        className="h-2"
                        style={{ width: "92%", backgroundColor: "#11d462" }}
                      />
                    </div>
                    <div className="text-xs text-right text-muted-foreground mt-1">
                      92%
                    </div>
                  </div>
                </div>
              </div>

              {/* Extracted codes chips */}
              <div>
                <div className="text-sm font-medium mb-2">
                  Top Extracted ICDs (with provenance)
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-background rounded border border-[#11d462] text-xs">
                    A90 - Dengue (sentence#234)
                  </span>
                  <span className="px-2 py-1 bg-background rounded border border-[#11d462] text-xs">
                    E11 - Type 2 Diabetes (sentence#45)
                  </span>
                  <span className="px-2 py-1 bg-background rounded border border-[#11d462] text-xs">
                    I10 - Hypertension (sentence#12)
                  </span>
                </div>
              </div>

              {/* Audit summary */}
              <div className="bg-muted/30 rounded-xl p-3 border border-[#11d462]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">
                      Automated Audit Findings
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Flags for human review: 3
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Time saved vs manual: ~85%
                  </div>
                </div>

                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    • <strong>Low Confidence:</strong> 2 codes under 60%
                    confidence (needs human check)
                  </li>
                  <li>
                    • <strong>Possible Mismatch:</strong> 1 code lacks clear
                    sentence evidence
                  </li>
                  <li>
                    • <strong>Data Completeness:</strong> 1 entry requires
                    review to ensure all tests/procedures captured
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
