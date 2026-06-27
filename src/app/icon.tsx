import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: 'linear-gradient(135deg, #1B5E8C 0%, #2876a8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 128,
        }}
      >
        {/* Horizontal bar of cross */}
        <div
          style={{
            position: 'absolute',
            width: 220,
            height: 64,
            background: 'white',
            borderRadius: 16,
          }}
        />
        {/* Vertical bar of cross */}
        <div
          style={{
            position: 'absolute',
            width: 64,
            height: 220,
            background: 'white',
            borderRadius: 16,
          }}
        />
      </div>
    ),
    { width: 512, height: 512 }
  );
}
