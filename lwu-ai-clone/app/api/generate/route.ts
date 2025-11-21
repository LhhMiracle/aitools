import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  AIToolId,
  AI_MODELS,
  generateImage,
  upscaleImage,
  removeBackground,
  imageToVideo,
  textToSpeech,
  hairStyleTransform,
  cartoonStyleTransform,
  portraitEnhance,
  faceSwap,
  objectRemoval,
  sceneComposite,
  photoAnimation,
  specialEffects,
} from '@/lib/replicate';
import { fileToDataUri } from '@/lib/fileUtils';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { toolId, params } = body as {
      toolId: AIToolId;
      params: any;
    };

    if (!toolId || !AI_MODELS[toolId]) {
      return NextResponse.json(
        { error: 'Invalid tool ID' },
        { status: 400 }
      );
    }

    const tool = AI_MODELS[toolId];
    const requiredCredits = tool.credits;

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user || user.credits < requiredCredits) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    // Create generation record
    const generation = await prisma.generation.create({
      data: {
        userId: session.user.id,
        type: toolId,
        status: 'processing',
        prompt: params.prompt || params.text || '',
        originalUrl: params.image || '',
        creditsUsed: requiredCredits,
      },
    });

    // Deduct credits
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        credits: {
          decrement: requiredCredits,
        },
      },
    });

    // Record transaction
    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: 'usage',
        amount: -requiredCredits,
        description: `Used ${requiredCredits} credits for ${tool.name}`,
      },
    });

    // Start AI generation (async - will update DB when complete)
    processGeneration(generation.id, toolId, params).catch(console.error);

    return NextResponse.json({
      generationId: generation.id,
      status: 'processing',
      creditsRemaining: user.credits - requiredCredits,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function processGeneration(
  generationId: string,
  toolId: AIToolId,
  params: any
) {
  try {
    let output: any;

    // Convert image URL to data URI if present
    if (params.image) {
      try {
        params.image = await fileToDataUri(params.image);
      } catch (error) {
        console.error('Failed to convert image to data URI:', error);
        throw new Error('Failed to process input image');
      }
    }

    switch (toolId) {
      case 'image-generation':
        output = await generateImage(params);
        break;
      case 'image-upscale':
        output = await upscaleImage(params);
        break;
      case 'background-removal':
        output = await removeBackground(params);
        break;
      case 'image-to-video':
        output = await imageToVideo(params);
        break;
      case 'text-to-speech':
        output = await textToSpeech(params);
        break;
      case 'hair-style':
        output = await hairStyleTransform(params);
        break;
      case 'cartoon-style':
        output = await cartoonStyleTransform(params);
        break;
      case 'portrait-enhance':
        output = await portraitEnhance(params);
        break;
      case 'face-swap':
        // Handle dual image upload for face swap
        if (params.targetImage) {
          try {
            params.targetImage = await fileToDataUri(params.targetImage);
          } catch (error) {
            console.error('Failed to convert target image:', error);
            throw new Error('Failed to process target image');
          }
        }
        output = await faceSwap({
          sourceImage: params.image,
          targetImage: params.targetImage,
        });
        break;
      case 'object-removal':
        output = await objectRemoval(params);
        break;
      case 'scene-composite':
        output = await sceneComposite(params);
        break;
      case 'photo-animation':
        output = await photoAnimation(params);
        break;
      case 'special-effects':
        output = await specialEffects(params);
        break;
      default:
        throw new Error(`Unsupported tool: ${toolId}`);
    }

    // Extract URL from output (format varies by model)
    const resultUrl = Array.isArray(output) ? output[0] : output;

    await prisma.generation.update({
      where: { id: generationId },
      data: {
        status: 'completed',
        resultUrl: typeof resultUrl === 'string' ? resultUrl : String(resultUrl),
      },
    });
  } catch (error) {
    console.error('Processing error:', error);
    await prisma.generation.update({
      where: { id: generationId },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}
