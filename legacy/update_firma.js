const fs = require('fs');

const mainBlock = `    <main class="elementor-content">
        <!-- SECCIÓN 1: Hero -->
        <section class="hero-section elementor-section" style="padding-bottom: 3rem; padding-top: 120px; min-height: auto;">
            <div class="container hero-container elementor-container e-con" style="display: block; text-align: center;">
                <div class="hero-content" style="max-width: 900px; margin: 0 auto;">
                    <span class="eyebrow fade-in">EL ADN DE NUESTRA ORGANIZACIÓN</span>
                    <h1 class="hero-title" style="font-size: 3.5rem; line-height: 1.2; margin-bottom: 1.5rem;">Consultora de Investigación de Mercados en Bolivia</h1>
                    <p class="hero-subtitle" style="font-size: 1.25rem; margin-bottom: 2.5rem; max-width: 800px; margin-left: auto; margin-right: auto; line-height: 1.6;">Primera firma boliviana en integrar neurociencia, inteligencia artificial y consultoría estratégica para la toma de decisiones de negocio.</p>
                </div>
            </div>
        </section>

        <!-- SECCIÓN 2: Quiénes somos -->
        <section class="elementor-section premium-section-padding bg-slate" style="padding: 5rem 0;">
            <div class="container elementor-container text-center" style="max-width: 900px;">
                <h2 class="text-navy" style="font-size: 2.5rem; margin-bottom: 2rem;">Quiénes somos</h2>
                <div class="premium-card-white" style="text-align: left; padding: 4rem; font-size: 1.15rem; color: #4a5b6f; line-height: 1.8;">
                    <p style="margin-bottom: 1.5rem;"><strong>Mindtec Neuromarketing & Consulting</strong> es una firma boliviana de inteligencia de mercados fundada con una premisa clara: las empresas bolivianas merecen el mismo nivel de sofisticación analítica que las consultoras internacionales ofrecen en otros mercados.</p>
                    <p style="margin-bottom: 1.5rem;">Nuestro equipo combina psicólogos, analistas de datos, investigadores de campo y especialistas en neurociencia del consumidor para decodificar las verdaderas motivaciones de compra en el mercado boliviano — más allá de lo que las encuestas tradicionales capturan.</p>
                    <p style="margin-bottom: 0;">Operamos desde Bolivia con visión latinoamericana, atendiendo a corporaciones, bancos, empresas de consumo masivo, instituciones educativas y organismos internacionales.</p>
                </div>
            </div>
        </section>

        <!-- SECCIÓN 3: Nuestros Principios Operativos -->
        <section class="problem-section elementor-section bg-white" style="padding: 5rem 0; background-image: none;">
            <div class="container elementor-container">
                <div class="section-header text-center" style="margin-bottom: 4rem;">
                    <span class="eyebrow">ADN CORPORATIVO</span>
                    <h2 class="text-navy" style="font-size: 2.5rem;">Nuestros Principios Operativos</h2>
                </div>

                <div class="problem-statement modern-quote" style="background: rgba(11, 43, 64, 0.03); border-left: 4px solid var(--color-secondary); text-align: left; margin-bottom: 4rem; max-width: 800px; margin-left: auto; margin-right: auto;">
                    <p style="color: #0b2b40;">Mindtec no opera como un proveedor táctico de encuestas. Actuamos como un aliado estratégico aplicando una <strong>metodología propia y estandarizada</strong>, estructurada específicamente para sostener grandes presupuestos corporativos.</p>
                </div>

                <div class="services-grid-modern">
                    <div class="service-card-v3">
                        <h4 style="color: var(--primary-color);">1. Confidencialidad Absoluta</h4>
                        <p style="margin-top: 0.5rem; font-size: 0.95rem; color: #4a5b6f;">Protocolos estrictos de confidencialidad sobre sus próximos movimientos competitivos y debilidades internas detectadas.</p>
                    </div>
                    <div class="service-card-v3">
                        <h4 style="color: var(--primary-color);">2. Rigor en la Evidencia</h4>
                        <p style="margin-top: 0.5rem; font-size: 0.95rem; color: #4a5b6f;">Las decisiones millonarias no se basan en interpretaciones sueltas. Proveemos trazabilidad en cada dato entregado.</p>
                    </div>
                    <div class="service-card-v3">
                        <h4 style="color: var(--primary-color);">3. Validación en Campo Real</h4>
                        <p style="margin-top: 0.5rem; font-size: 0.95rem; color: #4a5b6f;">Saldremos del escritorio. Auditamos el punto de venta y enfrentamos los modelos teóricos con la realidad del mercado boliviano.</p>
                    </div>
                    <div class="service-card-v3">
                        <h4 style="color: var(--primary-color);">4. Entregables para la Acción</h4>
                        <p style="margin-top: 0.5rem; font-size: 0.95rem; color: #4a5b6f;">Hojas de ruta claras y tableros concisos. Traducimos volúmenes masivos de data en conclusiones ejecutivas defendibles.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECCIÓN 4: En cifras -->
        <section class="elementor-section premium-section-padding bg-navy" style="padding: 6rem 0; background-color: var(--color-secondary);">
            <div class="container elementor-container text-center">
                <h2 class="text-white" style="font-size: 2.5rem; margin-bottom: 4rem; color: white;">Mindtec en Cifras</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
                    
                    <div style="border-right: 1px solid rgba(255,255,255,0.1); padding: 1rem;">
                        <div style="font-size: 3.5rem; font-weight: 900; color: var(--color-primary); line-height: 1; margin-bottom: 0.5rem;">80+</div>
                        <p style="color: rgba(255,255,255,0.8); font-size: 1.1rem; font-weight: 500;">Encuestadores activos en Bolivia</p>
                    </div>
                    
                    <div style="border-right: 1px solid rgba(255,255,255,0.1); padding: 1rem;">
                        <div style="font-size: 3.5rem; font-weight: 900; color: var(--color-primary); line-height: 1; margin-bottom: 0.5rem;">4+</div>
                        <p style="color: rgba(255,255,255,0.8); font-size: 1.1rem; font-weight: 500;">Ciudades con cobertura permanente</p>
                    </div>
                    
                    <div style="border-right: 1px solid rgba(255,255,255,0.1); padding: 1rem;">
                        <div style="font-size: 3.5rem; font-weight: 900; color: var(--color-primary); line-height: 1; margin-bottom: 0.5rem; text-transform: uppercase; font-size: 2.5rem; padding-top: 0.5rem; padding-bottom: 0.5rem;">Único</div>
                        <p style="color: rgba(255,255,255,0.8); font-size: 1.1rem; font-weight: 500;">Laboratorio de neuromarketing en el país</p>
                    </div>
                    
                    <div style="padding: 1rem;">
                        <div style="font-size: 3.5rem; font-weight: 900; color: var(--color-primary); line-height: 1; margin-bottom: 0.5rem;">7-60</div>
                        <p style="color: rgba(255,255,255,0.8); font-size: 1.1rem; font-weight: 500;">Días de entrega según complejidad</p>
                    </div>

                </div>
            </div>
        </section>

        <!-- SECCIÓN 5: Nuestro equipo directivo -->
        <section class="elementor-section premium-section-padding bg-slate" style="padding: 6rem 0;">
            <div class="container elementor-container text-center">
                <h2 class="text-navy" style="font-size: 2.5rem; margin-bottom: 4rem;">Nuestro Equipo Directivo</h2>
                
                <!-- Wilmar: insertar aquí datos reales del equipo directivo -->
                <div style="display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap;">
                    
                    <!-- Director 1 -->
                    <div class="premium-card-white" style="flex: 1; min-width: 250px; max-width: 350px; padding: 3rem 2rem;">
                        <div style="width: 100px; height: 100px; background-color: var(--color-primary); border-radius: 50%; margin: 0 auto 1.5rem auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem; font-weight: 700;">D1</div>
                        <h3 style="color: var(--color-secondary); font-size: 1.3rem; margin-bottom: 0.2rem;">Nombre del Director</h3>
                        <p style="color: var(--color-primary); font-weight: 600; font-size: 0.95rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px;">Cargo Directivo</p>
                        <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6;">Especialista en inteligencia de mercados con años analizando el comportamiento del consumidor B2B en la región.</p>
                    </div>

                    <!-- Director 2 -->
                    <div class="premium-card-white" style="flex: 1; min-width: 250px; max-width: 350px; padding: 3rem 2rem;">
                        <div style="width: 100px; height: 100px; background-color: var(--color-secondary); border-radius: 50%; margin: 0 auto 1.5rem auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem; font-weight: 700;">D2</div>
                        <h3 style="color: var(--color-secondary); font-size: 1.3rem; margin-bottom: 0.2rem;">Nombre del Director</h3>
                        <p style="color: var(--color-primary); font-weight: 600; font-size: 0.95rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px;">Cargo Directivo</p>
                        <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6;">Dirige la investigación neurocientífica y la estructuración de la data cualitativa para toma de decisiones ejecutivas.</p>
                    </div>

                </div>
            </div>
        </section>

        <!-- SECCIÓN 6: Para quién NO es nuestra consultoría -->
        <section class="offer-section elementor-section" style="background-color: #fcfcfc; padding: 6rem 0;">
            <div class="container elementor-container">
                <div class="offer-box-modern" style="padding: 4rem; text-align: center;">
                    <div class="offer-header">
                        <span class="eyebrow-light" style="color: rgba(255,255,255,0.6);">TRANSPARENCIA COMERCIAL</span>
                        <h2 style="color: #fff;">Para quién NO es nuestra consultoría</h2>
                    </div>

                    <ul style="max-width: 800px; margin: 3rem auto 0; text-align: left; line-height: 1.8; font-size: 1.1rem; color: #f1f5f9; list-style: none;">
                        <li style="margin-bottom: 1.5rem; padding-left: 1.5rem; position: relative;"><span style="position: absolute; left: 0; color: #fc8181; font-weight: bold;">✕</span> <strong>No somos</strong> para empresas que buscan reportes académicos, teóricos y descriptivos de docenas de páginas sin ninguna conclusión ejecutable.</li>
                        <li style="margin-bottom: 1.5rem; padding-left: 1.5rem; position: relative;"><span style="position: absolute; left: 0; color: #fc8181; font-weight: bold;">✕</span> <strong>No somos</strong> para directivos que prefieren ignorar los datos que contradicen su intuición inicial y evitan enfrentar la realidad del mercado.</li>
                        <li style="margin-bottom: 1.5rem; padding-left: 1.5rem; position: relative;"><span style="position: absolute; left: 0; color: #fc8181; font-weight: bold;">✕</span> <strong>No somos</strong> una agencia de marketing digital operativa. Somos validadores estratégicos previos a la asignación de capital comercial.</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- SECCIÓN 7: Final CTA -->
        <section class="cta-section-modern elementor-section" style="padding: 6rem 0;">
            <div class="container elementor-container glass-container" style="max-width: 900px; margin: 0 auto; text-align: center;">
                <div class="cta-content-v2">
                    <h2 style="font-size: 2.8rem; line-height: 1.2; margin-bottom: 1.5rem;">Decisiones respaldadas por evidencia técnica insustituible.</h2>
                    <p class="cta-subtitle">Programe una sesión inicial para evaluar su desafío junto a nuestro equipo senior.</p>
                    <div class="cta-actions" style="margin-top: 2.5rem;">
                        <a href="contacto.html" class="btn btn-primary lg" style="font-size: 1.1rem; padding: 1rem 2.5rem;">Agendar diagnóstico exploratorio →</a>
                    </div>
                </div>
            </div>
        </section>
    </main>`;

let content = fs.readFileSync('firma.html', 'utf8');

// Replace everything between <main class="elementor-content"> and </main>
content = content.replace(/<main class="elementor-content">[\s\S]*?<\/main>/, mainBlock);

fs.writeFileSync('firma.html', content);
console.log("Firma.html rebuilt!");
