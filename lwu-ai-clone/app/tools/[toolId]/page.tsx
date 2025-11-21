'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Image,
  Wand2,
  Eraser,
  Video,
  Mic,
  ArrowLeft,
  Sparkles,
  Loader2,
  Download,
  AlertCircle,
  Scissors,
  Palette,
  User,
  Users,
  Trash2,
  MapPin,
  Film,
  Flame,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Link from 'next/link';

const TOOLS = {
  'image-generation': {
    name: 'Image Generation',
    description: 'Create stunning images from text descriptions',
    icon: Image,
    color: 'from-blue-500 to-cyan-500',
    credits: 2,
    requiresImage: false,
    fields: [
      {
        name: 'prompt',
        label: 'Prompt',
        type: 'textarea',
        placeholder: 'Describe the image you want to create...',
        required: true,
      },
      {
        name: 'negativePrompt',
        label: 'Negative Prompt (Optional)',
        type: 'textarea',
        placeholder: 'What you don\'t want in the image...',
      },
    ],
  },
  'image-upscale': {
    name: 'Image Upscale',
    description: 'Enhance and upscale your images with AI',
    icon: Wand2,
    color: 'from-purple-500 to-pink-500',
    credits: 1,
    requiresImage: true,
    fields: [
      {
        name: 'scale',
        label: 'Scale Factor',
        type: 'select',
        options: ['2', '4'],
        defaultValue: '4',
      },
    ],
  },
  'background-removal': {
    name: 'Background Removal',
    description: 'Remove backgrounds from images automatically',
    icon: Eraser,
    color: 'from-green-500 to-emerald-500',
    credits: 1,
    requiresImage: true,
    fields: [],
  },
  'image-to-video': {
    name: 'Image to Video',
    description: 'Transform static images into dynamic videos',
    icon: Video,
    color: 'from-orange-500 to-red-500',
    credits: 3,
    requiresImage: true,
    fields: [
      {
        name: 'motionBucketId',
        label: 'Motion Intensity',
        type: 'range',
        min: 1,
        max: 255,
        defaultValue: 127,
      },
    ],
  },
  'text-to-speech': {
    name: 'Text to Speech',
    description: 'Convert text into natural-sounding speech',
    icon: Mic,
    color: 'from-indigo-500 to-purple-500',
    credits: 1,
    requiresImage: false,
    fields: [
      {
        name: 'text',
        label: 'Text',
        type: 'textarea',
        placeholder: 'Enter the text to convert to speech...',
        required: true,
      },
      {
        name: 'language',
        label: 'Language',
        type: 'select',
        options: ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh'],
        defaultValue: 'en',
      },
    ],
  },
  'hair-style': {
    name: 'Hair Style Transform',
    description: 'Transform hair styles with AI - try different hairstyles instantly',
    icon: Scissors,
    color: 'from-pink-500 to-rose-500',
    credits: 4,
    requiresImage: true,
    fields: [
      {
        name: 'hairStyle',
        label: 'Hair Style',
        type: 'select',
        options: [
          'short bob',
          'long straight',
          'curly',
          'wavy',
          'pixie cut',
          'braided',
          'ponytail',
          'blonde colored',
          'red colored',
          'purple colored',
          'blue colored',
          'ombre',
        ],
        defaultValue: 'long straight',
        required: true,
      },
      {
        name: 'prompt',
        label: 'Additional Description (Optional)',
        type: 'textarea',
        placeholder: 'Add extra details about the hair style you want...',
      },
    ],
  },
  'cartoon-style': {
    name: 'Cartoon Style',
    description: 'Convert photos to cartoon/anime style',
    icon: Palette,
    color: 'from-yellow-500 to-orange-500',
    credits: 3,
    requiresImage: true,
    fields: [
      {
        name: 'style',
        label: 'Style',
        type: 'select',
        options: [
          'anime',
          'cartoon',
          'pixar style',
          'disney style',
          'comic book',
          'watercolor',
          'oil painting',
        ],
        defaultValue: 'anime',
      },
    ],
  },
  'portrait-enhance': {
    name: 'Portrait Enhance',
    description: 'Enhance and beautify portraits with AI',
    icon: User,
    color: 'from-cyan-500 to-blue-500',
    credits: 2,
    requiresImage: true,
    fields: [],
  },
  'face-swap': {
    name: 'Face Swap',
    description: 'Swap faces between two photos',
    icon: Users,
    color: 'from-violet-500 to-purple-500',
    credits: 4,
    requiresImage: true,
    requiresSecondImage: true,
    fields: [],
  },
  'object-removal': {
    name: 'Object Removal',
    description: 'Remove unwanted objects from images',
    icon: Trash2,
    color: 'from-red-500 to-pink-500',
    credits: 3,
    requiresImage: true,
    requiresMask: true,
    fields: [
      {
        name: 'prompt',
        label: 'What to fill with (Optional)',
        type: 'textarea',
        placeholder: 'Describe what should replace the removed object...',
      },
    ],
  },
  'scene-composite': {
    name: 'Scene Composite',
    description: 'Place yourself in famous locations around the world',
    icon: MapPin,
    color: 'from-teal-500 to-emerald-500',
    credits: 4,
    requiresImage: true,
    fields: [
      {
        name: 'scene',
        label: 'Destination',
        type: 'select',
        options: [
          'eiffel-tower',
          'great-wall',
          'statue-liberty',
          'taj-mahal',
          'colosseum',
          'pyramids',
          'big-ben',
          'sydney-opera',
          'mount-fuji',
          'santorini',
        ],
        defaultValue: 'eiffel-tower',
        required: true,
      },
      {
        name: 'prompt',
        label: 'Additional Details (Optional)',
        type: 'textarea',
        placeholder: 'Add extra details about the scene...',
      },
    ],
  },
  'photo-animation': {
    name: 'Photo Animation',
    description: 'Animate photos with expressions and movements',
    icon: Film,
    color: 'from-amber-500 to-yellow-500',
    credits: 5,
    requiresImage: true,
    fields: [
      {
        name: 'animationType',
        label: 'Animation Type',
        type: 'select',
        options: [
          'smile',
          'blink',
          'head turn',
          'zoom in',
          'zoom out',
          'pan left',
          'pan right',
        ],
        defaultValue: 'smile',
        required: true,
      },
      {
        name: 'intensity',
        label: 'Intensity',
        type: 'range',
        min: 0.5,
        max: 2,
        defaultValue: 1,
      },
    ],
  },
  'special-effects': {
    name: 'Special Effects',
    description: 'Add magical effects like fire, lightning, and more',
    icon: Flame,
    color: 'from-orange-500 to-amber-500',
    credits: 3,
    requiresImage: true,
    fields: [
      {
        name: 'effect',
        label: 'Effect Type',
        type: 'select',
        options: [
          'fire',
          'lightning',
          'ice',
          'magic',
          'neon',
          'galaxy',
          'underwater',
          'autumn',
        ],
        defaultValue: 'magic',
        required: true,
      },
      {
        name: 'intensity',
        label: 'Intensity',
        type: 'range',
        min: 1,
        max: 2,
        defaultValue: 1,
      },
    ],
  },
} as const;

export default function ToolPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const toolId = params.toolId as string;
  const tool = TOOLS[toolId as keyof typeof TOOLS];

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!tool) {
      router.push('/tools');
    }

    // Initialize form data with default values
    if (tool) {
      const defaults: Record<string, any> = {};
      tool.fields.forEach(field => {
        if (field.defaultValue) {
          defaults[field.name] = field.defaultValue;
        }
      });
      setFormData(defaults);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [tool, router, pollInterval]);

  if (!tool) {
    return null;
  }

  const Icon = tool.icon;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (tool.requiresImage && !imageFile) {
      setError('Please upload an image');
      return;
    }

    if (!session?.user) {
      setError('Please log in to continue');
      return;
    }

    if (session.user.credits < tool.credits) {
      setError(`Insufficient credits. You need ${tool.credits} credits but only have ${session.user.credits}.`);
      return;
    }

    setIsProcessing(true);

    try {
      let imageUrl = '';

      // Upload image if required
      if (tool.requiresImage && imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          throw new Error(uploadError.error || 'Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      // Call generate API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId,
          params: {
            ...formData,
            image: imageUrl,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start generation');
      }

      // Start polling for result
      pollForResult(data.generationId);

      // Update session credits
      await updateSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsProcessing(false);
    }
  };

  const pollForResult = (generationId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/generate/${generationId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          setResult(data);
          setIsProcessing(false);
          clearInterval(interval);
        } else if (data.status === 'failed') {
          setError(data.error || 'Generation failed');
          setIsProcessing(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);

    setPollInterval(interval);
  };

  const handleReset = () => {
    setResult(null);
    setImageFile(null);
    setImagePreview('');
    setError('');
    const defaults: Record<string, any> = {};
    tool.fields.forEach(field => {
      if (field.defaultValue) {
        defaults[field.name] = field.defaultValue;
      }
    });
    setFormData(defaults);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tool.color} p-3`}>
                <Icon className="w-full h-full text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{tool.name}</h1>
                <p className="text-gray-400">{tool.description}</p>
              </div>
            </div>

            {session?.user && (
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-400">Cost: </span>
                  <span className="text-yellow-400 font-semibold">
                    {tool.credits} {tool.credits === 1 ? 'credit' : 'credits'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Your Credits: </span>
                  <span className="text-green-400 font-semibold">{session.user.credits}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Main Content */}
          {!result ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Image Upload */}
              {tool.requiresImage && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Upload Image</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          Change Image
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-400">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Dynamic Fields */}
              {tool.fields.map(field => (
                <div key={field.name} className="mb-6">
                  <label className="block text-sm font-medium mb-3">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.name] || field.defaultValue}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      {field.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === 'range' ? (
                    <div>
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        value={formData[field.name] || field.defaultValue}
                        onChange={(e) => setFormData({ ...formData, [field.name]: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-400 mt-2">
                        Value: {formData[field.name] || field.defaultValue}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || (session?.user?.credits || 0) < tool.credits}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate ({tool.credits} {tool.credits === 1 ? 'credit' : 'credits'})
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <h2 className="text-xl font-bold mb-4">Result</h2>

              <div className="mb-6 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                {result.type === 'text-to-speech' ? (
                  <audio controls className="w-full">
                    <source src={result.resultUrl} />
                  </audio>
                ) : result.type === 'image-to-video' ? (
                  <video controls className="w-full">
                    <source src={result.resultUrl} />
                  </video>
                ) : (
                  <img src={result.resultUrl} alt="Result" className="w-full" />
                )}
              </div>

              <div className="flex gap-4">
                <a
                  href={result.resultUrl}
                  download
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </a>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Create Another
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
