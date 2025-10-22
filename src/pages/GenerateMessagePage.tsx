import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Clipboard, Sparkles, Mail, Linkedin, FileText } from "lucide-react";

type MessageType = "linkedin" | "email" | "motivation-letter";

const GenerateMessagePage = () => {
  const [messageType, setMessageType] = useState<MessageType>("linkedin");
  const [prompt, setPrompt] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const messageTypes = [
    {
      id: "linkedin" as MessageType,
      label: "LinkedIn",
      icon: Linkedin,
      color:
        "from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border-blue-200/50",
      activeColor:
        "from-blue-500/20 to-blue-600/20 border-blue-400 shadow-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "email" as MessageType,
      label: "Email",
      icon: Mail,
      color:
        "from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 border-purple-200/50",
      activeColor:
        "from-purple-500/20 to-purple-600/20 border-purple-400 shadow-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "motivation-letter" as MessageType,
      label: "Cover Letter",
      icon: FileText,
      color:
        "from-pink-500/10 to-pink-600/10 hover:from-pink-500/20 hover:to-pink-600/20 border-pink-200/50",
      activeColor:
        "from-pink-500/20 to-pink-600/20 border-pink-400 shadow-pink-100",
      iconColor: "text-pink-600",
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe what you need");
      return;
    }

    setIsGenerating(true);
    setGeneratedMessage("");

    try {
      // Simulated API call for demo
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const demoMessage = `Dear Hiring Manager,

I am writing to express my strong interest in the position. With my background in software development and passion for creating innovative solutions, I believe I would be a valuable addition to your team.

My experience includes working with modern technologies and collaborating with cross-functional teams to deliver high-quality products. I am particularly excited about this opportunity because it aligns perfectly with my career goals and expertise.

I would welcome the opportunity to discuss how my skills and experience can contribute to your organization's success.

Best regards`;

      setGeneratedMessage(demoMessage);
      toast.success("Message created!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    toast.success("Copied!");
  };

  const selectedType = messageTypes.find((t) => t.id === messageType);

  return (
    // MODIFICATION: Matched container and background to /app design
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* MODIFICATION: Reduced header size and spacing */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
            AI Message Studio
          </h1>
          <p className="text-slate-500 text-md max-w-2xl mx-auto">
            Craft professional messages in seconds
          </p>
        </div>

        {/* MODIFICATION: Smaller icons, in a single row */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
          {messageTypes.map((type) => {
            const Icon = type.icon;
            const isActive = messageType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setMessageType(type.id)}
                disabled={isGenerating}
                className={`group relative p-3 rounded-xl border-2 transition-all duration-300 bg-gradient-to-br ${
                  isActive ? type.activeColor : type.color
                } disabled:opacity-50 disabled:cursor-not-allowed ${
                  isActive
                    ? "shadow-lg scale-[1.05]"
                    : "hover:scale-[1.03] shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg bg-white/80 backdrop-blur flex items-center justify-center ${
                      isActive ? "shadow-md" : "shadow-sm"
                    } transition-all duration-300`}
                  >
                    <Icon className={`w-4 h-4 ${type.iconColor}`} />
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors pr-2 hidden sm:inline ${
                      isActive ? "text-slate-900" : "text-slate-700"
                    }`}
                  >
                    {type.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content (Original Design Preserved) */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] border border-slate-200/50 shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
              <label className="block text-slate-700 text-sm font-medium mb-3">
                Job Description
              </label>
              <Textarea
                placeholder="Describe the job or opportunity you are targeting..."
                className="min-h-[250px] text-base resize-none border-slate-200/50 rounded-2xl bg-white/50 backdrop-blur focus:bg-white transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGenerating ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating magic...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Message</span>
                </div>
              )}
            </Button>
          </div>

          {/* Output Section */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] border border-slate-200/50 shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Your Message
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-slate-100 transition-all duration-300 disabled:opacity-30"
                  onClick={handleCopy}
                  disabled={!generatedMessage || isGenerating}
                >
                  <Clipboard className="w-4 h-4 text-slate-600" />
                </Button>
              </div>

              <div className="min-h-[340px] rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/50 p-5">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 animate-ping" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 animate-pulse" />
                      <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm">
                      Crafting your message...
                    </p>
                  </div>
                ) : generatedMessage ? (
                  // MODIFICATION: Improved text appearance
                  <div className="prose prose-slate prose-sm max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {generatedMessage}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                      {selectedType && (
                        <selectedType.icon
                          className={`w-8 h-8 ${selectedType.iconColor} opacity-40`}
                        />
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">
                      Your generated message will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GenerateMessagePage;
