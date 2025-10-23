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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const demoMessage = `Dear Hiring Manager,

I am writing to express my strong interest in the [Position Name] position at [Company Name]. With my background in [Your Key Skill] and passion for creating innovative solutions, I believe I would be a valuable addition to your team.

My experience includes [Briefly mention 1-2 key experiences/projects] which align perfectly with the job description. I am particularly excited about this opportunity because [Reason you like the company or role].

I would welcome the opportunity to discuss how my skills and experience can contribute to your organization's success.

Best regards,
[Your Name]`;
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-6xl">
        <div className="text-center mb-6 sm:mb-8 space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
            AI Message Studio
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Craft professional LinkedIn messages, emails, and cover letters in
            seconds.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
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
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div className="bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:border-slate-300/60">
              <label className="block text-slate-900 text-sm sm:text-base font-semibold mb-3 sm:mb-4">
                1. Describe your goal
              </label>
              <Textarea
                placeholder="e.g., 'A LinkedIn message to a recruiter at Google for a Software Engineer role, mentioning my 3 years of experience in React.'"
                className="min-h-[250px] text-sm resize-none border-slate-200/50 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur focus:bg-white transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGenerating ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating magic...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Message</span>
                </div>
              )}
            </Button>
          </div>
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:border-slate-300/60">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  2. Your Generated Message
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
              <div className="min-h-[340px] rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/50 p-5 overflow-y-auto">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 animate-ping" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 animate-pulse" />
                      <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      Crafting your message
                    </p>
                    <p className="text-xs text-slate-500">Please wait...</p>
                  </div>
                ) : generatedMessage ? (
                  <div className="prose prose-slate prose-sm max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {generatedMessage}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center min-h-[300px]">
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
