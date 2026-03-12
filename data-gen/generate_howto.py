import os

from fpdf import FPDF

output_dir = "../public/how-to"
os.makedirs(output_dir, exist_ok=True)


class HowToPDF(FPDF):
    def __init__(self, title):
        super().__init__()
        self._doc_title = title

    def header(self):
        self.set_font("Courier", "B", 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 6, "Grand Duchy of Eldoria -- Arcane Registry of Deeds -- How To Guide", 0, 1, "C")
        self.set_draw_color(150, 150, 150)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(3)
        self.set_text_color(0, 0, 0)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Eldoria ROD How To Guide  |  Page {self.page_no()}  |  eldoria.gov/rod", 0, 0, "C")
        self.set_text_color(0, 0, 0)


def make_guide(filename, index_type, full_name, sections):
    """
    sections: list of (heading, body_text) tuples
    body_text may contain numbered list items prefixed with "N. " which get indented
    """
    pdf = HowToPDF(full_name)
    pdf.add_page()

    # Badge / type pill
    pdf.set_fill_color(42, 82, 120)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Courier", "B", 9)
    pdf.cell(22, 7, f" {index_type} ", 0, 0, "L", fill=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(10)

    # Title
    pdf.set_font("Arial", "B", 18)
    pdf.multi_cell(0, 9, f"How To: {full_name}", 0, "L")
    pdf.ln(2)

    # Subtitle rule
    pdf.set_draw_color(42, 82, 120)
    pdf.set_line_width(0.8)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.set_line_width(0.2)
    pdf.ln(5)

    for heading, body in sections:
        # Section heading
        pdf.set_font("Arial", "B", 12)
        pdf.set_fill_color(230, 237, 242)
        pdf.cell(0, 7, f"  {heading}", 0, 1, "L", fill=True)
        pdf.ln(2)

        pdf.set_font("Arial", "", 10)
        lines = body.strip().split("\n")
        for line in lines:
            line = line.strip()
            if not line:
                pdf.ln(3)
                continue
            # Detect numbered list items "1." through "9."
            if len(line) >= 2 and line[0].isdigit() and line[1] == ".":
                pdf.set_x(18)
                pdf.multi_cell(175, 5, line)
            # Detect bullet "-"
            elif line.startswith("- "):
                pdf.set_x(18)
                pdf.multi_cell(175, 5, line)
            else:
                pdf.set_x(10)
                pdf.multi_cell(0, 5, line)
            pdf.ln(1)

        pdf.ln(4)

    pdf.output(os.path.join(output_dir, filename))
    print(f"  Generated {filename}")


GUIDES = [
    (
        "how-to-deed.pdf", "DEED", "Recording a Deed",
        [
            (
                "What Is a Deed?",
                "A deed is the primary instrument by which ownership of subterranean real property is "
                "transferred from one party (Grantor) to another (Grantee) within the Grand Duchy of "
                "Eldoria. All deeds must be recorded with the Arcane Registry of Deeds (ROD) to be "
                "effective against third parties. Until recorded, a deed is valid only between the "
                "immediate parties.\n"
                "\n"
                "Common deed types accepted by the Eldoria ROD:\n"
                "- Warranty Deed: Grantor guarantees clear title and will defend against all claims.\n"
                "- Quitclaim Deed: Transfers only the interest the Grantor currently holds; no warranty.\n"
                "- Trustee's Deed: Used when a trustee conveys trust property on behalf of a trust.\n"
                "- Sheriff's Deed: Issued following a judicial sale or enforcement proceeding."
            ),
            (
                "Required Elements",
                "Every deed submitted for recording must contain all of the following:\n"
                "\n"
                "1. Names and addresses of Grantor and Grantee (full legal names required).\n"
                "2. Consideration recital (e.g., 'for 250.00 Gold Sovereigns and other good and valuable consideration').\n"
                "3. Granting clause ('does hereby grant, bargain, sell, and convey...').\n"
                "4. Legal description of the property, including Z-level, sector designation, and cubic footage.\n"
                "5. Habendum clause ('To have and to hold...').\n"
                "6. Signature of Grantor before two witnesses.\n"
                "7. Notarial acknowledgment by a licensed Notarial Magistrate of the Grand Duchy.\n"
                "8. Return address for the recorded instrument."
            ),
            (
                "Step-by-Step Filing Process",
                "1. Prepare the deed instrument using approved Eldoria ROD form ELD-D-01 or equivalent.\n"
                "2. Have the Grantor sign before two witnesses and a Notarial Magistrate.\n"
                "3. Complete the ROD Cover Sheet (form ELD-CVR), listing all parties and Z-level address.\n"
                "4. Calculate the recording fee: 15.00 GP base + 2.00 GP per additional page.\n"
                "5. Submit the original instrument, cover sheet, and fee payment to the ROD counter.\n"
                "6. The ROD clerk will stamp 'FILED, RECORDED, INDEXED' and assign a Book/Page/Inst number.\n"
                "7. The original recorded deed is returned to the Grantee within 14 working days.\n"
                "8. Verify recording by searching the online index at eldoria.gov/rod."
            ),
            (
                "Common Errors & How to Avoid Them",
                "- Incomplete legal description: Always include Z-level, sector, and cubic dwarven span measurements.\n"
                "- Missing notary seal: The Notarial Magistrate must affix their official obsidian seal.\n"
                "- Illegible instrument: Documents must be inscribed in permanent ink on vellum or stone-pressed paper.\n"
                "- Wrong fee: Recalculate if the deed has exhibits or attachments; each page counts separately.\n"
                "- Expired notary: Verify the Notarial Magistrate's commission has not lapsed before signing."
            ),
            (
                "Fees & Turnaround",
                "Standard recording fee: 15.00 Gold Sovereigns (first page) + 2.00 GP per additional page.\n"
                "Expedited same-day recording: Additional 50.00 GP surcharge.\n"
                "Certified copy of recorded deed: 5.00 GP per copy.\n"
                "Typical processing time: 3-5 working days for standard filings."
            ),
        ]
    ),
    (
        "how-to-mtg.pdf", "MTG", "Filing and Managing a Mortgage",
        [
            (
                "What Is a Mortgage?",
                "A mortgage is a security instrument by which a borrower (Mortgagor) pledges real property "
                "as collateral for a loan from a lender (Mortgagee). In the Grand Duchy of Eldoria, all "
                "mortgages must be recorded with the ROD to be enforceable against subsequent purchasers "
                "or creditors. An unrecorded mortgage is junior to all recorded instruments.\n"
                "\n"
                "The mortgage does not transfer title; it creates a lien. If the Mortgagor defaults, the "
                "Mortgagee may initiate foreclosure proceedings before the Grand Duchy Court of Claims."
            ),
            (
                "Required Elements",
                "1. Names and addresses of Mortgagor and Mortgagee.\n"
                "2. Loan amount and note date (the mortgage secures the underlying promissory note).\n"
                "3. Legal description of the mortgaged property (Z-level, sector, cubic footage).\n"
                "4. Uniform Covenants section covering insurance, maintenance, hazard events, and acceleration.\n"
                "5. Signature of Mortgagor before two witnesses.\n"
                "6. Notarial acknowledgment.\n"
                "7. Lender's name and address for lien index purposes."
            ),
            (
                "Step-by-Step Filing Process",
                "1. Prepare the mortgage instrument using ROD form ELD-M-01 or lender's standard form.\n"
                "2. Both parties sign; Mortgagor signs before witnesses and Notarial Magistrate.\n"
                "3. Complete ROD Cover Sheet (form ELD-CVR); check 'MTG' as index type.\n"
                "4. Pay recording fee: 25.00 GP base + 2.00 GP per page.\n"
                "5. Submit to ROD counter. The lien will appear in the index within 2 working days.\n"
                "6. Mortgagee retains the original; Mortgagor receives a certified copy.\n"
                "7. Upon full repayment, file a Satisfaction of Mortgage (see REL guide)."
            ),
            (
                "Uniform Covenants Requirement",
                "All mortgages recorded in Eldoria must include the following minimum covenants:\n"
                "\n"
                "1. INSURANCE: Mortgagor shall maintain hazard coverage including cave-in, magma incursion, and Forgotten Beast damage.\n"
                "2. MAINTENANCE: Mortgagor shall keep all tunnels, supports, and fortifications in good repair.\n"
                "3. HAZARD EVENTS: Mortgagor must notify Mortgagee within 72 hours of any structural incident.\n"
                "4. ACCELERATION: Upon default, Mortgagee may declare the full balance immediately due.\n"
                "5. ASSIGNMENT: Mortgagee may assign the mortgage without Mortgagor consent.\n"
                "6. COMPLIANCE: Mortgagor must comply with all Grand Duchy subterranean safety codes."
            ),
            (
                "Obtaining a Satisfaction",
                "When the mortgage debt is paid in full:\n"
                "\n"
                "1. Mortgagee executes a Satisfaction of Mortgage (form ELD-SAT-01) within 30 days of payoff.\n"
                "2. The Satisfaction must reference the original Book, Page, and Instrument number.\n"
                "3. File the Satisfaction with the ROD; fee is 10.00 GP.\n"
                "4. The index will reflect 'SAT' status within 2 working days.\n"
                "5. Failure to timely file a Satisfaction exposes the Mortgagee to penalties under Eldoria Code Section 44-B."
            ),
        ]
    ),
    (
        "how-to-lien.pdf", "LIEN", "Filing a Mechanic's Lien",
        [
            (
                "What Is a Mechanic's Lien?",
                "A mechanic's lien (also called a construction lien or claim of lien) is a statutory security "
                "interest in real property granted to contractors, subcontractors, and material suppliers who "
                "have furnished labor or materials to improve that property and have not been paid. It is "
                "governed by the Grand Duchy Subterranean Construction Lien Act (SCLA), Articles 14-22.\n"
                "\n"
                "A properly filed lien attaches to the property itself, not just the owner personally. This "
                "means the lien can follow the property even if it is sold, making it a powerful collection tool."
            ),
            (
                "Who May File",
                "The following parties have lien rights under the SCLA:\n"
                "- General contractors with a direct contract with the property owner.\n"
                "- Subcontractors and sub-subcontractors who served a Notice to Owner within 45 days of first furnishing.\n"
                "- Material suppliers who delivered materials incorporated into the improvement.\n"
                "- Licensed engineers and surveyors providing professional services to the project.\n"
                "\n"
                "To preserve lien rights, subcontractors and suppliers MUST serve a Notice to Owner (form ELD-NTO-01) "
                "within 45 days of first furnishing labor or materials."
            ),
            (
                "Filing Deadlines",
                "1. Notice to Owner: Must be served within 45 days of first furnishing (subcontractors/suppliers only).\n"
                "2. Claim of Lien: Must be recorded within 90 days after the last date labor or materials were furnished.\n"
                "3. Lawsuit to enforce the lien: Must be filed within 1 year of recording the Claim of Lien.\n"
                "\n"
                "Missing any of these deadlines will result in loss of lien rights. The ROD does not waive statutory deadlines."
            ),
            (
                "Required Elements of the Claim of Lien",
                "1. Sworn affidavit by the Affiant (lienor or authorized officer).\n"
                "2. Name and address of the property owner.\n"
                "3. Legal description of the property (Z-level, sector, parcel ID).\n"
                "4. General description of the labor or materials furnished.\n"
                "5. First and last date that labor or materials were furnished.\n"
                "6. Total amount unpaid and DELINQUENT.\n"
                "7. Schedule A: Itemized table of materials and labor (quantity, description, unit price, total).\n"
                "8. Signature before a Notarial Magistrate.\n"
                "\n"
                "The delinquent amount must be stated in bold or prominent type as required by SCLA Article 17."
            ),
            (
                "Step-by-Step Filing Process",
                "1. Verify you served a Notice to Owner (if required) within the 45-day window.\n"
                "2. Prepare the Claim of Lien on form ELD-L-01; attach Schedule A itemization.\n"
                "3. Have the Affiant sign before a Notarial Magistrate.\n"
                "4. Complete ROD Cover Sheet; check 'LIEN' as index type.\n"
                "5. Pay recording fee: 10.00 GP (flat fee for lien filings).\n"
                "6. Submit to ROD. The lien appears in the index within 1 working day.\n"
                "7. Serve a copy of the recorded lien on the property owner within 15 days of recording.\n"
                "8. If not paid within 30 days, consult legal counsel regarding enforcement proceedings."
            ),
            (
                "Contesting or Releasing a Lien",
                "Property owners who dispute a lien have several options:\n"
                "- Transfer of Lien to Bond: Post a cash bond equal to 150% of the lien amount to remove the lien from title.\n"
                "- Notice of Contest: File a Notice of Contest of Lien to shorten the lienor's enforcement deadline to 60 days.\n"
                "- Direct Payment and Release: Pay the lienor and obtain a Release of Lien (see REL guide).\n"
                "- Court Action: Petition the Grand Duchy Court of Claims to discharge a fraudulent or improper lien."
            ),
        ]
    ),
    (
        "how-to-esmt.pdf", "ESMT", "Registering an Easement",
        [
            (
                "What Is an Easement?",
                "An easement is a non-possessory right to use another party's real property for a specific "
                "purpose. The property that benefits from the easement is called the dominant estate; the "
                "property burdened by the easement is the servient estate. Easements must be recorded to be "
                "binding on future purchasers of the servient estate.\n"
                "\n"
                "Common easement types in the Grand Duchy of Eldoria:\n"
                "- Utility Easement: For steam pipes, fluid conduits, and pressurized lines.\n"
                "- Access Easement: Right of way for ingress and egress through tunnels.\n"
                "- Drainage Easement: For water management and aquifer control infrastructure.\n"
                "- Magma Routing Easement: For municipal lava management systems.\n"
                "- View/Light Easement: Protecting sightlines to surface apertures."
            ),
            (
                "Required Elements",
                "1. Identification of the dominant and servient estates (parcel IDs and Z-levels).\n"
                "2. Names of the granting party (servient estate owner) and the grantee.\n"
                "3. Precise description of the easement area (width, length, coordinates, depth).\n"
                "4. Statement of the specific permitted use(s) -- easements must not be drafted too broadly.\n"
                "5. Duration (perpetual or term; if term, specify expiration conditions).\n"
                "6. Maintenance obligations of each party.\n"
                "7. Indemnification provisions.\n"
                "8. Signature of the servient estate owner; notarization required."
            ),
            (
                "Easement Area Description Requirements",
                "The ROD requires that all easements include a metes-and-bounds or coordinate description "
                "of the easement corridor. For subterranean easements, the description must state:\n"
                "\n"
                "- Starting coordinate (X, Y) at the relevant Z-level.\n"
                "- Direction and distance of each boundary line in dwarven spans.\n"
                "- Depth extent of the easement (top and bottom Z-level if applicable).\n"
                "- Reference to a recorded survey (Survey No. must be on file with the ROD).\n"
                "\n"
                "Easements described only by general reference ('the area used for pipes') will be rejected."
            ),
            (
                "Step-by-Step Filing Process",
                "1. Commission a licensed subterranean surveyor to prepare the easement area description.\n"
                "2. Draft the Grant of Easement instrument on form ELD-E-01 or equivalent.\n"
                "3. Servient estate owner signs before witnesses and Notarial Magistrate.\n"
                "4. Complete ROD Cover Sheet; check 'ESMT' as index type.\n"
                "5. Pay recording fee: 15.00 GP base + 2.00 GP per page.\n"
                "6. Submit survey, instrument, and cover sheet to the ROD counter.\n"
                "7. The easement is indexed under both the dominant and servient parcel IDs.\n"
                "8. Grantee should verify the easement appears in the index for the servient estate before commencing any work."
            ),
            (
                "Terminating an Easement",
                "An easement may be terminated by:\n"
                "- Express Release: The dominant estate owner executes a Release of Easement, recorded with the ROD.\n"
                "- Merger: If the same party acquires both dominant and servient estates, the easement merges into fee title.\n"
                "- Abandonment: Non-use for 20+ years combined with affirmative acts of abandonment (requires court order).\n"
                "- Expiration: If the easement was granted for a defined term, it terminates automatically on the end date.\n"
                "- Condemnation: If the Grand Duchy acquires the servient estate for public use.\n"
                "\n"
                "A recorded Release or court order of termination should be filed promptly to clear the title."
            ),
        ]
    ),
    (
        "how-to-asgn.pdf", "ASGN", "Filing an Assignment of Mortgage",
        [
            (
                "What Is an Assignment of Mortgage?",
                "An assignment of mortgage is the transfer of a mortgage (and its underlying promissory note) "
                "from the original Mortgagee (Assignor) to a new holder (Assignee). Assignments are common "
                "when mortgages are sold in the secondary market, transferred to a successor institution, or "
                "pledged as collateral. Recording an assignment ensures the public record reflects the correct "
                "current holder of the lien.\n"
                "\n"
                "Importantly, an assignment transfers both the right to collect payments AND the right to foreclose "
                "upon default. An unrecorded assignment may create complications in enforcement proceedings."
            ),
            (
                "Required Elements",
                "1. Names of Assignor (current Mortgagee) and Assignee (new Mortgagee).\n"
                "2. Reference to the original mortgage: Book, Page, Instrument number, date, and original parties.\n"
                "3. Statement of the unpaid principal balance as of the date of assignment.\n"
                "4. Description of the mortgaged property (may incorporate by reference to the original mortgage).\n"
                "5. Consideration recital.\n"
                "6. Assignor's warranty that the mortgage is valid, subsisting, and has not been previously assigned.\n"
                "7. Signature of Assignor; notarization required."
            ),
            (
                "Step-by-Step Filing Process",
                "1. Prepare the Assignment of Mortgage on form ELD-A-01 or equivalent.\n"
                "2. Assignor signs before a Notarial Magistrate.\n"
                "3. Complete ROD Cover Sheet; check 'ASGN' as index type; list the original mortgage instrument number.\n"
                "4. Pay recording fee: 20.00 GP flat.\n"
                "5. Submit to ROD counter. The assignment will be cross-indexed to the original mortgage.\n"
                "6. Future payments from the Mortgagor should be remitted to the Assignee after the recording date.\n"
                "7. Notify the Mortgagor in writing of the assignment and provide the Assignee's payment address."
            ),
            (
                "Mortgagor Notification Requirements",
                "Under Eldoria Code Section 55-C, the Assignee must notify the Mortgagor of the assignment "
                "within 15 days of recording. The notice must include:\n"
                "\n"
                "- Name and address of the new Mortgagee (Assignee).\n"
                "- Effective date of the assignment.\n"
                "- Instructions for remitting future payments.\n"
                "- Contact information for payment inquiries.\n"
                "\n"
                "Failure to notify the Mortgagor does not invalidate the assignment but may limit the "
                "Assignee's right to collect late fees during the notification gap."
            ),
            (
                "Partial Assignments",
                "A mortgage may be partially assigned (i.e., only a percentage interest transferred). "
                "Partial assignments are common in loan participation arrangements. The instrument must clearly "
                "state the percentage interest being assigned and the pro-rata share of the outstanding balance. "
                "Both the Assignor and Assignee become co-holders of the mortgage lien and must act jointly in "
                "any enforcement or satisfaction proceedings unless the instrument provides otherwise."
            ),
        ]
    ),
    (
        "how-to-rel.pdf", "REL", "Releasing a Lien or Mortgage",
        [
            (
                "What Is a Release?",
                "A Release (also called a Satisfaction, Discharge, or Cancellation) is the instrument used to "
                "extinguish a previously recorded lien or mortgage once the underlying obligation has been fully "
                "satisfied. Recording a Release is essential to clear the title of the encumbrance. Without a "
                "recorded Release, the lien or mortgage continues to appear as a cloud on title indefinitely.\n"
                "\n"
                "In Eldoria, Releases are used to discharge:\n"
                "- Mortgages (upon full loan payoff).\n"
                "- Mechanic's liens (upon payment or settlement).\n"
                "- Judgment liens (upon satisfaction of a court judgment).\n"
                "- Easements (upon express termination by the dominant estate holder)."
            ),
            (
                "Mortgagee's Obligation to Release",
                "Under Eldoria Code Section 44-B, a Mortgagee who has received full payoff MUST:\n"
                "\n"
                "1. Execute a Satisfaction of Mortgage within 30 days of receiving full payment.\n"
                "2. Record the Satisfaction with the ROD within 60 days of receiving full payment.\n"
                "3. Send a copy of the recorded Satisfaction to the Mortgagor within 10 days of recording.\n"
                "\n"
                "Penalties for non-compliance: 100 Gold Sovereigns per month of delay after the 60-day period, "
                "payable to the Mortgagor. The Mortgagor may also petition the Court of Claims for a judicial "
                "release if the Mortgagee is unreachable or refuses to act."
            ),
            (
                "Required Elements of a Release",
                "1. Name of the Releasor (the party holding the lien or mortgage).\n"
                "2. Reference to the original instrument: Book, Page, Instrument number, and recording date.\n"
                "3. Name of the property owner (Mortgagor or owner of record).\n"
                "4. Clear statement that the obligation has been fully paid and satisfied.\n"
                "5. Certification that no further amounts are owed under the original instrument.\n"
                "6. Signature of the Releasor; notarization required.\n"
                "7. If releasing a partial satisfaction, clearly state the remaining balance."
            ),
            (
                "Step-by-Step Filing Process",
                "1. Obtain a payoff statement confirming the full amount needed to satisfy the obligation.\n"
                "2. Tender full payment to the lienholder.\n"
                "3. Obtain the executed Release instrument from the lienholder (form ELD-R-01).\n"
                "4. Complete ROD Cover Sheet; check 'REL' as index type; list the original instrument number.\n"
                "5. Pay recording fee: 10.00 GP flat.\n"
                "6. Submit to ROD counter. The index will be updated to reflect 'SAT' status within 1 working day.\n"
                "7. Retain the recorded Release in your permanent property files."
            ),
            (
                "What If the Lienholder Cannot Be Located?",
                "If the Mortgagee or lienholder is deceased, dissolved, or unreachable:\n"
                "\n"
                "1. Publish notice of intent to seek judicial release in the Grand Duchy Gazette for 4 consecutive weeks.\n"
                "2. File a Petition for Judicial Release with the Grand Duchy Court of Claims, attaching proof of payoff.\n"
                "3. The Court may issue an Order of Satisfaction, which has the same effect as a recorded Release.\n"
                "4. Record the Court Order with the ROD; fee is 15.00 GP.\n"
                "\n"
                "The judicial release process typically takes 60-90 days."
            ),
        ]
    ),
    (
        "how-to-ntc.pdf", "NTC", "Filing a Notice of Commencement",
        [
            (
                "What Is a Notice of Commencement?",
                "A Notice of Commencement (NOC) is a document recorded with the ROD by a property owner prior "
                "to commencing construction or improvement work on their property. It is required under Article 8 "
                "of the Grand Duchy Subterranean Construction Lien Act (SCLA) whenever the total cost of "
                "improvements exceeds 500 Gold Sovereigns.\n"
                "\n"
                "The NOC serves two critical functions:\n"
                "1. It notifies the public (and potential lienors) that construction has begun, establishing the "
                "project's legal commencement date.\n"
                "2. It limits the owner's exposure to lien claims by requiring subcontractors and suppliers to "
                "serve a Notice to Owner within 45 days of first furnishing."
            ),
            (
                "When Is It Required?",
                "A NOC is REQUIRED when:\n"
                "- Total project value exceeds 500 Gold Sovereigns.\n"
                "- Work involves excavation, structural modification, or installation of permanent fixtures.\n"
                "- The owner intends to finance construction with a mortgage or construction loan.\n"
                "\n"
                "A NOC is optional (but recommended) for smaller projects. Without a recorded NOC, the project "
                "has no defined commencement date, which can extend lienors' filing windows and complicate "
                "priority disputes."
            ),
            (
                "Required Elements",
                "1. Name and address of the property owner.\n"
                "2. Legal description of the property (Z-level, sector, parcel ID).\n"
                "3. General description of the planned improvements.\n"
                "4. Name and license number of the general contractor.\n"
                "5. Name and address of any construction lender (if applicable).\n"
                "6. Estimated total cost of construction (first-phase cost if phased project).\n"
                "7. Expected commencement date.\n"
                "8. Signature of property owner; notarization required."
            ),
            (
                "Step-by-Step Filing Process",
                "1. Prepare the NOC on form ELD-N-01 before work begins (or within 30 days of commencement).\n"
                "2. Owner signs before a Notarial Magistrate.\n"
                "3. Complete ROD Cover Sheet; check 'NTC' as index type.\n"
                "4. Pay recording fee: 10.00 GP flat.\n"
                "5. Post a certified copy of the recorded NOC at the job site in a conspicuous location.\n"
                "6. Provide a copy to the general contractor for distribution to subcontractors.\n"
                "7. If the project is paused for more than 90 days, file a Notice of Recommencement."
            ),
            (
                "Amending or Terminating a NOC",
                "AMENDMENT: If the general contractor changes, or the construction lender changes, an Amended "
                "NOC must be recorded within 10 days of the change. Use form ELD-N-02 (Amended Notice of "
                "Commencement) referencing the original NOC instrument number.\n"
                "\n"
                "TERMINATION: When all construction is complete and all lienors have been paid, the owner may "
                "record a Notice of Termination (form ELD-N-03). This closes the lien window for the project. "
                "The ROD will update the index to reflect 'TERMINATED' status. Recording fee: 10.00 GP."
            ),
        ]
    ),
    (
        "how-to-aff.pdf", "AFF", "Filing an Affidavit of Title",
        [
            (
                "What Is an Affidavit of Title?",
                "An Affidavit of Title is a sworn statement by the property owner (Affiant) attesting to the "
                "current state of their title -- specifically, that the property is free of undisclosed liens, "
                "encumbrances, claims, or other title defects. It is most commonly required:\n"
                "\n"
                "- By a buyer's attorney or title examiner at closing, to confirm no title issues arose between "
                "the title search date and the closing date.\n"
                "- By a lender as a condition of issuing a mortgage.\n"
                "- In connection with an estate or trust transfer to confirm no competing claims.\n"
                "- To correct or supplement an ambiguous deed or prior instrument of record."
            ),
            (
                "What Must Be Disclosed",
                "The Affiant must truthfully disclose all of the following (or affirmatively state none exist):\n"
                "\n"
                "1. Unrecorded deeds, contracts, or agreements affecting the property.\n"
                "2. Parties in possession other than the owner (tenants, occupants, adverse claimants).\n"
                "3. Pending legal proceedings, judgments, or threatened litigation affecting title.\n"
                "4. Mechanic's liens or unpaid contractor claims, whether or not yet recorded.\n"
                "5. Boundary disputes or encroachments.\n"
                "6. Any rights granted to others (verbal easements, licenses, informal access agreements).\n"
                "7. Estate or probate matters that could affect title.\n"
                "\n"
                "Omitting a known encumbrance constitutes perjury under Eldoria Code Section 88-F."
            ),
            (
                "Legal Consequences of False Statements",
                "An Affidavit of Title is a sworn instrument. Filing a materially false Affidavit exposes the "
                "Affiant to:\n"
                "\n"
                "- Perjury charges under the Grand Duchy Criminal Code, punishable by forfeiture of all property "
                "rights and mandatory service in the Tunnel Defense Corps (minimum 5 years).\n"
                "- Civil liability to any party who relied on the Affidavit and suffered damages as a result.\n"
                "- Rescission of any transaction closed in reliance on the false Affidavit.\n"
                "- Permanent disqualification from serving as Notarial Magistrate or ROD-licensed appraiser."
            ),
            (
                "Required Elements",
                "1. Affiant's full legal name, address, and relationship to the property.\n"
                "2. Legal description of the subject property.\n"
                "3. Reference to Affiant's deed of acquisition (Book, Page, Inst. number).\n"
                "4. Sworn statements addressing each required disclosure category (see above).\n"
                "5. Statement of the purpose for which the Affidavit is being made.\n"
                "6. Affiant's signature.\n"
                "7. Notarial acknowledgment with the Magistrate's obsidian seal."
            ),
            (
                "Step-by-Step Filing Process",
                "1. Prepare the Affidavit on form ELD-AF-01 or a form approved by the receiving party.\n"
                "2. Conduct a title search to confirm what is of record before making sworn statements.\n"
                "3. Affiant signs before a Notarial Magistrate.\n"
                "4. Complete ROD Cover Sheet; check 'AFF' as index type.\n"
                "5. Pay recording fee: 10.00 GP flat.\n"
                "6. The recorded Affidavit will be indexed under the property's parcel ID.\n"
                "7. Provide certified copies to the buyer, lender, or other parties requiring the Affidavit."
            ),
        ]
    ),
]

if __name__ == "__main__":
    for filename, index_type, full_name, sections in GUIDES:
        make_guide(filename, index_type, full_name, sections)
    print(f"\nSuccessfully generated {len(GUIDES)} how-to guides in {output_dir}/")
