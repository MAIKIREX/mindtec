const fs = require('fs');

const indexFile = 'index.html';
let content = fs.readFileSync(indexFile, 'utf8');

// index.html changes:
// 1. Hero Subtitle
content = content.replace(
    /El margen de error en su próxima decisión podría costarle su participación\s*de mercado o rentabilidad\. Evite moverse a ciegas; validamos sus escenarios comerciales con\s*evidencia verificable y trazable para proteger su inversión y acelerar su crecimiento\./,
    "El éxito corporativo moderno exige audacia para el crecimiento y rigor para mitigar el riesgo. Validamos sus escenarios comerciales con evidencia estructurada para proteger su inversión y maximizar nuevas oportunidades de rentabilidad."
);

// 2. Hero Description
content = content.replace(
    /Mindtec es una firma especializada en investigación de mercados en\s*Bolivia, análisis competitivo y auditoría estratégica\. Reducimos la ansiedad corporativa\s*entregando recomendaciones estratégicas validadas a directorios y gerencias generales\./,
    "Mindtec es una firma especializada en investigación de mercados en Bolivia. Transformamos la incertidumbre en ventaja competitiva, entregando recomendaciones estratégicas sólidas que potencian el crecimiento y brindan seguridad ejecutiva a directorios y gerencias."
);

content = content.replace(
    /Más que datos, le entregamos seguridad\. La\s*investigación de mercado adecuada es el blindaje estratégico previo a la ejecución\./,
    "Más que datos, le entregamos visión estratégica. Una investigación bien diseñada es el motor de crecimiento y el escudo fundamental antes de la ejecución operativa."
);

// 3. Problem Section title
content = content.replace(
    /El mercado no perdona suposiciones\. O se basa en evidencia, o cede terreno\./,
    "Las decisiones basadas en evidencia protegen el capital y aceleran de forma segura el crecimiento de su empresa."
);

// 4. CTA
content = content.replace(
    /Consultoría Estratégica: Un paso en falso en un entorno volátil puede comprometer años de\s*esfuerzo\. Elija avanzar sobre\s*terreno firme\./,
    "Consultoría Estratégica: Avance con seguridad y consolide el liderazgo de su empresa frente a la competencia."
);

content = content.replace(
    /Si su directorio o gerencia general confía en evidencia concreta para ganar,\s*nuestra evaluación estratégica de inicio actuará como su escudo protector\./,
    "Si su directorio confía en evidencia concreta para escalar, nuestra evaluación estratégica funcionará como su escudo corporativo y su motor táctico de crecimiento."
);

fs.writeFileSync(indexFile, content);

console.log('index.html tone updated');
