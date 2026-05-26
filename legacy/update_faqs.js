const fs = require('fs');

let content = fs.readFileSync('metodologia.html', 'utf8');

const t1 = "La cuantitativa mide volumen y tendencia. La cualitativa explora motivadores profundos.";
const r1 = "La cuantitativa mide volumen, frecuencia y tendencia a través de muestras estadísticamente representativas. La cualitativa explora motivaciones profundas, barreras emocionales y códigos culturales que las encuestas no capturan. En Mindtec integramos ambas en un modelo híbrido que también incorpora neuromarketing, asegurando que la decisión no dependa de una sola perspectiva.";

const t2 = "Permite medir atención y emoción subconsciente.";
const r2 = "Permite medir respuestas de atención y emoción que el consumidor no puede verbalizar. Con herramientas como eye tracking, EEG y facial coding, detectamos qué elementos de una pieza publicitaria, packaging o punto de venta realmente capturan atención y generan aceptación — antes de invertir en producción o pauta masiva.";

const t3 = "A través de modelos de cruce de datos y análisis predictivo.";
const r3 = "Utilizamos inteligencia artificial para análisis de grandes volúmenes de texto abierto, detección de patrones en datos de percepción, modelos predictivos de comportamiento y generación automatizada de dashboards. Esto reduce tiempos de análisis de semanas a días, sin sacrificar profundidad interpretativa.";

const t4 = "Sí. Contamos con red territorial activa en Bolivia.";
const r4 = "Sí. Contamos con una red de más de 80 encuestadores activos con cobertura en La Paz, El Alto, Santa Cruz, Cochabamba y ciudades intermedias. Nuestra infraestructura permite ejecutar levantamientos simultáneos en múltiples ciudades con supervisión centralizada y control de calidad en tiempo real.";

// Global string replacement to catch both the HTML blocks and the LD+JSON schemas
content = content.split(t1).join(r1);
content = content.split(t2).join(r2);
content = content.split(t3).join(r3);
content = content.split(t4).join(r4);

fs.writeFileSync('metodologia.html', content);
console.log("FAQ and JSON-LD answers successfully expanded!");
