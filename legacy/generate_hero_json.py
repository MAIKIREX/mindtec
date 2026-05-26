import json
import uuid
import time

# --- Helper Functions ---

# --- Helper Functions ---

def generate_id():
    """Generates a short random ID specifically for Elementor (7 characters)."""
    return uuid.uuid4().hex[:7]

def create_element(el_type, widget_type=None, settings=None, elements=None, is_inner=False):
    """Creates a basic Elementor element structure."""
    if settings is None:
        settings = {}
    if elements is None:
        elements = []

    element = {
        "id": generate_id(),
        "elType": el_type,
        "settings": settings,
        "elements": elements,
        "isInner": is_inner
    }

    if widget_type:
        element["widgetType"] = widget_type
    
    return element

# --- Style Constants ---
COLORS = {
    "primary": "#FF6600",
    "primary_hover": "#E65C00",
    "secondary": "#0B2B40",
    "accent": "#F4F6F8",
    "text_main": "#2D3E50",
    "text_light": "#FFFFFF",
    "text_dark": "#0B2B40",
    "grey_subtitle": "#4A5B6F",
    "grey_desc": "#64748b"
}

FONTS = {
    "main": "Inter",
    "secondary": "Helvetica Neue"
}

VISUAL_IMAGE_URL = "hero_neuromarketing_premium_v2_1771034234219.png" # As provided

# --- Main Generator ---

def generate_hero_section():
    """Generates the JSON structure for the Hero Section using standard SECTION/COLUMN layout."""
    
    # 1. Widgets for Column 1
    
    w_eyebrow = create_element("widget", "heading", {
        "title": "INTELIGENCIA ESTRATÉGICA",
        "header_size": "h6",
        "align": "left",
        "title_color": COLORS["primary"],
        "typography_typography": "custom",
        "typography_font_family": FONTS["main"],
        "typography_font_size": {"unit": "rem", "size": 0.85},
        "typography_font_weight": "700",
        "typography_letter_spacing": {"unit": "px", "size": 2.5},
        "typography_transform": "uppercase",
        "_margin": {"unit": "px", "top": 0, "right": 0, "bottom": 24, "left": 0, "isLinked": False}
    })

    w_title = create_element("widget", "heading", {
        "title": "Investigación de Mercados en Bolivia con Inteligencia Estratégica Avanzada",
        "header_size": "h1",
        "align": "left",
        "title_color": COLORS["text_dark"],
        "typography_typography": "custom",
        "typography_font_family": FONTS["main"],
        "typography_font_size": {"unit": "rem", "size": 3.5},
        "typography_font_weight": "800",
        "typography_line_height": {"unit": "em", "size": 1.2},
        "_margin": {"unit": "px", "top": 0, "right": 0, "bottom": 24, "left": 0, "isLinked": False}
    })

    w_subtitle = create_element("widget", "text-editor", {
        "editor": "<p style='color: " + COLORS["grey_subtitle"] + "; font-family: " + FONTS["main"] + "; font-size: 1.25rem; font-weight: 600;'>Antes de invertir, expandirse o redefinir su marca, valide el mercado con análisis estructurado, tecnología avanzada y lectura profunda del comportamiento del consumidor.</p>",
        "_margin": {"unit": "px", "top": 0, "right": 0, "bottom": 24, "left": 0, "isLinked": False}
    })

    w_description = create_element("widget", "text-editor", {
        "editor": "<p style='color: " + COLORS["grey_desc"] + "; font-family: " + FONTS["main"] + "; font-size: 1.1rem; line-height: 1.6;'>Mindtec combina investigación de mercado, análisis con inteligencia artificial y laboratorio de neuromarketing para reducir el riesgo en decisiones críticas.</p>",
        "_margin": {"unit": "px", "top": 0, "right": 0, "bottom": 48, "left": 0, "isLinked": False}
    })

    # Buttons - Using Inline Positioning (Auto width) to sit side-by-side
    w_btn_primary = create_element("widget", "button", {
        "text": "Agendar reunión estratégica",
        "link": {"url": "#contacto", "is_external": "", "nofollow": ""},
        "button_type": "default",
        "size": "md",
        "align": "center",
        "background_color": COLORS["primary"],
        "button_text_color": COLORS["text_light"],
        "typography_typography": "custom",
        "typography_font_weight": "700",
        "typography_transform": "uppercase",
        "border_radius": {"unit": "px", "top": 8, "right": 8, "bottom": 8, "left": 8, "isLinked": True},
        "box_shadow": {"horizontal": 0, "vertical": 4, "blur": 14, "spread": 0, "color": "rgba(255, 102, 0, 0.3)"},
        "button_hover_background_color": COLORS["primary_hover"],
        "_element_width": "auto", # Inline
        "_margin": {"unit": "px", "top": 0, "right": 20, "bottom": 0, "left": 0, "isLinked": False} # Gap between buttons
    })

    w_btn_secondary = create_element("widget", "button", {
        "text": "Evaluar una decisión crítica",
        "link": {"url": "#servicios", "is_external": "", "nofollow": ""},
        "button_type": "default",
        "size": "md",
        "align": "center",
        "background_color": COLORS["secondary"],
        "button_text_color": COLORS["text_light"],
        "typography_typography": "custom",
        "typography_font_weight": "700",
        "typography_transform": "uppercase",
        "border_radius": {"unit": "px", "top": 8, "right": 8, "bottom": 8, "left": 8, "isLinked": True},
        "_element_width": "auto" # Inline
    })
    
    # 2. Widgets for Column 2 (Visual)
    w_spacer = create_element("widget", "spacer", {
        "space": {"unit": "px", "size": 400},
        "view": "traditional"
    })
    
    # 3. Main Columns
    
    # Column 1 (Content) - 55%
    col1 = create_element("column", None, {
        "_column_size": 55,
        "_inline_size": 55, # Explicit inline size for flex compatibility
        "valign": "middle"
    }, elements=[w_eyebrow, w_title, w_subtitle, w_description, w_btn_primary, w_btn_secondary], is_inner=False)
    
    # Column 2 (Visual) - 45%
    col2 = create_element("column", None, {
        "_column_size": 45,
        "_inline_size": 45, # Explicit inline size
        "valign": "middle",
        "background_background": "classic",
        "background_image": {"url": VISUAL_IMAGE_URL, "id": ""},
        "background_position": "center center",
        "background_size": "cover",
        "border_radius": {"unit": "px", "top": 24, "right": 24, "bottom": 24, "left": 24, "isLinked": True},
        # Gradient Overlay
        "background_overlay_background": "gradient",
        "background_overlay_color": COLORS["secondary"],
        "background_overlay_color_b": "#112A3A",
        "background_overlay_gradient_angle": {"unit": "deg", "size": 135},
        "background_overlay_opacity": {"unit": "px", "size": 0.8}
    }, elements=[w_spacer], is_inner=False)


    # 4. Main Section
    hero_section = create_element("section", None, {
        "layout": "boxed", # Content Width
        "boxed_width": {"unit": "px", "size": 1240},
        "min_height": {"unit": "vh", "size": 100},
        "content_position": "middle", # Align items center
        "gap": "extended", # Gap between columns
        "structure": "20", # Helper for Elementor to know it's 2 cols (approximation)
        "padding": {"unit": "px", "top": 160, "right": 0, "bottom": 100, "left": 0, "isLinked": False},
        "background_background": "classic",
        "background_color": "#ffffff"
    }, elements=[col1, col2], is_inner=False)
    
    export_data = {
        "version": "0.4",
        "title": "Hero Section Output",
        "type": "section",
        "content": [hero_section]
    }
    
    return export_data


def generate_problem_section():
    """Generates the JSON structure for the Problem Section."""
    
    # 1. Header Elements
    w_eyebrow = create_element("widget", "heading", {
        "title": "EL CONTEXTO EMPRESARIAL ACTUAL",
        "header_size": "h6",
        "align": "center",
        "title_color": COLORS["primary"],
        "typography_typography": "custom",
        "typography_font_family": FONTS["main"],
        "typography_font_size": {"unit": "rem", "size": 0.85},
        "typography_font_weight": "700",
        "typography_letter_spacing": {"unit": "px", "size": 2.5},
        "typography_transform": "uppercase",
        "_margin": {"unit": "px", "top": 0, "right": 0, "bottom": 24, "left": 0, "isLinked": False}
    })

    w_title = create_element("widget", "heading", {
        "title": "CUANDO LA DECISIÓN ES IMPORTANTE, EL ANÁLISIS DEBE SER MÁS PROFUNDO",
        "header_size": "h2",
        "align": "center",
        "title_color": COLORS["text_dark"],
        "typography_typography": "custom",
        "typography_font_family": FONTS["main"],
        "typography_font_size": {"unit": "rem", "size": 2.5},
        "typography_font_weight": "800",
        "typography_line_height": {"unit": "em", "size": 1.2},
        "_margin": {"unit": "px", "top": 0, "right": 0, "bottom": 32, "left": 0, "isLinked": False}
    })

    # 2. Grid Items logic
    problem_items = [
        "Lanzamiento de nuevos productos",
        "Ajustes de precios",
        "Rebranding o cambio de imagen",
        "Expansión geográfica",
        "Caída en desempeño comercial",
        "Dudas sobre posicionamiento frente a competencia"
    ]
    
    def create_problem_card(text):
        w_icon_box = create_element("widget", "icon-box", {
            "icon": "fa fa-exclamation-triangle",
            "view": "framed", 
            "title_text": text,
            "position": "left",
            "title_size": "h3",
            "icon_color": COLORS["primary"],
            "content_vertical_alignment": "middle",
            "title_color": COLORS["text_dark"],
            "typography_title_typography": "custom",
            "typography_title_font_family": FONTS["main"],
            "typography_title_font_size": {"unit": "rem", "size": 1.1},
            "typography_title_font_weight": "600",
            # Styles
            "background_color": "rgba(255, 255, 255, 0.7)", 
            "border_radius": {"unit": "px", "top": 16, "right": 16, "bottom": 16, "left": 16, "isLinked": True},
            "box_shadow": {"horizontal": 0, "vertical": 10, "blur": 30, "spread": 0, "color": "rgba(11, 43, 64, 0.08)"},
            "_padding": {"unit": "rem", "top": 1.5, "right": 1.5, "bottom": 1.5, "left": 1.5, "isLinked": True},
            "_margin": {"unit": "px", "top": 0, "right": 0, "bottom": 24, "left": 0, "isLinked": False}
        })
        return w_icon_box

    # Create Columns
    row1_cols = []
    for item in problem_items[:3]:
        col = create_element("column", None, {"_column_size": 33}, elements=[create_problem_card(item)], is_inner=True)
        row1_cols.append(col)

    row2_cols = []
    for item in problem_items[3:]:
        col = create_element("column", None, {"_column_size": 33}, elements=[create_problem_card(item)], is_inner=True)
        row2_cols.append(col)

    # Inner Sections
    inner_row1 = create_element("section", None, {"content_width": "boxed", "gap": "wide"}, elements=row1_cols, is_inner=True)
    inner_row2 = create_element("section", None, {"content_width": "boxed", "gap": "wide"}, elements=row2_cols, is_inner=True)


    # 3. Quote
    w_quote = create_element("widget", "text-editor", {
        "editor": "<div style='text-align: center; border-left: 4px solid " + COLORS["primary"] + "; background: rgba(255, 102, 0, 0.03); padding: 3rem; margin: 3rem auto 0; max-width: 900px;'><p style='font-size: 1.5rem; font-style: italic; color: " + COLORS["text_main"] + "; margin: 0;'>La información superficial no es suficiente. Se necesita análisis avanzado.</p></div>",
    })
    
    
    # 4. Main Section Structure
    main_col = create_element("column", None, {"_column_size": 100}, elements=[
        w_eyebrow, w_title, 
        inner_row1, inner_row2, 
        w_quote
    ], is_inner=False)
    
    problem_section = create_element("section", None, {
        "layout": "boxed",
        "boxed_width": {"unit": "px", "size": 1240},
        "padding": {"unit": "rem", "top": 8, "right": 0, "bottom": 8, "left": 0, "isLinked": False}, 
        "background_background": "classic",
        "background_image": {"url": "background_neural_mesh_1771034277513.png", "id": ""},
        "background_position": "center center",
        "background_size": "cover",
        "background_attachment": "fixed",
        "background_overlay_background": "classic",
        "background_overlay_color": "rgba(255, 255, 255, 0.9)"
    }, elements=[main_col], is_inner=False)


    export_data = {
        "version": "0.4",
        "title": "Problem Section Output",
        "type": "section",
        "content": [problem_section]
    }
    
    return export_data

if __name__ == "__main__":
    # Generate Hero (Commented out to focus on Problem)
    # hero_data = generate_hero_section()
    # with open("mindtec_hero_section.json", "w", encoding="utf-8") as f:
    #     json.dump(hero_data, f, indent=4, ensure_ascii=False)
    # print(f"Successfully generated mindtec_hero_section.json")
    
    # Generate Problem
    problem_data = generate_problem_section()
    with open("mindtec_problem_section.json", "w", encoding="utf-8") as f:
        json.dump(problem_data, f, indent=4, ensure_ascii=False)
        
    print(f"Successfully generated mindtec_problem_section.json")
