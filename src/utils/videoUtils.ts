export interface ParsedVideoResult {
  isValid: boolean;
  source?: 'youtube' | 'google-drive';
  embedUrl?: string;
  videoId?: string;
  errorMessage?: string;
}

/**
 * Validates and transforms a YouTube or Google Drive video URL into an embeddable format.
 */
export function parseVideoUrl(rawUrl: string): ParsedVideoResult {
  if (!rawUrl || !rawUrl.trim()) {
    return {
      isValid: false,
      errorMessage: 'Video URL cannot be empty.',
    };
  }

  const url = rawUrl.trim();

  // 1. YouTube Detection
  // Matches:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  // - youtube.com/watch?v=VIDEO_ID
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const ytMatch = url.match(youtubeRegex);

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      isValid: true,
      source: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
    };
  }

  // 2. Google Drive Detection
  // Matches:
  // - https://drive.google.com/file/d/FILE_ID/view
  // - https://drive.google.com/open?id=FILE_ID
  // - https://drive.google.com/file/d/FILE_ID/preview
  const driveFileRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i;
  const driveOpenRegex = /drive\.google\.com\/.*[?&]id=([a-zA-Z0-9_-]+)/i;

  const driveMatch = url.match(driveFileRegex) || url.match(driveOpenRegex);

  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return {
      isValid: true,
      source: 'google-drive',
      videoId: fileId,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    };
  }

  return {
    isValid: false,
    errorMessage: 'Invalid video URL. Please enter a valid YouTube link (e.g. youtube.com/watch?v=...) or a Google Drive link (e.g. drive.google.com/file/d/...).',
  };
}
