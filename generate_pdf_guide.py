import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

# ----------------------------------------------------------------------
# Numbered Canvas for Running Headers and Footers ("Page X of Y")
# ----------------------------------------------------------------------
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#6E5A4C"))

        # Skip headers/footers on page 1 (cover)
        if self._pageNumber > 1:
            # Header
            self.drawString(40, 755, "Paw Care — Technical Architecture & Academic Viva Examination Guide")
            self.setStrokeColor(colors.HexColor("#DFD2C0"))
            self.setLineWidth(0.75)
            self.line(40, 747, 572, 747)

            # Footer
            self.line(40, 42, 572, 42)
            self.drawString(40, 30, "Paw Care Platform · Cloud Architecture (Supabase / Vanilla JS / CSS3 Grid)")
            page_str = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(572, 30, page_str)
        self.restoreState()

# ----------------------------------------------------------------------
# Helper Functions
# ----------------------------------------------------------------------
def make_callout(text, title="KEY ARCHITECTURAL INSIGHT", style_p=None, bg="#FAF5EC", border="#482B19"):
    p_title = Paragraph(f"<b>{title}</b>", ParagraphStyle(
        'CalloutTitle',
        parent=style_p,
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor(border)
    ))
    p_body = Paragraph(text, ParagraphStyle(
        'CalloutBody',
        parent=style_p,
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#2F1B10')
    ))
    t = Table([[p_title], [p_body]], colWidths=[532])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor(bg)),
        ('BOX', (0,0), (-1,-1), 1.2, colors.HexColor(border)),
        ('PADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,0), 3),
        ('TOPPADDING', (0,1), (-1,1), 2),
    ]))
    return t

def make_qa_block(q_num, category, question, answer, styles):
    q_text = f"<b>Q{q_num} [{category}]:</b> {question}"
    p_q = Paragraph(q_text, styles['VivaQ'])
    p_a = Paragraph(f"<b>Answer:</b> {answer}", styles['VivaA'])
    
    t = Table([[p_q], [p_a]], colWidths=[532])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FAF5EC')),
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor('#DFD2C0')),
        ('LINEBEFORE', (0,0), (0,-1), 3.5, colors.HexColor('#482B19')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    return t

# ----------------------------------------------------------------------
# Main PDF Builder
# ----------------------------------------------------------------------
def build_pdf(filename="Paw_Care_Technical_Report_and_Viva_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=52,
        bottomMargin=52
    )

    base_styles = getSampleStyleSheet()

    # Custom Palette
    C_PRIMARY = colors.HexColor('#482B19')   # Warm Walnut Brown
    C_HEADING = colors.HexColor('#2F1B10')   # Deep Coffee
    C_BODY    = colors.HexColor('#2F1B10')   # Body text
    C_MUTED   = colors.HexColor('#6E5A4C')   # Secondary text
    C_ACCENT  = colors.HexColor('#7C4D19')   # Amber brown
    C_SAND    = colors.HexColor('#FAF5EC')   # Background sand tint
    C_BORDER  = colors.HexColor('#DFD2C0')   # Subtle border

    styles = {
        'CoverTitle': ParagraphStyle(
            'CoverTitle',
            parent=base_styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=24,
            leading=28,
            textColor=C_PRIMARY,
            alignment=0,
            spaceAfter=6
        ),
        'CoverSubtitle': ParagraphStyle(
            'CoverSubtitle',
            parent=base_styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=15,
            textColor=C_ACCENT,
            spaceAfter=14
        ),
        'CoverDesc': ParagraphStyle(
            'CoverDesc',
            parent=base_styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=14,
            textColor=C_MUTED,
            spaceAfter=16
        ),
        'H1': ParagraphStyle(
            'H1',
            parent=base_styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=14,
            leading=18,
            textColor=C_PRIMARY,
            spaceBefore=14,
            spaceAfter=6,
            keepWithNext=True
        ),
        'H2': ParagraphStyle(
            'H2',
            parent=base_styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=15,
            textColor=C_HEADING,
            spaceBefore=10,
            spaceAfter=4,
            keepWithNext=True
        ),
        'Body': ParagraphStyle(
            'Body',
            parent=base_styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=13.5,
            textColor=C_BODY,
            spaceAfter=6
        ),
        'Bullet': ParagraphStyle(
            'Bullet',
            parent=base_styles['Normal'],
            fontName='Helvetica',
            fontSize=8.8,
            leading=13,
            textColor=C_BODY,
            leftIndent=14,
            firstLineIndent=-10,
            spaceAfter=3
        ),
        'TableHead': ParagraphStyle(
            'TableHead',
            parent=base_styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=8,
            leading=11,
            textColor=colors.HexColor('#482B19')
        ),
        'TableCell': ParagraphStyle(
            'TableCell',
            parent=base_styles['Normal'],
            fontName='Helvetica',
            fontSize=8,
            leading=11,
            textColor=C_BODY
        ),
        'TableCellCode': ParagraphStyle(
            'TableCellCode',
            parent=base_styles['Normal'],
            fontName='Courier-Bold',
            fontSize=7.5,
            leading=10,
            textColor=colors.HexColor('#6E3A19')
        ),
        'VivaQ': ParagraphStyle(
            'VivaQ',
            parent=base_styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9.2,
            leading=13,
            textColor=C_PRIMARY,
            spaceAfter=4
        ),
        'VivaA': ParagraphStyle(
            'VivaA',
            parent=base_styles['Normal'],
            fontName='Helvetica',
            fontSize=8.6,
            leading=12.5,
            textColor=C_BODY
        ),
    }

    story = []

    # =========================================================================
    # COVER / HEADER BANNER
    # =========================================================================
    story.append(Paragraph("PAW CARE — COMPREHENSIVE TECHNICAL REPORT", styles['CoverTitle']))
    story.append(Paragraph("System Architecture, Cloud Database (PostgreSQL/Supabase), Client-Side SPA Engine & Academic Viva Examination Guide", styles['CoverSubtitle']))
    story.append(Paragraph(
        "A complete reference document covering the technical implementation, database modeling, security policies, UI/UX engineering, "
        "and 28 in-depth academic viva questions with comprehensive answers for engineering, college project review, and viva-voce examinations.",
        styles['CoverDesc']
    ))

    # Metadata Card
    meta_data = [
        [
            Paragraph("<b>Project:</b> Paw Care Pet Healthcare Platform", styles['TableCell']),
            Paragraph("<b>Stack:</b> HTML5, CSS3, ES6+ JS, Supabase, PostgreSQL", styles['TableCell'])
        ],
        [
            Paragraph("<b>Architecture:</b> Vanilla JS Single-Page App (SPA) Engine", styles['TableCell']),
            Paragraph("<b>Security:</b> Row Level Security (RLS), JWT, bcrypt", styles['TableCell'])
        ],
        [
            Paragraph("<b>Database:</b> PostgreSQL 15 (Supabase Cloud)", styles['TableCell']),
            Paragraph("<b>Repositories:</b> github.com/Khushal1923/DT (Branch: main)", styles['TableCell'])
        ]
    ]
    meta_table = Table(meta_data, colWidths=[266, 266])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FAF5EC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#DFD2C0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#EFE5D6')),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # =========================================================================
    # SECTION 1: EXECUTIVE SUMMARY & PROBLEM STATEMENT
    # =========================================================================
    story.append(Paragraph("1. Executive Summary & Problem Formulation", styles['H1']))
    story.append(Paragraph(
        "Modern pet healthcare is hindered by fragmented paper records, non-standardized vaccination tracking, and lack of real-time clinic scheduling. "
        "Pet owners struggle to keep accurate records of allergies, past illnesses, and weight trajectories, while veterinary clinics face high administrative overhead "
        "managing booking requests, open consultation slots, and manual prescription writing.",
        styles['Body']
    ))
    story.append(Paragraph(
        "<b>Paw Care</b> is an end-to-end, dual-role web ecosystem designed to unite pet owners and veterinarians into a synchronized, secure <b>'Care Circle'</b>. "
        "The system provides distinct workspaces: a pet owner portal for profiles, health histories, and medication reminders, and a veterinary clinic workspace "
        "featuring today's schedule, weekly appointment calendar, request/availability management, and an interactive digital medical records consultation suite.",
        styles['Body']
    ))

    story.append(make_callout(
        "• <b>Dual-Role Workspace Isolation:</b> Distinct portals for Pet Owners (Rohan Patil) and Veterinarians (Dr. Anita Rao) with role-guarded routes.<br/>"
        "• <b>Zero-Framework High Performance:</b> Built using modern Vanilla JavaScript (ES6+), eliminating megabyte-heavy bundler overhead while delivering single-page application (SPA) responsiveness.<br/>"
        "• <b>Real-time Clinical Operations:</b> Dynamic search, live prescription row builder, 7-day schedule filtering, and instant slot availability updates.",
        title="CORE PLATFORM VALUE PROPOSITIONS",
        style_p=styles['Body']
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 2: SYSTEM ARCHITECTURE & TECHNICAL STACK
    # =========================================================================
    story.append(Paragraph("2. System Architecture & Technical Stack", styles['H1']))
    story.append(Paragraph(
        "Paw Care employs a decoupled 2-tier client-serverless cloud architecture. The frontend is delivered as pre-rendered semantic HTML5 pages styled with a bespoke "
        "CSS3 custom property design system and controlled via an asynchronous JavaScript application router. Data persistence, authentication, and role authorization "
        "are powered by <b>Supabase</b> (managed PostgreSQL 15).",
        styles['Body']
    ))

    tech_stack_data = [
        [Paragraph("<b>Layer</b>", styles['TableHead']), Paragraph("<b>Technology</b>", styles['TableHead']), Paragraph("<b>Purpose & Architectural Justification</b>", styles['TableHead'])],
        [
            Paragraph("<b>Presentation</b>", styles['TableCell']),
            Paragraph("Semantic HTML5 & CSS3 (Custom Variables, Grid, Flexbox)", styles['TableCell']),
            Paragraph("Zero external CSS framework dependencies; ultra-fast load times, responsive breakpoints (768px, 992px), CSS scroll-snapping on landing page.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Client Router</b>", styles['TableCell']),
            Paragraph("Vanilla ES6+ JS Router (`initSeamlessNavigation`)", styles['TableCell']),
            Paragraph("Intercepts anchor clicks, fetches target HTML asynchronously via `fetch()`, parses DOM trees with `DOMParser()`, and swaps `.app-main` content dynamically using `history.pushState()`. Prevents white-screen flashes.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Data Hydration</b>", styles['TableCell']),
            Paragraph("Client-Side Hydration Engine (`hydrateWorkspaceData`)", styles['TableCell']),
            Paragraph("Synchronizes pet attributes (name, breed, weight, allergies) and appointment statuses seamlessly across multiple HTML templates without requiring framework re-renders.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Backend & DB</b>", styles['TableCell']),
            Paragraph("Supabase (PostgreSQL 15+ Cloud)", styles['TableCell']),
            Paragraph("Relational database with Row Level Security (RLS), auto-generated RESTful endpoints, native UUID generation (`gen_random_uuid()`), and real-time event webhooks.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Auth & Security</b>", styles['TableCell']),
            Paragraph("Supabase Auth (JWT & bcrypt)", styles['TableCell']),
            Paragraph("Stateless JSON Web Tokens with embedded user IDs (`auth.uid()`), verified at the PostgreSQL database kernel via SQL Row Level Security policies.", styles['TableCell'])
        ]
    ]
    t_stack = Table(tech_stack_data, colWidths=[80, 160, 292])
    t_stack.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EFE5D6')),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#EAE0D2')),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_stack)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 3: DATABASE SCHEMA & RELATIONAL MODELING
    # =========================================================================
    story.append(Paragraph("3. Database Schema & Relational Data Modeling", styles['H1']))
    story.append(Paragraph(
        "The relational schema in `schema.sql` is normalized to 3NF for entity integrity, with strategic JSONB columns for flexible arrays (prescriptions, services). "
        "Referential integrity is guaranteed with foreign key cascade actions (`ON DELETE CASCADE`).",
        styles['Body']
    ))

    schema_table_data = [
        [Paragraph("<b>Table Name</b>", styles['TableHead']), Paragraph("<b>Primary Key</b>", styles['TableHead']), Paragraph("<b>Foreign Keys & Relationships</b>", styles['TableHead']), Paragraph("<b>Description & Critical Attributes</b>", styles['TableHead'])],
        [
            Paragraph("`profiles`", styles['TableCellCode']),
            Paragraph("`id` (UUID references auth.users)", styles['TableCell']),
            Paragraph("1-to-1 with `auth.users`", styles['TableCell']),
            Paragraph("User metadata (role: 'owner'|'vet', first_name, last_name, phone, address, city, member_since).", styles['TableCell'])
        ],
        [
            Paragraph("`vets`", styles['TableCellCode']),
            Paragraph("`id` (UUID)", styles['TableCell']),
            Paragraph("`user_id` -> `profiles.id`", styles['TableCell']),
            Paragraph("Clinic profile (clinic_name, location, verified boolean, opening_hours, services jsonb, image_url).", styles['TableCell'])
        ],
        [
            Paragraph("`pets`", styles['TableCellCode']),
            Paragraph("`id` (UUID)", styles['TableCell']),
            Paragraph("`owner_id` -> `profiles.id` (CASCADE)", styles['TableCell']),
            Paragraph("Pet record (name, species, breed, age, weight numeric(4,1), sex, microchip, allergies, photo_url).", styles['TableCell'])
        ],
        [
            Paragraph("`appointments`", styles['TableCellCode']),
            Paragraph("`id` (UUID)", styles['TableCell']),
            Paragraph("`owner_id`, `pet_id`, `vet_id`", styles['TableCell']),
            Paragraph("Bookings (date, time, reason, status: 'awaiting_acceptance'|'confirmed'|'completed'|'cancelled').", styles['TableCell'])
        ],
        [
            Paragraph("`medical_records`", styles['TableCellCode']),
            Paragraph("`id` (UUID)", styles['TableCell']),
            Paragraph("`pet_id`, `vet_id`", styles['TableCell']),
            Paragraph("Consultation record (chief_complaint, diagnosis_notes, prescriptions jsonb, vaccinations jsonb, follow_up).", styles['TableCell'])
        ],
        [
            Paragraph("`reminders`", styles['TableCellCode']),
            Paragraph("`id` (UUID)", styles['TableCell']),
            Paragraph("`owner_id`, `pet_id` (CASCADE)", styles['TableCell']),
            Paragraph("Preventive reminders (title, due_date, due_time, badge_type, reminder_type: 'medication'|'vaccine'|'appointment').", styles['TableCell'])
        ],
        [
            Paragraph("`notification_preferences`", styles['TableCellCode']),
            Paragraph("`id` (UUID)", styles['TableCell']),
            Paragraph("`owner_id` -> `profiles.id` (UNIQUE)", styles['TableCell']),
            Paragraph("Notification settings (email_reminders, sms_reminders, medication_time, advance notice settings).", styles['TableCell'])
        ]
    ]
    t_schema = Table(schema_table_data, colWidths=[90, 80, 110, 252])
    t_schema.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EFE5D6')),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#EAE0D2')),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_schema)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 4: DETAILED MODULE BREAKDOWN & WORKSPACE DESIGN
    # =========================================================================
    story.append(Paragraph("4. Module Engineering & Interface Breakdown", styles['H1']))

    story.append(Paragraph("4.1 Landing Page Architecture (`index.html`)", styles['H2']))
    story.append(Paragraph(
        "• <b>Full-Height Scroll Snapping:</b> Implemented via CSS scroll-snap (`scroll-snap-type: y mandatory; scroll-snap-align: start`) on viewports ≥993px. Each of the 5 key sections (Hero, 3 Pillars, Care Team, FAQ, CTA) occupies exactly 100vh without distracting visual overlap.<br/>"
        "• <b>Decluttered Hero Section:</b> Eliminated floating cards to highlight the primary value proposition and call-to-actions.<br/>"
        "• <b>Interactive FAQ Accordion:</b> Accessible accordions utilizing `aria-expanded` attributes with single-open toggle logic in `script.js`.",
        styles['Bullet']
    ))

    story.append(Paragraph("4.2 Pet Owner Portal (`overview.html`, `health-records.html`, `pet-profile.html`)", styles['H2']))
    story.append(Paragraph(
        "• <b>Hero Card Split Layout (`health-records.html`):</b> Solved letterbox photo distortion by engineering a side-by-side flex layout (`.pet-records-hero-layout`). A 1:1 square frame (190px × 190px, `object-fit: cover`) preserves Bruno's portrait alongside a structured square of info (allergies, age, weight, profile actions).<br/>"
        "• <b>Filter Tabs:</b> Medical records filtered by categories (All, Visits, Lab Reports, Prescriptions) using clean CSS states.<br/>"
        "• <b>Reminders & Booking:</b> Two-step appointment booking flow with interactive time-slot selectors and instant confirmation summaries.",
        styles['Bullet']
    ))

    story.append(Paragraph("4.3 Veterinarian Workspace (`vet-overview.html`, `vet-week-schedule.html`, `vet-requests-availability.html`, `vet-consultation.html`)", styles['H2']))
    story.append(Paragraph(
        "• <b>Overview Page (`vet-overview.html`):</b> Strictly displays <b>Today's Schedule</b> (3 visits: Bruno 9:00 am Completed, Mishti 11:30 am Upcoming, Coco 2:00 pm Upcoming). The patient overview card was completely excised as requested. Features a top metric strip (Total visits, Completed, Upcoming, Open slots today) and a direct button to <b>'Week schedule'</b>.<br/>"
        "• <b>Dedicated Week Schedule (`vet-week-schedule.html`):</b> Displays all 18 weekly appointments across 7 days (Mon 5 Oct – Sun 11 Oct 2026). Equipped with interactive day selector tabs (`All`, `Mon`, `Tue`, `Wed [Today]`, `Thu`, `Fri`, `Sat`, `Sun`) for instant day-by-day filtering.<br/>"
        "• <b>Request & Availability (`vet-requests-availability.html`):</b> Exclusively houses pending booking requests (Bruno rabies booster, Simba puppy vaccination) with dynamic <b>Accept</b> and <b>Reschedule</b> actions, and open slot configurations (timing dropdowns, update availability, block time). Does NOT show the whole week's schedule.<br/>"
        "• <b>Medical Records & Consultation Suite (`vet-consultation.html`):</b><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;1. <b>Real-time Search Bar:</b> Instant client-side search filtering appointments by pet's name or owner's name.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;2. <b>Today's Booked Patient Small Divs:</b> Interactive compact cards for Bruno, Mishti, and Coco with visit status and history snippets.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;3. <b>Dynamic Patient Detail Switcher:</b> Clicking any small div swaps demographic data, photos, past visit logs, and allergies instantly.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;4. <b>Today's Clinical Diagnosis:</b> Dedicated textarea for writing/updating today's examination diagnosis and clinical observations.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;5. <b>Interactive Prescription Builder:</b> Editable table with medicine, dosage, duration, instructions, and dynamic <b>'+ Add medication'</b> row generator.",
        styles['Bullet']
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 5: ADVANCED TECHNICAL INNOVATIONS
    # =========================================================================
    story.append(Paragraph("5. Advanced Technical Innovations & Engineering Highlights", styles['H1']))
    story.append(Paragraph(
        "<b>1. Vanilla JS SPA Engine (`initSeamlessNavigation`):</b><br/>"
        "Instead of relying on heavy frontend frameworks (React/Vue/Angular), Paw Care implements a native SPA engine in 60 lines of vanilla JavaScript. "
        "It intercepts clicks on `.sidebar-link`, executes an asynchronous `fetch()` call for the target page, parses the incoming HTML string using the browser's native `DOMParser()`, "
        "replaces `.app-main`, updates the active link classes, updates `document.title`, pushes the state to `window.history`, and invokes `hydrateWorkspaceData()`. "
        "This achieves sub-100ms transitions with zero full-page reloads and zero framework bundle overhead.",
        styles['Body']
    ))
    story.append(Paragraph(
        "<b>2. Real-Time Client-Side Search Algorithm:</b><br/>"
        "The search bar in the Records section implements an efficient client-side filtering algorithm. Each small div contains metadata data attributes (`data-pet`, `data-owner`). "
        "On each `input` keystroke, the query is normalized (`trim().toLowerCase()`) and evaluated against each node. Non-matching nodes are hidden (`display: none`), while matching nodes "
        "are displayed (`display: flex`). An automated match counter displays an empty-state message if zero appointments match the query.",
        styles['Body']
    ))
    story.append(Paragraph(
        "<b>3. Dynamic DOM Prescription Generator:</b><br/>"
        "Veterinarians can generate multi-item prescriptions dynamically. The `addPrescriptionRow()` function programmatically creates table row elements (`&lt;tr&gt;`) with customized form controls "
        "and binds deletion handlers to individual removal buttons. On submission, the rows are extracted into a structured JSON payload ready for database persistence.",
        styles['Body']
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 6: COMPREHENSIVE VIVA QUESTIONS & ANSWERS (28 QUESTIONS)
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("6. Academic Viva Examination Questions & Comprehensive Answers", styles['H1']))
    story.append(Paragraph(
        "The following 28 technical viva questions cover conceptual, architectural, database, security, and practical troubleshooting topics "
        "frequently questioned by teachers, external evaluators, and project review committees.",
        styles['CoverDesc']
    ))

    # VIVA QUESTIONS LIST
    viva_questions = [
        # --- General & Conceptual ---
        (
            1, "Concept & Problem Statement",
            "What is Paw Care, and what core problem does this project solve?",
            "Paw Care is a specialized pet healthcare platform that connects pet owners and veterinary practitioners into a synchronized 'Care Circle'. "
            "It solves three major problems: (1) fragmented pet medical records by digitizing health histories, diagnoses, and allergies in one centralized cloud database; "
            "(2) poor medication adherence through automated reminder scheduling; and (3) clinic appointment inefficiency by giving veterinarians dedicated schedule management, "
            "real-time booking acceptance, open slot configuration, and an interactive digital consultation suite."
        ),
        (
            2, "System Architecture",
            "Explain the high-level architecture of your project.",
            "The project uses a decoupled two-tier architecture: (1) Frontend Client Layer built with HTML5, CSS3, and ES6+ JavaScript, running a lightweight client-side SPA routing engine; "
            "and (2) Backend-as-a-Service (BaaS) Layer powered by Supabase with a cloud-hosted PostgreSQL 15 relational database. The frontend communicates with Supabase via RESTful APIs "
            "and WebSocket channels, secured by JSON Web Tokens (JWT) and PostgreSQL Row Level Security (RLS) policies."
        ),
        (
            3, "Framework Choice",
            "Why did you choose Vanilla JavaScript instead of React, Angular, or Vue?",
            "Three main reasons: (1) <b>Performance & Zero Overhead:</b> Modern browsers natively support ES6+, Flexbox, and CSS Grid. Using Vanilla JS eliminates bundlers (Webpack/Vite) and bulky node_modules, resulting in lightning-fast initial load times (&lt;300ms). "
            "(2) <b>Fundamental DOM Mastery:</b> Demonstrates deep understanding of core browser APIs (`fetch`, `DOMParser`, `history.pushState`, event delegation) rather than relying on framework abstractions. "
            "(3) <b>Low Maintenance & Longevity:</b> Vanilla web standards do not suffer from breaking framework version updates or dependency vulnerabilities."
        ),
        (
            4, "Role Separation",
            "How does the system distinguish between a Pet Owner and a Veterinarian?",
            "The system uses role-based access control (RBAC). In the database, the `public.profiles` table contains a `role` column with a check constraint: `check (role in ('owner', 'vet'))`. "
            "Upon authentication, the user's JWT payload and profile role are retrieved. The UI adapts accordingly: Pet Owners access `overview.html`, `health-records.html`, and `reminders.html`, "
            "while Veterinarians access `vet-overview.html`, `vet-week-schedule.html`, `vet-requests-availability.html`, and `vet-consultation.html`."
        ),
        (
            5, "Database Choice",
            "Why did you choose PostgreSQL/Supabase over MongoDB/Firebase?",
            "Healthcare and clinical records are inherently relational. A pet belongs to an owner, appointments link a pet, owner, and veterinarian, and medical records reference appointments and pets. "
            "PostgreSQL guarantees ACID compliance, strict foreign key constraints (`ON DELETE CASCADE`), and prevents orphan records. Furthermore, Supabase provides Row Level Security (RLS) "
            "directly at the SQL engine level, which is much more secure and expressive than Firebase security rules or NoSQL collections."
        ),

        # --- Frontend & JavaScript Architecture ---
        (
            6, "Client-Side SPA Router",
            "How does your seamless client-side navigation work without a full page reload?",
            "In `script.js`, the `initSeamlessNavigation()` function attaches a delegated click listener to `.sidebar-link`. When clicked, it checks if the destination URL is an allowed workspace page. "
            "If so, it intercepts navigation with `e.preventDefault()`, fetches the HTML document using `fetch(href)`, parses the response using `new DOMParser().parseFromString(html, 'text/html')`, "
            "extracts the `.app-main` node, replaces `document.querySelector('.app-main').innerHTML`, updates the active sidebar class, updates `document.title`, calls `window.history.pushState()`, "
            "and invokes `hydrateWorkspaceData()`. A `popstate` event listener handles browser back/forward buttons."
        ),
        (
            7, "Data Hydration",
            "What is data hydration in your project and how does it work?",
            "Data hydration is the process of injecting live state into static HTML markup. In `script.js`, `hydrateWorkspaceData()` queries Supabase or local state for the active pet (e.g. Bruno), "
            "and updates DOM elements across pages—such as pet name, breed, weight, allergy alert pills, and appointment badge status. This ensures that when a user updates Bruno's weight in `pet-profile.html`, "
            "the updated value is immediately reflected when navigating to `health-records.html` or `overview.html` without requiring a full page refresh."
        ),
        (
            8, "Real-Time Search Implementation",
            "How is the search bar implemented in the Records section?",
            "The search bar (`#record-search-input`) listens for the native `input` event (`oninput='handleRecordSearch(this.value)'`). Each pet appointment div contains data attributes (`data-pet` and `data-owner`). "
            "The function normalizes the input query to lowercase and iterates through all small divs. If either `data-pet` or `data-owner` contains the query substring, `div.style.display = 'flex'`; otherwise, "
            "`div.style.display = 'none'`. A match counter tracks visible results; if zero items match, an informative `#no-patients-found` banner is displayed."
        ),
        (
            9, "Search Time Complexity",
            "What is the algorithmic time complexity of your search filter?",
            "The time complexity is <b>O(N × M)</b>, where <b>N</b> is the number of appointment cards and <b>M</b> is the average string length of the pet and owner names. "
            "Since today's appointments in a clinic typically range from 10 to 50 patients, the DOM traversal takes less than 1 millisecond, providing instantaneous 60fps search results without debouncing lag."
        ),
        (
            10, "Dynamic Prescription Builder",
            "How does the veterinarian dynamically add prescription medications in the consultation view?",
            "The consultation suite has an '+ Add medication' button wired to `addPrescriptionRow()`. When triggered, it creates a new table row (`document.createElement('tr')`) containing four input fields "
            "(Medicine Name, Dosage, Duration, Administration Instructions) and an action column with a delete button (`onclick='removePrescriptionRow(this)'`). "
            "When the record is saved, `saveConsultationRecord()` iterates through the table rows, packages the values into a structured JSON array, and updates the patient's record in memory and Supabase."
        ),
        (
            11, "Patient Record Detail Switching",
            "What happens when the vet clicks on a patient's small div in the Records section?",
            "The `selectPatientRecord(petKey)` function executes: (1) it removes the `.active` class from all small divs and adds it to the clicked div; (2) retrieves the pet's complete data object from `patientRecordsData[petKey]`; "
            "(3) updates left-column demographics (photo, name, breed, owner, weight, sex, allergies, and the chronological past medical history log); (4) updates right-column consultation fields (complaint, diagnosis, notes, follow-up); "
            "and (5) re-renders the prescription table and vaccination history. This gives the vet instant access to Bruno, Mishti, or Coco with zero latency."
        ),

        # --- CSS & Responsive Design ---
        (
            12, "CSS Grid vs Flexbox",
            "Where and why did you use CSS Grid vs Flexbox in this application?",
            "<b>CSS Grid</b> is used for two-dimensional page layouts and structural containers where both rows and columns need alignment—such as the workspace shell (`.app-layout: grid-template-columns: 220px 1fr`), "
            "the 2-column consultation layout (`.grid-profile-layout: grid-template-columns: 280px 1fr`), and the booking schedule grid (`.grid-booking-layout: grid-template-columns: 1fr 310px`).<br/>"
            "<b>Flexbox</b> is used for one-dimensional linear components—such as top navigation bars, sidebar links, button groups, badge rows, and metric summary strips."
        ),
        (
            13, "Responsive Design & Media Queries",
            "How did you make the application responsive across mobile and desktop devices?",
            "Through fluid layouts and CSS media queries at standard breakpoints (768px for tablets/mobile, 992px for desktop). On mobile screens: "
            "(1) `.app-layout` switches from a 2-column sidebar layout to a stacked layout with collapsible navigation; "
            "(2) `.pet-records-hero-layout` converts from a side-by-side split to a centered vertical card stack; "
            "(3) `.today-patients-grid` uses `grid-template-columns: repeat(auto-fit, minmax(290px, 1fr))` to automatically adapt card counts to available screen width."
        ),
        (
            14, "CSS Scroll Snapping",
            "Explain how the full-screen section scrolling works on the landing page.",
            "CSS Scroll Snap is configured on the root and section elements inside a `@media (min-width: 993px)` query: `html { scroll-snap-type: y mandatory; }` and `.snap-section { min-height: 100vh; scroll-snap-align: start; scroll-snap-stop: always; }`. "
            "When the user scrolls, the browser automatically animates and locks onto the next full viewport section. This creates an immersive presentation of the Hero, 3 Value Pillars, Care Team, FAQ, and CTA without third-party JavaScript libraries like FullPage.js."
        ),
        (
            15, "Hero Photo Crop Problem & Solution",
            "What visual issue occurred with pet photos in Health Records and how was it resolved?",
            "Originally, the pet card in `health-records.html` used a full-width 150px banner that severely letterbox-cropped Bruno's portrait, chopping off his ears, eyes, and body. "
            "We resolved this by redesigning the card into a side-by-side split layout (`.pet-records-hero-layout`). On the left side, we placed Bruno's photo in a clean 1:1 square container "
            "(`190px × 190px; border-radius: 6px; object-fit: cover;`), ensuring his full face and expression are visible without distortion. On the right side, we organized a structured square of info with bold typography and alert pills."
        ),

        # --- Database & SQL ---
        (
            16, "Foreign Key Constraints & Cascades",
            "What is the significance of `ON DELETE CASCADE` in your database schema?",
            "In `schema.sql`, child tables such as `pets`, `appointments`, and `reminders` reference `profiles.id` with `ON DELETE CASCADE`. "
            "This maintains referential integrity: if a pet owner deletes their account, all their associated pets, appointments, and reminders are automatically purged by PostgreSQL. "
            "This prevents orphan records from cluttering the database and protects privacy regulations (e.g., GDPR 'Right to be Forgotten')."
        ),
        (
            17, "JSONB Columns vs Relational Tables",
            "Why did you use `JSONB` for prescriptions and services instead of separate tables?",
            "PostgreSQL's binary JSON (`JSONB`) provides hybrid flexibility. Prescriptions in a clinical consultation often vary wildly (drops, tablets, creams, liquid suspensions with arbitrary instructions). "
            "Storing prescriptions as a JSONB array inside `medical_records` allows atomic document reads and writes in a single query without complex multi-table joins, while still permitting GIN indexing "
            "and JSON querying in PostgreSQL when needed."
        ),
        (
            18, "Database Triggers",
            "How are user profiles automatically generated when a user signs up via Supabase Auth?",
            "In Supabase, user signups occur in the private `auth.users` table. In `schema.sql`, we define a PostgreSQL trigger function `public.handle_new_user()` that intercepts the `AFTER INSERT ON auth.users` event "
            "and automatically inserts a corresponding row into `public.profiles` using the new user's UUID, email, and metadata (`first_name`, `last_name`, `role`). This guarantees profile synchronization."
        ),
        (
            19, "Appointment State Machine",
            "What states can an appointment have, and how does state transition occur?",
            "An appointment transitions through four states enforced by a SQL check constraint: `check (status in ('awaiting_acceptance', 'confirmed', 'completed', 'cancelled'))`. "
            "(1) When a pet owner books, it enters `awaiting_acceptance`; (2) when the vet clicks 'Accept' in Request & Availability, `acceptRequest()` updates the status to `confirmed`; "
            "(3) after the consultation, the vet records findings and marks it `completed`; (4) if either party declines, it is updated to `cancelled`."
        ),

        # --- Security & Authentication ---
        (
            20, "Row Level Security (RLS)",
            "What is Row Level Security (RLS) and why is it crucial in Paw Care?",
            "Row Level Security is an enterprise security feature in PostgreSQL that evaluates security rules at the database engine level for every query. "
            "In traditional backends, developers must remember to write `WHERE user_id = current_user` in every endpoint; a single forgotten check causes data leakage. "
            "With RLS enabled, PostgreSQL automatically restricts queries based on `auth.uid() = owner_id`. Pet owners can strictly view and edit only their own pets and appointments. "
            "Veterinarians have explicit clinical policies granting them access to scheduled patient records."
        ),
        (
            21, "JWT Authentication Flow",
            "Explain the authentication lifecycle when a user logs in.",
            "(1) The user inputs email and password on `signin.html`; (2) `window.PawCareSupabase.auth.signIn(email, password)` sends credentials to Supabase Auth; "
            "(3) Supabase validates password hash via bcrypt and returns a signed JSON Web Token (JWT); (4) the JWT is stored securely in browser local storage; "
            "(5) all subsequent database requests attach this JWT in the `Authorization: Bearer &lt;token&gt;` header; (6) PostgreSQL decodes the JWT to identify `auth.uid()` and enforce RLS."
        ),
        (
            22, "Cross-Site Scripting (XSS) Prevention",
            "How does your application defend against Cross-Site Scripting (XSS)?",
            "User inputs (search queries, diagnosis notes, pet names) are sanitized and escaped before DOM rendering. When dynamic text is inserted, we prefer `.textContent` over `.innerHTML` "
            "to prevent injection of malicious `&lt;script&gt;` tags. Textareas and inputs bind to standard change handlers, and inputs rendered into table rows are set through attributes rather than unescaped strings."
        ),

        # --- Practical Troubleshooting & Git ---
        (
            23, "Git PATH Corruption Bug & Resolution",
            "What technical challenge did you face with Git Credential Manager on Windows and how was it solved?",
            "When running `git push`, Git Credential Manager crashed with `System.ArgumentException: Illegal characters in path` and `System.DllNotFoundException: Unable to load DLL 'shell32.dll'`. "
            "Investigation revealed that the system environment `PATH` variable contained an unescaped quote (`\";C:\\Program Files\\nodejs\";`). When .NET's `Path.CheckInvalidPathChars()` ran during GCM startup, "
            "the quote caused an unhandled crash. We resolved this by bypassing the buggy .NET GCM and invoking Git's native C Windows Credential helper (`git -c credential.helper=wincred push origin main`), "
            "which directly accessed Windows Credential Manager and completed the push successfully."
        ),
        (
            24, "Git Merge Conflict Resolution",
            "How did you resolve the merge conflict in `style.css` during `git pull --rebase`?",
            "When pulling remote commit `583bc6f`, Git flagged a merge conflict in `style.css` because both the remote commit (Supabase modal styles) and local commit (weekly schedule & records styles) modified the end of the stylesheet. "
            "We opened `style.css`, inspected the conflict markers (`&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD`, `=======`, `&gt;&gt;&gt;&gt;&gt;&gt;&gt; 3cd787c`), preserved all remote status styles as well as all our new schedule, small-div, and prescription styles, "
            "removed the conflict delimiter lines, ran `git add style.css`, and executed `git rebase --continue` to produce a clean linear commit history."
        ),

        # --- Future Scope & Industry Readiness ---
        (
            25, "Teleconsultation Integration",
            "How would you integrate real-time video teleconsultation into Paw Care?",
            "By implementing WebRTC (Web Real-Time Communication) using peer-to-peer signaling via Supabase Realtime Channels. When an appointment begins, a temporary video room token "
            "would be generated. Both pet owner and veterinarian can initiate a secure audio/video stream directly in the browser using the `navigator.mediaDevices.getUserMedia()` API without external plugins."
        ),
        (
            26, "IoT & Smart Collar Integration",
            "How could IoT pet collars and microchip scanners integrate with this platform?",
            "Smart pet collars tracking temperature, pulse, and GPS location can push telemetry data via an MQTT or REST webhook to a dedicated Supabase Edge Function (`/api/v1/telemetry`). "
            "The function validates the device token and inserts vitals into a `pet_vitals` time-series table. If anomalous vitals are detected (e.g. fever or irregular heart rate), "
            "an automated emergency notification is triggered to the vet."
        ),
        (
            27, "Automated WhatsApp / SMS Reminders",
            "How would you automate medication and booster reminders for pet owners?",
            "By deploying a scheduled Supabase Cron Job (`pg_cron`) that runs hourly, checks the `reminders` and `notification_preferences` tables for reminders due within the next 24 hours, "
            "and triggers an Edge Function connecting to the Twilio or WhatsApp Business API to dispatch automated personalized SMS/WhatsApp reminders directly to the pet owner's registered phone number."
        ),
        (
            28, "Payment Gateway Integration",
            "How would you handle billing and consultation payments?",
            "By integrating Razorpay or Stripe. When the vet submits the consultation record and prescription, a billing invoice is calculated. The frontend initializes the payment checkout modal, "
            "the user pays via UPI/Card, and a webhook verifies the cryptographic signature before marking the appointment `completed` and generating a downloadable GST tax invoice."
        )
    ]

    for q_item in viva_questions:
        q_num, category, question, answer = q_item
        story.append(KeepTogether([
            make_qa_block(q_num, category, question, answer, styles),
            Spacer(1, 6)
        ]))

    # Concluding Signature
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BORDER, spaceAfter=8))
    story.append(Paragraph(
        "<b>Paw Care Technical Documentation & Academic Viva Preparation Guide</b><br/>"
        "Engineered with semantic web standards, PostgreSQL database integrity, and high-performance Vanilla JavaScript. "
        "Verified for academic project defense, code review, and production deployment.",
        ParagraphStyle('FooterNote', parent=styles['Body'], fontName='Helvetica-Oblique', fontSize=8, leading=11, textColor=C_MUTED, alignment=1)
    ))

    # Build PDF with Numbered Canvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] PDF generated successfully: {filename}")

if __name__ == "__main__":
    out_file = "Paw_Care_Technical_Report_and_Viva_Guide.pdf"
    if len(sys.argv) > 1:
        out_file = sys.argv[1]
    build_pdf(out_file)
