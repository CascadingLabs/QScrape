import os

from fpdf import FPDF

output_dir = "generated-data"
os.makedirs(output_dir, exist_ok=True)


class EldoriaRODPDF(FPDF):
    def __init__(self, book, page_num, inst_num, fee):
        super().__init__()
        self.book = book
        self.page_num = page_num
        self.inst_num = inst_num
        self.fee = fee

    def header(self):
        # Simulated Adversarial Recording Stamp (Right-aligned, fixed width)
        self.set_font("Courier", "B", 9)
        self.set_xy(110, 10)
        self.cell(90, 4, "FILED, RECORDED, INDEXED", 0, 1, "R")
        self.set_x(110)
        self.cell(90, 4, "Date: 10/15/2026 Time: 14:32:05", 0, 1, "R")
        self.set_x(110)
        self.cell(90, 4, f"Book: {self.book}  Page: {self.page_num}", 0, 1, "R")
        self.set_x(110)
        self.cell(90, 4, f"Fee: {self.fee}  Inst#: {self.inst_num}", 0, 1, "R")
        self.set_x(110)
        self.cell(90, 4, "Registry of Deeds, Grand Duchy of Eldoria", 0, 1, "R")
        self.ln(15)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", 0, 0, "C")


def create_deed(filename, title, content, book, page_num, inst, fee, claim_id, z_level):
    pdf = EldoriaRODPDF(book, page_num, inst, fee)
    pdf.add_page()

    # Title
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, title, 0, 1, "C")
    pdf.ln(5)

    # Exact match to the .astro UI taxonomy
    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 6, f"Claim / Parcel ID: {claim_id}", 0, 1, "L")
    pdf.cell(0, 6, f"Z-Level / Address: {z_level}", 0, 1, "L")
    pdf.ln(5)

    # Body
    pdf.set_font("Arial", "", 11)
    pdf.multi_cell(0, 6, content)

    # Misaligned Signature Blocks to test spatial OCR limits
    pdf.ln(20)
    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 6, "SIGNED, SEALED AND DELIVERED IN THE PRESENCE OF:", 0, 1, "L")
    pdf.ln(10)

    pdf.cell(80, 8, "___________________________________", 0, 0, "L")
    pdf.cell(30, 8, "", 0, 0, "C")
    pdf.cell(80, 8, "___________________________________", 0, 1, "L")
    pdf.cell(80, 5, "Witness #1", 0, 0, "L")
    pdf.cell(30, 5, "", 0, 0, "C")
    pdf.cell(80, 5, "Grantor / Affiant", 0, 1, "L")

    pdf.ln(10)
    pdf.cell(80, 8, "___________________________________", 0, 0, "L")
    pdf.cell(30, 8, "", 0, 0, "C")
    pdf.cell(80, 8, "___________________________________", 0, 1, "L")
    pdf.cell(80, 5, "Witness #2 (Magistrate)", 0, 0, "L")
    pdf.cell(30, 5, "", 0, 0, "C")
    pdf.cell(80, 5, "Commission Expires: 12/31/2030", 0, 1, "L")

    pdf.output(os.path.join(output_dir, filename))


def create_mechanic_lien(
    filename, title, content, book, page_num, inst, fee, claim_id, z_level
):
    pdf = EldoriaRODPDF(book, page_num, inst, fee)
    pdf.add_page()

    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, title, 0, 1, "C")
    pdf.ln(5)

    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 6, f"Claim / Parcel ID: {claim_id}", 0, 1, "L")
    pdf.cell(0, 6, f"Z-Level / Address: {z_level}", 0, 1, "L")
    pdf.ln(5)

    pdf.set_font("Arial", "", 11)
    pdf.multi_cell(0, 6, content)
    pdf.ln(5)

    # The Tabular Trap - Tests column-aware parsing
    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 8, "SCHEDULE A: ALLOCATED MATERIALS & LABOR", 0, 1, "L")

    pdf.set_fill_color(220, 220, 220)
    pdf.cell(20, 8, "QTY", 1, 0, "C", fill=True)
    pdf.cell(90, 8, "DESCRIPTION", 1, 0, "C", fill=True)
    pdf.cell(40, 8, "UNIT PRICE", 1, 0, "C", fill=True)
    pdf.cell(40, 8, "TOTAL", 1, 1, "C", fill=True)

    pdf.set_font("Courier", "", 10)
    items = [
        ("20", "Masterwork Bauxite Mechanisms", "150.00 GP", "3,000.00 GP"),
        ("5", "Obsidian Pressure Plates", "350.00 GP", "1,750.00 GP"),
        ("2", "Emergency Magma Floodgates", "2,624.99 GP", "5,249.98 GP"),
        ("-", "Subterranean Engineering Labor", "-", "0.01 GP"),
    ]
    for qty, desc, unit, total in items:
        pdf.cell(20, 8, qty, 1, 0, "C")
        pdf.cell(90, 8, desc, 1, 0, "L")
        pdf.cell(40, 8, unit, 1, 0, "R")
        pdf.cell(40, 8, total, 1, 1, "R")

    pdf.set_font("Arial", "B", 10)
    pdf.cell(150, 8, "TOTAL DELINQUENT AMOUNT:", 1, 0, "R")
    pdf.cell(40, 8, "9,999.99 GP", 1, 1, "R")

    pdf.ln(15)
    pdf.cell(80, 8, "___________________________________", 0, 1, "L")
    pdf.cell(80, 5, "Chief Engineer, Affiant", 0, 1, "L")

    pdf.output(os.path.join(output_dir, filename))


doc1_content = """THIS INDENTURE, made this 15th day of October, 2026, between The Mountainhome Regional Authority, Grantor, and ARMOK HOLDINGS LLC, Grantee.

WITNESSETH, that the Grantor, for and in consideration of the sum of Ten (10) Plump Helmets and other good and valuable consideration in hand paid at or before the sealing and delivery of these presents, the receipt whereof is hereby acknowledged, has granted, bargained, sold, aliened, conveyed, and confirmed, and by these presents does grant, bargain, sell, alien, convey, and confirm unto the said Grantee and their heirs, successors, and assigns forever, the following described parcel, lying and being situated in the Grand Duchy of Eldoria.

EXCEPTING AND RESERVING unto the Grantor all rights to Adamantine veins discovered hereafter, and subjecting the Grantee to a perpetual easement for municipal magma routing and fluid dynamics engineering.

TO HAVE AND TO HOLD the said described premises to the Grantee, so that neither the Grantor nor any person claiming under them shall at any time, by any means or ways, have, claim, or demand any right or title to the aforesaid premises or appurtenances, or any part thereof."""

doc2_content = """THIS MORTGAGE is made this 2nd day of November, 2026, between the Mortgagor, URIST MCMINER, and the Mortgagee, FIRST NATIONAL BANK OF THE MOUNTAINHOMES.

WHEREAS, Mortgagor is indebted to Mortgagee in the principal sum of Fifty (50) Copper Coins, which indebtedness is evidenced by Mortgagor's note dated November 2, 2026, providing for monthly installments of principal and interest, with the balance of the indebtedness, if not sooner paid, due and payable on November 2, 2056.

TO SECURE to Mortgagee the repayment of the indebtedness evidenced by the Note, with interest thereon, Mortgagor does hereby mortgage, grant, and convey to Mortgagee the previously stated parcel.

HAZARD INSURANCE: Mortgagor shall keep the improvements now existing or hereafter erected on the Property insured against loss by sudden cave-in, subterranean aquifer flooding, and incursions by Forgotten Beasts. The insurance carrier providing the insurance shall be chosen by Mortgagor subject to approval by Mortgagee."""

doc3_content = """STATE OF ELDORIA
COUNTY OF THE DEEP

BEFORE ME, the undersigned authority, personally appeared the Affiant, who being duly sworn, deposes and says:

1. That Affiant is the Chief Engineer for Cog & Lever Contracting.
2. That pursuant to a contract, Affiant furnished labor, services, or materials to the real property owned by BOATMURDERED TRUST.
3. That the total value of said labor and materials remains wholly unpaid and DELINQUENT.
4. That the last of the labor, services, and materials was furnished on the 1st day of December, 2026.

This claim of lien is filed pursuant to the statutory laws of the Grand Duchy of Eldoria governing subterranean mechanics and structural fortifications."""

if __name__ == "__main__":
    create_deed(
        "26-008492.pdf",
        "QUITCLAIM DEED",
        doc1_content,
        "1374",
        184,
        "2026-008492",
        "15.00 GP",
        "CLM-889-MAGMA",
        "Z-114 (Magma Sea Sector)",
    )
    create_deed(
        "26-009104.pdf",
        "MORTGAGE FIXTURE FILING",
        doc2_content,
        "1374",
        302,
        "2026-009104",
        "25.00 GP",
        "CLM-210-SAND",
        "Z-12 (Upper Sand Layers)",
    )
    create_mechanic_lien(
        "26-010033.pdf",
        "CLAIM OF MECHANIC'S LIEN",
        doc3_content,
        "1375",
        12,
        "2026-010033",
        "10.00 GP",
        "CLM-001-RIVER",
        "Z-40 (Flooded River Caverns)",
    )

    print(f"Successfully generated 3 complex evaluation PDFs in {output_dir}")
