// components/FrameWrapper.jsx
'use client';

import dynamic from 'next/dynamic';

const InteractiveFrame = dynamic(
  () => import('./3d/InteractiveFrame'),
  { ssr: false }
);

export default InteractiveFrame;
export { VideoFrame, MemoryFrame } from './3d/InteractiveFrame';