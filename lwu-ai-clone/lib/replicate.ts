import Replicate from 'replicate';

if (!process.env.REPLICATE_API_TOKEN) {
  console.warn('REPLICATE_API_TOKEN is not set. AI features will not work.');
}

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export const AI_MODELS = {
  'image-generation': {
    id: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    name: 'SDXL',
    description: 'Generate high-quality images from text',
    credits: 2,
  },
  'image-upscale': {
    id: 'nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b',
    name: 'Real-ESRGAN',
    description: 'Upscale images with AI',
    credits: 1,
  },
  'background-removal': {
    id: 'cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003',
    name: 'Rembg',
    description: 'Remove background from images',
    credits: 1,
  },
  'image-to-video': {
    id: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
    name: 'Stable Video Diffusion',
    description: 'Turn images into videos',
    credits: 3,
  },
  'text-to-speech': {
    id: 'lucataco/xtts-v2:684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e',
    name: 'XTTS v2',
    description: 'Convert text to natural speech',
    credits: 1,
  },
} as const;

export type AIToolId = keyof typeof AI_MODELS;

interface GenerateImageParams {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
}

interface UpscaleImageParams {
  image: string;
  scale?: number;
}

interface RemoveBackgroundParams {
  image: string;
}

interface ImageToVideoParams {
  image: string;
  motionBucketId?: number;
}

interface TextToSpeechParams {
  text: string;
  speakerWav?: string;
  language?: string;
}

export async function generateImage(params: GenerateImageParams) {
  const output = await replicate.run(
    AI_MODELS['image-generation'].id as any,
    {
      input: {
        prompt: params.prompt,
        negative_prompt: params.negativePrompt || '',
        width: params.width || 1024,
        height: params.height || 1024,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    }
  );
  return output;
}

export async function upscaleImage(params: UpscaleImageParams) {
  const output = await replicate.run(
    AI_MODELS['image-upscale'].id as any,
    {
      input: {
        image: params.image,
        scale: params.scale || 4,
      },
    }
  );
  return output;
}

export async function removeBackground(params: RemoveBackgroundParams) {
  const output = await replicate.run(
    AI_MODELS['background-removal'].id as any,
    {
      input: {
        image: params.image,
      },
    }
  );
  return output;
}

export async function imageToVideo(params: ImageToVideoParams) {
  const output = await replicate.run(
    AI_MODELS['image-to-video'].id as any,
    {
      input: {
        input_image: params.image,
        motion_bucket_id: params.motionBucketId || 127,
      },
    }
  );
  return output;
}

export async function textToSpeech(params: TextToSpeechParams) {
  const output = await replicate.run(
    AI_MODELS['text-to-speech'].id as any,
    {
      input: {
        text: params.text,
        speaker_wav: params.speakerWav,
        language: params.language || 'en',
      },
    }
  );
  return output;
}
