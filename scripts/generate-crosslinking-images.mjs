#!/usr/bin/env node
/**
 * Script para generar imágenes de fondo para las tarjetas de cross-linking
 * usando la API MUAPI para neuromarketing-bolivia
 */

import { createTask, pollTask, downloadAndSave } from './lib/muapi-client.mjs';

const OUTPUT_DIR = 'public/cross-linking';

// Definiciones de imágenes para cada tarjeta
const cards = [
  {
    name: 'percepcion-marca-card',
    prompt: 'Professional brand perception analysis, brain with brand icons, modern business analytics, neural network representing consumer perception, corporate blue tones, scientific research aesthetic, high-tech marketing visualization',
    size: '1024*1024'
  },
  {
    name: 'auditoria-retail-card',
    prompt: 'Modern retail audit visualization, shopping aisle with digital analytics overlays, price verification technology, store monitoring systems, professional retail analytics, clean business environment with data visualization elements',
    size: '1024*1024'
  },
  {
    name: 'consumidor-boliviano-card',
    prompt: 'Bolivian consumer behavior research visualization, diverse market scenes, shopping patterns analysis, cultural consumer insights, market research data visualization, authentic retail environment with analytics overlay',
    size: '1024*1024'
  }
];

// Función principal para generar las imágenes
async function generateCrosslinkingImages() {
  console.log('🎨 Iniciando generación de imágenes para tarjetas de cross-linking...\n');
  console.log(`📁 Directorio de salida: ${OUTPUT_DIR}\n`);

  for (const card of cards) {
    console.log(`\n📦 Procesando: ${card.name}`);
    console.log(`   Prompt: ${card.prompt.substring(0, 80)}...`);

    try {
      // Crear la tarea de generación
      const requestId = await createTask(card.prompt, null, card.size);
      console.log(`   ✅ Tarea creada: ${requestId}`);

      // Esperar a que se complete la generación
      const imageUrl = await pollTask(requestId);
      console.log(`   🖼️  Imagen generada: ${imageUrl.substring(0, 60)}...`);

      // Descargar y guardar la imagen
      const outputPath = await downloadAndSave(imageUrl, OUTPUT_DIR, card.name);
      console.log(`   💾 Guardada en: ${outputPath}`);

    } catch (error) {
      console.error(`   ❌ Error generando ${card.name}:`, error.message);
      // Continuar con la siguiente imagen
    }
  }

  console.log('\n✨ Proceso completado. Imágenes generadas para cross-linking.');
}

// Ejecutar el script
generateCrosslinkingImages().catch(console.error);