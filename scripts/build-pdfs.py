#!/usr/bin/env python3
"""Builds the three price-guide PDFs from the website's content file, so the PDFs and the site never drift.

    python3 scripts/build-pdfs.py            # English and Spanish, into "Masion Eniola/"
    python3 scripts/build-pdfs.py --lang en  # one language

Reads site/src/data/content.js through Node (the same data the site renders), then lays each service out
with ReportLab: brand header, pricing at a glance, one block per level, how it works, payment and terms.
Requires: Node 18+, `pip3 install reportlab`, and the fonts in site/public/fonts + scripts/pdf-fonts.
"""
import json, subprocess, sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Frame, KeepTogether, PageTemplate, Paragraph, Spacer, Table, TableStyle)

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / 'site' / 'public' / 'fonts'
OUT = ROOT / 'Masion Eniola'
LANGS = [a.split('=')[1] for a in sys.argv if a.startswith('--lang=')] or (['en', 'es'] if '--lang' not in sys.argv else [sys.argv[sys.argv.index('--lang') + 1]])

# ---- content, straight from the site ----
data = json.loads(subprocess.check_output(['node', '--input-type=module', '-e',
    f"import('{(ROOT / 'site/src/data/content.js').as_uri()}').then(m => console.log(JSON.stringify(m)))"]))
SERVICES, PDF, CONTACT = data['SERVICES'], data['PDF_COPY'], data['CONTACT']
FILES = {'events': 'Weddings-Events-Proposals_Price-Breakdown', 'venues': 'Venue-Sourcing_Price-Breakdown', 'travel': 'Independent-Travel-Planning_Price-Breakdown'}

# ---- brand ----
NIGHT, OCEAN, CORAL, GOLD_INK = colors.HexColor('#03131F'), colors.HexColor('#063A5C'), colors.HexColor('#C84A16'), colors.HexColor('#8A5E0A')
CREAM, CREAM2, LINE, TEXT, MUTED, MOON = (colors.HexColor(c) for c in ('#FFFDF4', '#FBF5E6', '#E9DFCC', '#2B2B2B', '#5E5A52', '#F6F1E4'))
for name, file in [('Serif', 'DMSerifDisplay-Regular.ttf'), ('SerifI', 'DMSerifDisplay-Italic.ttf'), ('Sans', 'Poppins-Regular.ttf'), ('SansM', 'Poppins-Medium.ttf'), ('SansB', 'Poppins-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS / file)))
pdfmetrics.registerFont(TTFont('Brand', str(ROOT / 'scripts' / 'pdf-fonts' / 'CormorantGaramond.ttf')))

def esc(s): return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
def money(n): return f'€{n:,.0f}'
def fx(n): return f'£{round(n * 0.86 / 5) * 5:,.0f} · ${round(n * 1.09 / 5) * 5:,.0f}'

W, H = A4
M = 16 * mm
S = {
    'kicker': ParagraphStyle('k', fontName='SansM', fontSize=7.4, leading=10, textColor=CORAL, spaceAfter=4),
    'h1': ParagraphStyle('h1', fontName='Serif', fontSize=27, leading=31, textColor=OCEAN),
    'h1i': ParagraphStyle('h1i', fontName='SerifI', fontSize=22, leading=27, textColor=CORAL, spaceAfter=9),
    'body': ParagraphStyle('b', fontName='Sans', fontSize=8.6, leading=12.6, textColor=TEXT),
    'small': ParagraphStyle('s', fontName='Sans', fontSize=7.2, leading=10.2, textColor=MUTED),
    'h2': ParagraphStyle('h2', fontName='Serif', fontSize=15, leading=19, textColor=OCEAN, spaceBefore=12, spaceAfter=6),
    'th': ParagraphStyle('th', fontName='SansM', fontSize=6.6, leading=9, textColor=MOON),
    'td': ParagraphStyle('td', fontName='Sans', fontSize=7.9, leading=10.8, textColor=TEXT),
    'tdb': ParagraphStyle('tdb', fontName='SansB', fontSize=7.9, leading=10.8, textColor=TEXT),
    'price': ParagraphStyle('p', fontName='Serif', fontSize=13, leading=15, textColor=CORAL),
    'fx': ParagraphStyle('fx', fontName='Sans', fontSize=7.2, leading=10, textColor=MUTED),
    'tnum': ParagraphStyle('tn', fontName='Serif', fontSize=22, leading=24, textColor=CORAL),
    'tname': ParagraphStyle('tname', fontName='Serif', fontSize=17, leading=20, textColor=OCEAN),
    'tsub': ParagraphStyle('tsub', fontName='SansM', fontSize=6.8, leading=9, textColor=CORAL),
    'pfrom': ParagraphStyle('pf', fontName='SansM', fontSize=6.4, leading=8, textColor=MOON, alignment=TA_RIGHT),
    'pbig': ParagraphStyle('pb', fontName='Serif', fontSize=17, leading=19, textColor=colors.white, alignment=TA_RIGHT),
    'pfx': ParagraphStyle('pfx', fontName='Sans', fontSize=6.8, leading=9, textColor=MOON, alignment=TA_RIGHT),
    'lab': ParagraphStyle('lab', fontName='SansB', fontSize=6.8, leading=9, textColor=CORAL, spaceBefore=6, spaceAfter=2),
    'inc': ParagraphStyle('inc', fontName='SansB', fontSize=7.9, leading=10.8, textColor=TEXT),
    'fact': ParagraphStyle('f', fontName='SansB', fontSize=7.4, leading=10, textColor=TEXT),
    'factv': ParagraphStyle('fv', fontName='Sans', fontSize=7.4, leading=10, textColor=MUTED),
    'addon': ParagraphStyle('a', fontName='Sans', fontSize=7.9, leading=10.8, textColor=TEXT),
    'addonp': ParagraphStyle('ap', fontName='SansB', fontSize=7.9, leading=10.8, textColor=TEXT, alignment=TA_RIGHT),
    'stepn': ParagraphStyle('sn', fontName='Serif', fontSize=15, leading=16, textColor=CORAL),
    'bullet': ParagraphStyle('bu', fontName='Sans', fontSize=8.2, leading=11.6, textColor=TEXT, leftIndent=9, bulletIndent=0, spaceAfter=2.5),
}

def t(o, lang):
    if isinstance(o, dict): return o.get(lang) or o.get('en') or ''
    return o

def header_footer(lang, kicker):
    def draw(c, doc):
        c.saveState()
        c.setFillColor(NIGHT); c.rect(0, H - 6 * mm, W, 6 * mm, stroke=0, fill=1)
        c.rect(0, 0, W, 12 * mm, stroke=0, fill=1)
        # brand lockup, top right
        c.setFillColor(OCEAN); c.setFont('Brand', 10.5)
        c.drawRightString(W - M, H - 14.5 * mm, PDF['brand'], charSpace=2.4)
        c.setFillColor(CORAL); c.setFont('SansM', 5.4)
        c.drawRightString(W - M, H - 18 * mm, t(PDF['tagline'], lang).upper(), charSpace=0.9)
        # footer
        c.setFillColor(MOON); c.setFont('Sans', 7)
        c.drawString(M, 4.6 * mm, f"WhatsApp {CONTACT['waLabel']}  ·  {CONTACT['email']}")
        c.drawRightString(W - M, 4.6 * mm, f"Maison Eniola  ·  {t(PDF['langs'], lang)}  ·  {t(PDF['page'], lang)} {doc.page}")
        c.restoreState()
    return draw

def addon_price(a, lang):
    if a['type'] == 'pct': return f"+{a['pct']}%"
    if a['type'] == 'ref': return t(PDF['seeVenues'], lang)
    s = money(a['price'])
    if a.get('unit'): s += ' ' + t(a['unit'], lang)
    if a.get('travel'): s += ' ' + t(PDF['travelAtCost'], lang)
    return s

def rule_table(rows, widths, bold_first=True):
    tbl = Table(rows, colWidths=widths)
    tbl.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LINEBELOW', (0, 0), (-1, -1), 0.4, LINE),
                             ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4), ('LEFTPADDING', (0, 0), (-1, -1), 2), ('RIGHTPADDING', (0, 0), (-1, -1), 2)]))
    return tbl

def tier_block(svc, tr, i, lang):
    cw = W - 2 * M
    head = Table([[Paragraph(f'0{i + 1}', S['tnum']),
                   [Paragraph(esc(tr['name']), S['tname']), Paragraph(esc(t(tr['sub'], lang)).upper(), S['tsub'])],
                   [Paragraph(t(PDF['cols']['from'], lang).upper(), S['pfrom']), Paragraph(money(tr['price']) + ('+' if tr.get('plus') else ''), S['pbig']), Paragraph(fx(tr['price']), S['pfx'])]]],
                 colWidths=[14 * mm, cw - 14 * mm - 42 * mm, 42 * mm])
    head.setStyle(TableStyle([('BACKGROUND', (0, 0), (1, 0), CREAM2), ('BACKGROUND', (2, 0), (2, 0), CORAL), ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                              ('TOPPADDING', (0, 0), (-1, -1), 7), ('BOTTOMPADDING', (0, 0), (-1, -1), 7), ('LEFTPADDING', (0, 0), (-1, -1), 8), ('RIGHTPADDING', (0, 0), (-1, -1), 8)]))
    inc_rows = [[Paragraph(t(PDF['included'], lang).upper(), S['lab']), Paragraph(t(PDF['means'], lang).upper(), S['lab'])]]
    for r in tr['rows']:
        # ZapfDingbats "3" is a check mark; Poppins has no ✓ glyph.
        inc_rows.append([Paragraph('<font name="ZapfDingbats" color="#C84A16" size="7">3</font>  ' + esc(t(r[0], lang)), S['inc']), Paragraph(esc(t(r[1], lang)), S['td'])])
    inc = rule_table(inc_rows, [cw * 0.36, cw * 0.64])
    facts = Table([[[Paragraph(t(PDF['scope'], lang), S['fact']), Paragraph(esc(t(tr['scope'], lang)), S['factv'])],
                    [Paragraph(t(PDF['turnaround'], lang), S['fact']), Paragraph(esc(t(tr['turn'], lang)), S['factv'])],
                    [Paragraph(t(PDF['work'], lang), S['fact']), Paragraph(esc(t(tr['work'], lang)), S['factv'])]]], colWidths=[cw * 0.42, cw * 0.29, cw * 0.29])
    facts.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), CREAM2), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('TOPPADDING', (0, 0), (-1, -1), 7), ('BOTTOMPADDING', (0, 0), (-1, -1), 7), ('LEFTPADDING', (0, 0), (-1, -1), 8)]))
    add_rows = [[Paragraph(esc(t(a['label'], lang)), S['addon']), Paragraph(esc(addon_price(a, lang)), S['addonp'])] for a in tr['addons']]
    addons = [Paragraph(t(PDF['addons'], lang).upper(), S['lab']), rule_table(add_rows, [cw * 0.7, cw * 0.3])] if add_rows else []
    note = [Spacer(1, 4), Paragraph(esc(t(tr['note'], lang)), S['small'])] if tr.get('note') else []
    return [KeepTogether([head, Spacer(1, 4), inc]), Spacer(1, 6), KeepTogether([facts, *addons, *note]), Spacer(1, 14)]

def build(svc, lang):
    key = svc['key']; P = PDF[key]; cw = W - 2 * M
    out = OUT / f"{FILES[key]}{'' if lang == 'en' else '_ES'}.pdf"
    doc = BaseDocTemplate(str(out), pagesize=A4, leftMargin=M, rightMargin=M, topMargin=24 * mm, bottomMargin=18 * mm,
                          title=f"{t(svc['tab'], lang)} · Maison Eniola", author='Maison Eniola', subject=t(PDF['breakdown'], lang))
    doc.addPageTemplates([PageTemplate(frames=[Frame(M, 18 * mm, cw, H - 42 * mm, id='f', leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)], onPage=header_footer(lang, P['kicker']))])
    story = [Paragraph((t(P['kicker'], lang) + ' — ' + t(PDF['breakdown'], lang)).upper(), S['kicker']),
             Paragraph(esc(t(P['title'], lang)[0]), S['h1']), Paragraph(esc(t(P['title'], lang)[1]), S['h1i']),
             Paragraph(esc(t(P['intro'], lang)), S['body']), Paragraph(t(PDF['glance'], lang), S['h2'])]
    C = PDF['cols']
    rows = [[Paragraph(t(C['tier'], lang).upper(), S['th']), Paragraph(t(C['best'], lang).upper(), S['th']), Paragraph(t(C['scope'], lang).upper(), S['th']), Paragraph(t(C['from'], lang).upper(), S['th']), Paragraph(C['fx'], S['th'])]]
    for i, tr in enumerate(svc['tiers']):
        rows.append([Paragraph(f"<font color='#C84A16'>0{i + 1}</font> {esc(tr['name'])}", S['tdb']), Paragraph(esc(t(tr['best'], lang)), S['td']),
                     Paragraph(esc(t(P['glanceScope'], lang)[i]), S['td']), Paragraph(money(tr['price']) + ('+' if tr.get('plus') else ''), S['price']), Paragraph(fx(tr['price']), S['fx'])])
    glance = Table(rows, colWidths=[cw * 0.2, cw * 0.26, cw * 0.27, cw * 0.14, cw * 0.13])
    glance.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), OCEAN), ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, CREAM2]), ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                                ('TOPPADDING', (0, 0), (-1, -1), 6), ('BOTTOMPADDING', (0, 0), (-1, -1), 6), ('LEFTPADDING', (0, 0), (-1, -1), 6), ('LINEBELOW', (0, 1), (-1, -1), 0.4, LINE)]))
    story += [glance, Spacer(1, 6), Paragraph(esc(t(P['glanceNote'], lang)), S['small']), Spacer(1, 14)]
    for i, tr in enumerate(svc['tiers']): story += tier_block(svc, tr, i, lang)
    story.append(Paragraph(t(PDF['how'], lang), S['h2']))
    steps = [[Paragraph(str(i + 1), S['stepn']), [Paragraph(esc(t(st[0], lang)), S['inc']), Paragraph(esc(t(st[1], lang)), S['td'])]] for i, st in enumerate(svc['steps'])]
    stp = Table(steps, colWidths=[10 * mm, cw - 10 * mm]); stp.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('BOTTOMPADDING', (0, 0), (-1, -1), 6), ('LEFTPADDING', (0, 0), (-1, -1), 0)]))
    story.append(stp)
    for group in svc['terms']:
        block = [Paragraph(esc(t(group[0], lang)), S['h2'])] + [Paragraph(esc(t(item, lang)), S['bullet'], bulletText='•') for item in group[1]]
        story.append(KeepTogether(block))
    story += [Spacer(1, 8), Paragraph(esc(t(data['UI']['priceValidity'], lang) + ' ' + t(data['UI']['fxNote'], lang)), S['small'])]
    doc.build(story)
    return out

OUT.mkdir(exist_ok=True)
for lang in LANGS:
    for svc in SERVICES:
        print('  built', build(svc, lang).relative_to(ROOT))
