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
  // New AI Tools
  'hair-style': {
    id: 'tencentarc/photomaker:ddfc2b08d209f9fa8c1uj2ae5fd3ad10c1be0de2evy4j8c0ba3f93fe54c7cf',
    name: 'Hair Style Transfer',
    description: 'Transform hair styles with AI',
    credits: 4,
  },
  'cartoon-style': {
    id: 'cjwbw/anything-v3.0:09a5805203f4c12da649ec1923bb7729517ca25fcac790e640eaa9ed66573b65',
    name: 'Cartoon Style',
    description: 'Convert photos to cartoon/anime style',
    credits: 3,
  },
  'portrait-enhance': {
    id: 'tencentarc/gfpgan:0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c',
    name: 'Portrait Enhance',
    description: 'Enhance and beautify portraits',
    credits: 2,
  },
  'face-swap': {
    id: 'lucataco/facefusion:a2c7f9df13e98f5b589c7b17d81b8e8a2d3f5d6b8c1e2f9a4b5d7e8f1a2c3b4d',
    name: 'Face Swap',
    description: 'Swap faces between two photos',
    credits: 4,
  },
  'object-removal': {
    id: 'stability-ai/stable-diffusion-inpainting:95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd68b3',
    name: 'Object Removal',
    description: 'Remove unwanted objects from images',
    credits: 3,
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

interface HairStyleParams {
  image: string;
  hairStyle: string;
  prompt?: string;
}

interface CartoonStyleParams {
  image: string;
  style?: string;
}

interface PortraitEnhanceParams {
  image: string;
}

interface FaceSwapParams {
  sourceImage: string;
  targetImage: string;
}

interface ObjectRemovalParams {
  image: string;
  mask: string;
  prompt?: string;
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

// New AI Tool Functions

export async function hairStyleTransform(params: HairStyleParams) {
  const output = await replicate.run(
    AI_MODELS['hair-style'].id as any,
    {
      input: {
        input_image: params.image,
        prompt: `a person with ${params.hairStyle} hair style, ${params.prompt || 'high quality, realistic'}`,
        style_name: 'Photographic (Default)',
        num_steps: 50,
        style_strength_ratio: 20,
        guidance_scale: 5,
      },
    }
  );
  return output;
}

export async function cartoonStyleTransform(params: CartoonStyleParams) {
  const output = await replicate.run(
    AI_MODELS['cartoon-style'].id as any,
    {
      input: {
        prompt: `anime style, cartoon, ${params.style || 'high quality illustration'}`,
        image: params.image,
        num_inference_steps: 20,
        guidance_scale: 7,
      },
    }
  );
  return output;
}

export async function portraitEnhance(params: PortraitEnhanceParams) {
  const output = await replicate.run(
    AI_MODELS['portrait-enhance'].id as any,
    {
      input: {
        img: params.image,
        version: 'v1.4',
        scale: 2,
      },
    }
  );
  return output;
}

export async function faceSwap(params: FaceSwapParams) {
  const output = await replicate.run(
    AI_MODELS['face-swap'].id as any,
    {
      input: {
        source_image: params.sourceImage,
        target_image: params.targetImage,
      },
    }
  );
  return output;
}

export async function objectRemoval(params: ObjectRemovalParams) {
  const output = await replicate.run(
    AI_MODELS['object-removal'].id as any,
    {
      input: {
        image: params.image,
        mask: params.mask,
        prompt: params.prompt || 'background, clean, seamless',
        num_inference_steps: 50,
        guidance_scale: 7.5,
      },
    }
  );
  return output;
}
