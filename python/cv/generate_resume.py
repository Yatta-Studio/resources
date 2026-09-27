#!/usrbin/env python3
"""
Generate a text-based multi-page resume PDF with adjusted sidebar spacing
to prevent overlap between header contact information and lower sections.
"""

import sys
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    BaseDocTemplate,
    Paragraph,
    Spacer,
    Frame,
    PageTemplate,
    FrameBreak,
    NextPageTemplate,
    KeepTogether,
    HRFlowable,
    Table,
    TableStyle,
    Image,
)
from resume import RESUME

# ---------------------------------------------------------------------------
# LAYOUT CONSTANTS
# ---------------------------------------------------------------------------
PAGE_W, PAGE_H = letter
SIDEBAR_W = 190
SIDEBAR_TOP_H = 210
MARGIN = 20

SIDEBAR_X = MARGIN
SIDEBAR_TEXT_W = SIDEBAR_W - 2 * MARGIN

# Offset MAIN_X by 0.5pt to prevent sub-pixel anti-aliasing bleed into sidebar
BLEED_OFFSET = 0.5
MAIN_X = SIDEBAR_W + BLEED_OFFSET
MAIN_FRAME_W = PAGE_W - MAIN_X
CONTENT_W = MAIN_FRAME_W - (2 * MARGIN)

# Colors
TOP_BG = (0.145, 0.404, 0.549)  # Upper sidebar background
BOTTOM_BG = (0.105, 0.290, 0.392)  # Lower sidebar background
SUMMARY_BG = HexColor("#f2f7fa")  # Custom light background for summary block
ACCENT_COLOR = HexColor("#183a4a")
LINK_COLOR = HexColor("#1a6b8c")
TEXT_DARK = HexColor("#222222")
GRAY_TEXT = HexColor("#555555")

# ---------------------------------------------------------------------------
# STYLES
# ---------------------------------------------------------------------------
styles = {
    "sidebar_name": ParagraphStyle(
        "sidebar_name",
        fontName="Helvetica-Bold",
        fontSize=15,
        textColor="white",
        leading=18,
    ),
    "sidebar_title": ParagraphStyle(
        "sidebar_title",
        fontName="Helvetica",
        fontSize=9.5,
        textColor="white",
        leading=12,
    ),
    "sidebar_h2": ParagraphStyle(
        "sidebar_h2",
        fontName="Helvetica-Bold",
        fontSize=11,
        textColor="white",
        leading=13,
        spaceBefore=6,
        spaceAfter=3,
    ),
    "sidebar_body": ParagraphStyle(
        "sidebar_body",
        fontName="Helvetica",
        fontSize=8.5,
        textColor="white",
        leading=11,
    ),
    "sidebar_bold": ParagraphStyle(
        "sidebar_bold",
        fontName="Helvetica-Bold",
        fontSize=8.5,
        textColor="white",
        leading=11,
    ),
    "summary": ParagraphStyle(
        "summary",
        fontName="Helvetica",
        fontSize=9.5,
        textColor=TEXT_DARK,
        leading=13.5,
    ),
    "h2": ParagraphStyle(
        "h2",
        fontName="Helvetica-Bold",
        fontSize=12.5,
        textColor=ACCENT_COLOR,
        leading=15,
        spaceBefore=10,
        spaceAfter=5,
        leftIndent=MARGIN,
        rightIndent=MARGIN,
    ),
    "h3": ParagraphStyle(
        "h3",
        fontName="Helvetica-Bold",
        fontSize=10,
        textColor=TEXT_DARK,
        leading=12,
    ),
    "h3_right": ParagraphStyle(
        "h3_right",
        fontName="Helvetica-Bold",
        fontSize=9.5,
        textColor=TEXT_DARK,
        leading=12,
        alignment=2,
    ),
    "h3_sub": ParagraphStyle(
        "h3_sub",
        fontName="Helvetica",
        fontSize=9,
        textColor=GRAY_TEXT,
        leading=11,
    ),
    "h3_sub_right": ParagraphStyle(
        "h3_sub_right",
        fontName="Helvetica",
        fontSize=9,
        textColor=GRAY_TEXT,
        leading=11,
        alignment=2,
    ),
    "link": ParagraphStyle(
        "link",
        fontName="Helvetica",
        fontSize=8.5,
        textColor=LINK_COLOR,
        leading=11,
        leftIndent=MARGIN,
        rightIndent=MARGIN,
    ),
    "bullet": ParagraphStyle(
        "bullet",
        fontName="Helvetica",
        fontSize=9,
        textColor=TEXT_DARK,
        leading=12,
        leftIndent=MARGIN + 10,
        rightIndent=MARGIN,
    ),
}


def draw_page_background(canvas_obj, doc):
    """Draws background accents for the sidebar on canvas."""
    canvas_obj.saveState()

    # Full-height sidebar background
    canvas_obj.setFillColorRGB(*BOTTOM_BG)
    canvas_obj.rect(0, 0, SIDEBAR_W, PAGE_H, fill=1, stroke=0)

    if doc.page == 1:
        # Upper accent block expanded to 270pt to cleanly cover header & contact block
        canvas_obj.setFillColorRGB(*TOP_BG)
        canvas_obj.rect(0, PAGE_H - SIDEBAR_TOP_H, SIDEBAR_W, SIDEBAR_TOP_H, fill=1, stroke=0)

    canvas_obj.restoreState()


def build_pdf(output_path, photo_path=None):
    doc = BaseDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=0,
        rightMargin=0,
        topMargin=0,
        bottomMargin=0,
    )

    # Sidebar Frame (Left)
    sidebar_frame = Frame(
        SIDEBAR_X,
        MARGIN,
        SIDEBAR_TEXT_W,
        PAGE_H - (2 * MARGIN),
        id="sidebar_frame",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )

    # 2. Main Frame for PAGE 1 (topPadding=0 allows full-bleed summary)
    first_main_frame = Frame(
        MAIN_X,
        MARGIN,
        MAIN_FRAME_W,
        PAGE_H - MARGIN,
        id="first_main_frame",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )

    # 3. Main Frame for PAGE 2+ (topPadding adds space at the top of subsequent pages)
    later_main_frame = Frame(
        MAIN_X,
        MARGIN,
        MAIN_FRAME_W,
        PAGE_H - MARGIN,
        id="later_main_frame",
        leftPadding=0,
        rightPadding=0,
        topPadding=MARGIN,  # <--- Adjust this value (e.g., MARGIN or 20) for top padding
        bottomPadding=0,
    )

    # Assign respective frames to page templates
    first_page_template = PageTemplate(
        id="FirstPage",
        frames=[sidebar_frame, first_main_frame],
        onPage=draw_page_background,
    )

    later_page_template = PageTemplate(
        id="LaterPages",
        frames=[later_main_frame],  # <--- Uses the padded frame
        onPage=draw_page_background,
    )

    doc.addPageTemplates([first_page_template, later_page_template])

    story = []
    story.append(NextPageTemplate("LaterPages"))

    # =======================================================================
    # 1. SIDEBAR CONTENT
    # =======================================================================
    name_title_block = [
        Paragraph(RESUME["name"], styles["sidebar_name"]),
        Spacer(1, 2),
        Paragraph(RESUME["title"], styles["sidebar_title"]),
    ]

    header_height = 32

    if photo_path and os.path.exists(photo_path):
        profile_img = Image(photo_path, width=header_height, height=header_height)
        header_table = Table(
            [[profile_img, name_title_block]],
            colWidths=[header_height + 8, SIDEBAR_TEXT_W - (header_height + 8)],
        )
        header_table.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                ]
            )
        )
        story.append(header_table)
    else:
        story.extend(name_title_block)

    # Tightened vertical spacing
    story.append(Spacer(1, 10))

    # Contact Information
    for line in RESUME["contact"]:
        story.append(Paragraph(line, styles["sidebar_body"]))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 6))

    # Profiles
    if "profiles" in RESUME and RESUME["profiles"]:
        story.append(Paragraph("Profiles", styles["sidebar_h2"]))
        story.append(
            HRFlowable(width="100%", thickness=0.6, color="white", spaceAfter=4)
        )
        for line in RESUME["profiles"]:
            story.append(Paragraph(line, styles["sidebar_body"]))
            story.append(Spacer(1, 2))
        story.append(Spacer(1, 22))

    # Skills Section (starts cleanly in lower sidebar area)
    if "skills" in RESUME and RESUME["skills"]:
        story.append(Paragraph("Skills", styles["sidebar_h2"]))
        story.append(
            HRFlowable(width="100%", thickness=0.6, color="white", spaceAfter=4)
        )
        for name, level, items in RESUME["skills"]:
            story.append(Paragraph(name, styles["sidebar_bold"]))
            story.append(Paragraph(f"<i>{level}</i>", styles["sidebar_body"]))
            story.append(Paragraph(items, styles["sidebar_body"]))
            story.append(Spacer(1, 10))

    # Certifications
    if "certifications" in RESUME and RESUME["certifications"]:
        story.append(Paragraph("Certifications", styles["sidebar_h2"]))
        story.append(
            HRFlowable(width="100%", thickness=0.6, color="white", spaceAfter=4)
        )
        for cert, issuer, year in RESUME["certifications"]:
            story.append(Paragraph(cert, styles["sidebar_bold"]))
            story.append(Paragraph(issuer, styles["sidebar_body"]))
            story.append(Paragraph(str(year), styles["sidebar_body"]))
            story.append(Spacer(1, 4))

    # References
    if "references" in RESUME and RESUME["references"]:
        story.append(Spacer(1, 30))
        story.append(Paragraph("References", styles["sidebar_h2"]))
        story.append(
            HRFlowable(width="100%", thickness=0.6, color="white", spaceAfter=4)
        )
        for ref in RESUME["references"]:
            story.append(Paragraph(ref["name"], styles["sidebar_bold"]))
            if ref.get("title"):
                story.append(Paragraph(ref["title"], styles["sidebar_body"]))
            if ref.get("email"):
                story.append(Paragraph(ref["email"], styles["sidebar_body"]))
            story.append(Spacer(1, 8))

    story.append(FrameBreak())

    # =======================================================================
    # 2. MAIN COLUMN CONTENT
    # =======================================================================

    # Summary Box
    if "summary" in RESUME and RESUME["summary"]:
        summary_para = Paragraph(RESUME["summary"], styles["summary"])
        summary_box = Table([[summary_para]], colWidths=[MAIN_FRAME_W], hAlign="LEFT")
        summary_box.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), SUMMARY_BG),
                    ("TOPPADDING", (0, 0), (-1, -1), MARGIN + 8),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
                    ("LEFTPADDING", (0, 0), (-1, -1), MARGIN - BLEED_OFFSET),
                    ("RIGHTPADDING", (0, 0), (-1, -1), MARGIN),
                ]
            )
        )
        story.append(summary_box)
        story.append(Spacer(1, 10))

    # Experience
    if "experience" in RESUME and RESUME["experience"]:
        story.append(Paragraph("Experience", styles["h2"]))
        story.append(
            HRFlowable(
                width=CONTENT_W,
                thickness=1,
                color=ACCENT_COLOR,
                spaceAfter=8,
                hAlign="CENTER",
            )
        )

        for job in RESUME["experience"]:
            job_elements = []

            left_col = [
                Paragraph(f'<b>{job["company"]}</b>', styles["h3"]),
                Paragraph(job["role"], styles["h3_sub"]),
            ]
            right_col = [
                Paragraph(job.get("dates", ""), styles["h3_right"]),
                Paragraph(job.get("location", ""), styles["h3_sub_right"]),
            ]

            header_table = Table(
                [[left_col, right_col]],
                colWidths=[CONTENT_W * 0.65, CONTENT_W * 0.35],
                hAlign="CENTER",
            )
            header_table.setStyle(
                TableStyle(
                    [
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 0),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                        ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ]
                )
            )
            job_elements.append(header_table)

            if "link" in job and job["link"]:
                job_elements.append(Paragraph(job["link"], styles["link"]))

            job_elements.append(Spacer(1, 3))

            for b in job.get("bullets", []):
                job_elements.append(
                    Paragraph(f"&bull;&nbsp;&nbsp;{b}", styles["bullet"])
                )
                job_elements.append(Spacer(1, 2))

            job_elements.append(Spacer(1, 8))

            story.append(KeepTogether(job_elements))

    # Education
    if "education" in RESUME and RESUME["education"]:
        edu_elements = [
            Paragraph("Education", styles["h2"]),
            HRFlowable(
                width=CONTENT_W,
                thickness=1,
                color=ACCENT_COLOR,
                spaceAfter=8,
                hAlign="CENTER",
            ),
        ]

        for edu in RESUME["education"]:
            left_col = [
                Paragraph(f'<b>{edu["school"]}</b>', styles["h3"]),
                Paragraph(edu["degree"], styles["h3_sub"]),
            ]
            right_col = [
                Paragraph(edu.get("dates", ""), styles["h3_right"]),
                Paragraph(edu.get("location", ""), styles["h3_sub_right"]),
            ]

            edu_table = Table(
                [[left_col, right_col]],
                colWidths=[CONTENT_W * 0.7, CONTENT_W * 0.3],
                hAlign="CENTER",
            )
            edu_table.setStyle(
                TableStyle(
                    [
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 0),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                        ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ]
                )
            )
            edu_elements.append(edu_table)
            edu_elements.append(Spacer(1, 6))

        story.append(KeepTogether(edu_elements))

    doc.build(story)


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "resume.pdf"
    photo = sys.argv[2] if len(sys.argv) > 2 else None
    build_pdf(out, photo)
    print(f"Saved: {out}")
