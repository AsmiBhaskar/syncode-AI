import { useState, useRef, useMemo } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileCode,
  X,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const UploadZone = ({
  title,
  description,
  accept,
  icon = "document",
  files = [],
  onFileSelect,
  status = "idle",
  preview = [],
  onTextChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const hiddenFileInput = useRef(null);
  const IconComponent = icon === "document" ? FileText : FileCode;
  const formatSize = (size) => `${(size / 1024 / 1024).toFixed(2)} MB`;
  const [testInput, setTestInput] = useState("");

  const handleTestInputChange = (e) => {
    setTestInput(e.target.value);
    onTextChange?.(e.target.value);
  };

  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files]
  );

  const removeFile = (index) => {
    onFileSelect(files.filter((_, i) => i !== index));
  };

  const addFiles = (newFiles) => {
    onFileSelect([...files, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) addFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length) addFiles(selectedFiles);
    e.target.value = "";
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all",
        isDragging && "ring-2 ring-primary ring-offset-2",
        status === "success" && "ring-1 ring-success/30 bg-[#11d4620D]",
        status === "error" && "ring-1 ring-destructive/30 bg-destructive/5"
      )}
    >
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex gap-4 ">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-xl border-2",
              status === "error"
                ? "bg-red-100 border-red-500"
                : "bg-[#11d4621a] border-[#11d462]"
            )}
          >
            {status === "success" ? (
              <CheckCircle2 className="h-7 w-7 text-[#11d462]" />
            ) : status === "error" ? (
              <AlertCircle className="h-7 w-7 text-red-500" />
            ) : (
              <IconComponent className="h-7 w-7 text-[#11d462]" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        {/* Drop Area */}
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#11d462] p-8 cursor-pointer transition-colors",
            isDragging ? "bg-[#11d4620D]" : "bg-muted/30"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => hiddenFileInput.current.click()}
        >
          <Upload className="h-10 w-10 text-[#11d462] mb-3" />
          <p className="text-sm font-medium mb-1">
            Drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">Supported: {accept}</p>

          <Button
            variant="outline"
            size="sm"
            className="mt-3 text-black border-none hover:scale-110 hover:bg-[#11d462]"
            onClick={(e) => {
              e.stopPropagation();
              hiddenFileInput.current.click();
            }}
          >
            Browse Files
          </Button>

          <input
            ref={hiddenFileInput}
            type="file"
            accept={accept}
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
        {/* NORMAL INPUT FIELD */}
        <label className="block text-sm mb-2 text-[#11d462]">Test Input</label>
        <input
          type="text"
          value={testInput}
          onChange={handleTestInputChange}
          className="relative z-[9999] w-full px-4 py-3 bg-input border border-[#11d462] rounded-xl focus:border-[#11d462] focus:outline-none focus:ring-1 focus:ring-[#11d462]"
        />

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Selected Files ({files.length})</span>
              <span className="text-muted-foreground">
                Total: {formatSize(totalSize)}
              </span>
            </div>

            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-black border border-[#11d462] rounded-xl p-3"
              >
                <div className="flex gap-3 items-center">
                  <FileText className="h-5 w-5 text-[#11d462]" />
                  <div>
                    <p className="text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(file.size)}
                    </p>
                  </div>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}

            {preview.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {preview.map((p, i) => (
                  <Badge key={i} variant="outline">
                    {p}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
