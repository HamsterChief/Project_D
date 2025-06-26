// utils/getOverlayColor.ts
import { AppSettingsProps } from './AppSettingsUtils';

export const getOverlayColor = (background: string | undefined) => {
  switch (background) {
    case 'Grey':       // Zen
      return 'rgba(240,240,240,0.6)';
    case 'Green':      // Rustgevend
      return 'rgba(200,240,200,0.5)';
    case 'NavyBlue':   // Donkere modus
      return 'rgba(0,0,30,0.5)';
    case 'Roze':       // Gevarieerd
      return 'rgba(255,220,235,0.5)';
    default:
      return 'rgba(255,255,255,0.3)';
  }
};


export const getDayButtonColor = (background: string | undefined, isSelected: boolean) => {
  if (isSelected) return '#3399ff'; // Geselecteerde dag = blauw

  switch (background) {
    case 'Grey':       // Zen
      return '#e0e0e0';
    case 'Green':      // Rustgevend
      return '#d8f3dc'; // Zachtgroen
    case 'NavyBlue':   // Donkere modus
      return '#2e3a59'; // Donkerblauwgrijs
    case 'Roze':       // Gevarieerd
      return '#ffe4ef'; // Zachtroze
    default:
      return '#f0f0f0'; // Fallback lichtgrijs
  }
};
