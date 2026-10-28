import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';

// Permite usar className en expo-image (NativeWind no lo hace por defecto).
cssInterop(Image, { className: 'style' });
