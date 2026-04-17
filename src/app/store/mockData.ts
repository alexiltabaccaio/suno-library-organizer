import { Song } from '@/entities/song/model/types';
import { COVER_GRADIENTS } from '@/shared/lib/constants';

export const INITIAL_SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Morning Light',
    styles: 'Synthwave, 80s nostalgia, pulsing bass, gated reverb drums, neon aesthetic',
    lyrics: "[Atmospheric Intro]\n[Pulsing Synthesizer]\nCan you feel the energy?\n(Energy)\nIt's taking over you and me\n(You and me)\n\n[Instrumental Break]\n[Hard-hitting Drums]\n(Let's go!)\nDance until the morning light\n(Jump! Jump!)\n\n[Verse]\nNeon lights are flashing bright\nEverything is feeling right\n(So right)\nLose yourself inside the sound\nFeet are lifting off the ground\n\n[Pre-Chorus]\nHere it comes again\nWe're reaching for the end\n(Hold on tight)\n\n[Chorus]\n[Heavy Bass Drop]\n(Let's go!)\nDance until the morning light\n(Jump! Jump!)",
    duration: '2:06',
    version: 'v5.5',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    coverColor: COVER_GRADIENTS[0],
    takeNumber: 2,
  },
  {
    id: '2',
    title: 'Neon Morning Light',
    styles: 'Synthwave, 80s nostalgia, pulsing bass, gated reverb drums, neon aesthetic',
    lyrics: "[Atmospheric Intro]\n[Pulsing Synthesizer]\nCan you feel the energy?\n(Energy)\nIt's taking over you and me\n(You and me)\n\n[Instrumental Break]\n[Hard-hitting Drums]\n(Let's go!)\nDance until the morning light\n(Jump! Jump!)\n\n[Verse]\nNeon lights are flashing bright\nEverything is feeling right\n(So right)\nLose yourself inside the sound\nFeet are lifting off the ground\n\n[Pre-Chorus]\nHere it comes again\nWe're reaching for the end\n(Hold on tight)\n\n[Chorus]\n[Heavy Bass Drop]\n(Let's go!)\nDance until the morning light\n(Jump! Jump!)",
    duration: '2:27',
    version: 'v5.5',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 - 10000),
    coverColor: COVER_GRADIENTS[3],
    takeNumber: 1,
  }
];
