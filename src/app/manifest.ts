import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Upward Specialist Hospital',
    short_name: 'Upward Health',
    description: 'Quality Specialist Care — book appointments, BMI calculator, vaccination reminders and more.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F0F7FF',
    theme_color: '#1B5E8C',
    categories: ['health', 'medical'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name: 'Book Appointment',
        short_name: 'Book',
        description: 'Schedule your next visit',
        url: '/#book',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'BMI Calculator',
        short_name: 'BMI',
        description: 'Check your Body Mass Index',
        url: '/?tool=bmi',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Vaccination Reminder',
        short_name: 'Vaccines',
        description: "Check your child's vaccine schedule",
        url: '/?tool=vaccine',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
