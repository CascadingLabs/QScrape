import os

from fpdf import FPDF

output_dir = "../public"
os.makedirs(output_dir, exist_ok=True)

RECORDS = [
    {
        "file_num": "26-008492", "title": "QUITCLAIM DEED", "doc_type": "DEED",
        "last_name": "ARMOK HOLDINGS LLC", "first_name": "", "index": "DEED", "sat": "",
        "amount": "15.00 Gold Sovereigns", "status": "RECORDED",
        "z_level": "Z-114 (Magma Sea Sector)", "book": "1374", "page_num": 184,
        "inst": "2026-008492", "fee": "15.00 GP", "record_date": "10/15/2026",
        "grantor": "The Mountainhome Regional Authority",
        "grantee": "ARMOK HOLDINGS LLC",
        "claim_id": "CLM-889-MAGMA",
        "body_paragraphs": [
            "THIS INDENTURE, made this 15th day of October, 2026, between The Mountainhome Regional Authority, a duly constituted authority of the Grand Duchy of Eldoria, hereinafter referred to as Grantor, and ARMOK HOLDINGS LLC, a limited liability company duly organized and existing under the laws of the Grand Duchy of Eldoria, hereinafter referred to as Grantee.",
            "WITNESSETH, that the Grantor, for and in consideration of the sum of Fifteen (15.00) Gold Sovereigns and other good and valuable consideration in hand paid at or before the sealing and delivery of these presents, the receipt whereof is hereby acknowledged, has granted, bargained, sold, aliened, conveyed, and confirmed, and by these presents does grant, bargain, sell, alien, convey, and confirm unto the said Grantee and their heirs, successors, and assigns forever, all that certain parcel or tract of subterranean real property lying and being situated in the Grand Duchy of Eldoria, more particularly described herein.",
            "EXCEPTING AND RESERVING unto the Grantor, its successors and assigns, all rights, title, and interest in and to any and all Adamantine veins or deposits discovered at any depth hereafter, and further subjecting the Grantee to a perpetual non-exclusive easement for municipal magma routing, fluid dynamics engineering works, and emergency floodgate maintenance. Grantee covenants to provide unobstructed access for all authorized maintenance crews.",
            "TO HAVE AND TO HOLD the said described premises to the Grantee, so that neither the Grantor nor any person or entity claiming under, through, or by them shall at any time, by any means or ways whatsoever, have, claim, or demand any right or title to the aforesaid premises or appurtenances, or any part thereof, forever. Grantee further covenants to maintain all fortifications in good repair and to comply with all applicable subterranean safety codes promulgated by the Grand Duchy.",
        ],
    },
    {
        "file_num": "26-009104", "title": "MORTGAGE FIXTURE FILING", "doc_type": "MTG",
        "last_name": "MCMINER", "first_name": "URIST", "index": "MTG", "sat": "SAT",
        "amount": "50.00 Copper Coins", "status": "SATISFIED",
        "z_level": "Z-12 (Upper Sand Layers)", "book": "1374", "page_num": 302,
        "inst": "2026-009104", "fee": "25.00 GP", "record_date": "11/02/2026",
        "grantor": "URIST MCMINER",
        "grantee": "FIRST NATIONAL BANK OF THE MOUNTAINHOMES",
        "claim_id": "CLM-210-SAND",
        "body_paragraphs": [
            "THIS MORTGAGE is made this 2nd day of November, 2026, between the Mortgagor, URIST MCMINER, an individual resident of the Grand Duchy of Eldoria, and the Mortgagee, FIRST NATIONAL BANK OF THE MOUNTAINHOMES, a chartered financial institution duly licensed to conduct banking operations within the Grand Duchy.",
            "WHEREAS, Mortgagor is justly indebted to Mortgagee in the principal sum of Fifty (50.00) Copper Coins, which indebtedness is evidenced by Mortgagor's promissory note dated November 2, 2026, providing for monthly installments of principal and interest, with the balance of the indebtedness, if not sooner paid, due and payable on November 2, 2056, at the rate of interest set forth therein.",
            "TO SECURE to Mortgagee the repayment of the indebtedness evidenced by the Note, with interest thereon; the payment of all other sums advanced to protect the security of this Mortgage; and the performance of the covenants and agreements of Mortgagor herein contained, Mortgagor does hereby mortgage, grant, and convey to Mortgagee the previously stated parcel together with all improvements now or hereafter erected thereon.",
            "HAZARD INSURANCE: Mortgagor shall keep all improvements now existing or hereafter erected on the Property insured against loss by sudden cave-in, subterranean aquifer flooding, magma incursion, and incursions by Forgotten Beasts or other hostile megafauna. The insurance carrier shall be approved by Mortgagee. All insurance policies shall name Mortgagee as an additional insured and loss payee.",
        ],
    },
    {
        "file_num": "26-010033", "title": "CLAIM OF MECHANIC'S LIEN", "doc_type": "LIEN",
        "last_name": "BOATMURDERED TRUST", "first_name": "", "index": "LIEN", "sat": "",
        "amount": "9,999.99 Gold Sovereigns", "status": "DELINQUENT",
        "z_level": "Z-40 (Flooded River Caverns)", "book": "1375", "page_num": 12,
        "inst": "2026-010033", "fee": "10.00 GP", "record_date": "12/01/2026",
        "grantor": "Cog & Lever Contracting",
        "grantee": "BOATMURDERED TRUST",
        "claim_id": "CLM-001-RIVER",
        "body_paragraphs": [
            "BEFORE ME, the undersigned authority, personally appeared the Chief Engineer of Cog & Lever Contracting, Affiant, who being duly sworn, deposes and says that Affiant is the Chief Engineer and authorized representative for Cog & Lever Contracting, a duly licensed subterranean engineering firm registered with the Grand Duchy of Eldoria, and is competent to testify to the matters stated herein.",
            "That pursuant to a written contract dated the 15th day of August, 2026, between Cog & Lever Contracting and BOATMURDERED TRUST, Affiant's firm furnished labor, professional engineering services, and construction materials to the real property known as Parcel CLM-001-RIVER, located at Z-40 in the Flooded River Caverns sector of the Grand Duchy of Eldoria.",
            "That the total contract value of said labor, services, and materials as furnished amounts to NINE THOUSAND NINE HUNDRED NINETY-NINE AND 99/100 Gold Sovereigns (9,999.99 GP), which amount remains wholly unpaid and DELINQUENT as of the date of this filing. All demands for payment have been refused by the property owner without justification.",
            "That this claim of lien is filed pursuant to the statutory laws of the Grand Duchy of Eldoria governing subterranean mechanics and structural fortifications, specifically Articles 14 through 22 of the Subterranean Construction Lien Act, and Affiant claims a lien upon the above-described property for the full amount stated herein.",
        ],
        "schedule_a": [
            ("20", "Masterwork Bauxite Mechanisms", "150.00 GP", "3,000.00 GP"),
            ("5", "Obsidian Pressure Plates", "350.00 GP", "1,750.00 GP"),
            ("2", "Emergency Magma Floodgates", "2,624.99 GP", "5,249.98 GP"),
            ("12", "Reinforced Stone Supports", "83.33 GP", "999.96 GP"),
            ("-", "Subterranean Engineering Labor (320 hrs)", "3.125 GP/hr", "1,000.05 GP"),
        ],
        "lien_total": "9,999.99 GP",
    },
    {
        "file_num": "26-010241", "title": "WARRANTY DEED", "doc_type": "DEED",
        "last_name": "KOGANUSAN ESTATES LLC", "first_name": "", "index": "DEED", "sat": "",
        "amount": "250.00 Gold Sovereigns", "status": "RECORDED",
        "z_level": "Z-55 (Koganusan Deep Sector)", "book": "1375", "page_num": 44,
        "inst": "2026-010241", "fee": "25.00 GP", "record_date": "12/10/2026",
        "grantor": "KOGANUSAN ORIGINAL SETTLERS CORP",
        "grantee": "KOGANUSAN ESTATES LLC",
        "claim_id": "CLM-304-KOGAN",
        "body_paragraphs": [
            "THIS WARRANTY DEED, made this 10th day of December, 2026, between KOGANUSAN ORIGINAL SETTLERS CORP, a corporation organized and existing under the laws of the Grand Duchy of Eldoria, hereinafter Grantor, and KOGANUSAN ESTATES LLC, a limited liability company organized and existing under the laws of the Grand Duchy of Eldoria, hereinafter Grantee.",
            "WITNESSETH, that for and in consideration of the sum of Two Hundred Fifty (250.00) Gold Sovereigns and other valuable consideration, the receipt and sufficiency of which are hereby acknowledged, Grantor does hereby grant, bargain, sell, and convey unto Grantee, with warranty of title, all that certain tract or parcel of subterranean land situated in the Grand Duchy of Eldoria at Z-55 in the Koganusan Deep Sector, comprising approximately 48,500 cubic dwarven spans of excavated and improved underground real property.",
            "GRANTOR WARRANTS that it has good and indefeasible title to the premises herein conveyed; that said premises are free and clear of all encumbrances, liens, and restrictions except for those of public record; and that Grantor will forever defend the title to said premises against the lawful claims of all persons whomsoever claiming by, through, or under Grantor.",
            "The property is conveyed subject to current year's taxes and assessments; all valid easements, conditions, restrictions, and rights-of-way of record; and all applicable zoning, mining safety, and subterranean use ordinances of the Grand Duchy of Eldoria. Grantee accepts title subject to all conditions herein stated.",
        ],
    },
    {
        "file_num": "26-010502", "title": "PURCHASE MONEY MORTGAGE", "doc_type": "MTG",
        "last_name": "DOREN", "first_name": "MENG", "index": "MTG", "sat": "",
        "amount": "1,200.00 Gold Sovereigns", "status": "RECORDED",
        "z_level": "Z-28 (Mid-Fortress Residential)", "book": "1375", "page_num": 88,
        "inst": "2026-010502", "fee": "60.00 GP", "record_date": "12/22/2026",
        "grantor": "MENG DOREN",
        "grantee": "MOUNTAINHOME SAVINGS & TRUST",
        "claim_id": "CLM-502-MID",
        "body_paragraphs": [
            "THIS PURCHASE MONEY MORTGAGE is made this 22nd day of December, 2026, between MENG DOREN, an individual, hereinafter Mortgagor, and MOUNTAINHOME SAVINGS & TRUST, a chartered thrift institution, hereinafter Mortgagee.",
            "WHEREAS, Mortgagor has this day purchased from the seller identified in the accompanying deed the real property described herein, and as part of the purchase price, Mortgagor is indebted to Mortgagee in the principal sum of One Thousand Two Hundred (1,200.00) Gold Sovereigns, evidenced by a promissory note of even date herewith, bearing interest at the rate of 4.5% per annum, with monthly payments of principal and interest, amortized over a period of 30 years.",
            "THIS MORTGAGE is given to secure the repayment of said note and all renewals, extensions, and modifications thereof. Mortgagor pledges and mortgages to Mortgagee all improvements, fixtures, and appurtenances to the Property, including but not limited to all mining equipment permanently affixed to the premises, all ventilation shafts and mechanisms, and all subterranean drainage infrastructure.",
            "MORTGAGOR COVENANTS to pay all taxes and special assessments levied upon the Property before they become delinquent; to maintain adequate hazard insurance; to keep the Property in good repair; and not to commit or permit waste upon the Property. Failure to observe any such covenant shall constitute an event of default permitting Mortgagee to accelerate the entire indebtedness.",
        ],
    },
    {
        "file_num": "26-010618", "title": "GRANT OF EASEMENT", "doc_type": "ESMT",
        "last_name": "STEELTHUNDER CLAN", "first_name": "", "index": "ESMT", "sat": "",
        "amount": "75.00 Gold Sovereigns", "status": "RECORDED",
        "z_level": "Z-35 (Eastern Cavern Network)", "book": "1375", "page_num": 122,
        "inst": "2026-010618", "fee": "15.00 GP", "record_date": "01/08/2027",
        "grantor": "STEELTHUNDER CLAN",
        "grantee": "ELDORIA MUNICIPAL UTILITIES AUTHORITY",
        "claim_id": "CLM-618-EAST",
        "body_paragraphs": [
            "THIS GRANT OF EASEMENT, made this 8th day of January, 2027, by and between STEELTHUNDER CLAN, a dwarven clan holding recognized under the Clan Property Act of Eldoria, hereinafter Grantor, and the ELDORIA MUNICIPAL UTILITIES AUTHORITY, a public body corporate and politic, hereinafter Grantee.",
            "FOR AND IN CONSIDERATION of the sum of Seventy-Five (75.00) Gold Sovereigns and other good and valuable consideration, Grantor hereby grants and conveys to Grantee a perpetual, non-exclusive easement for the purpose of installing, maintaining, repairing, replacing, and operating underground utility conduits, steam pipes, and pressurized fluid lines across, through, and under the property of Grantor situated at Z-35 in the Eastern Cavern Network.",
            "THE EASEMENT AREA is described as a corridor twenty (20) dwarven spans in width and three hundred forty (340) dwarven spans in length, running in a generally eastward direction from the main utility trunk at coordinates (X:340, Y:112) to the junction point at coordinates (X:680, Y:112), as more particularly shown on the attached survey exhibit incorporated herein by reference.",
            "GRANTEE shall have the right of ingress and egress over the Grantor's property for the purposes stated herein; shall restore the surface as near as practicable after any maintenance or installation activities; shall not interfere with Grantor's mining operations outside the easement corridor; and shall indemnify Grantor against all claims arising from Grantee's use of the easement area.",
        ],
    },
    {
        "file_num": "26-010744", "title": "RELEASE OF LIEN", "doc_type": "REL",
        "last_name": "HEADSHOOTS LLC", "first_name": "", "index": "REL", "sat": "SAT",
        "amount": "0.00 Gold Sovereigns", "status": "SATISFIED",
        "z_level": "Z-22 (Trophy Hall District)", "book": "1375", "page_num": 155,
        "inst": "2026-010744", "fee": "10.00 GP", "record_date": "01/15/2027",
        "grantor": "PRECISION BOLT WORKS INC",
        "grantee": "HEADSHOOTS LLC",
        "claim_id": "CLM-744-TROPH",
        "body_paragraphs": [
            "THIS RELEASE OF LIEN, made this 15th day of January, 2027, by PRECISION BOLT WORKS INC, hereinafter Releasor, in favor of HEADSHOOTS LLC, the owner of record of the property described herein, hereinafter Owner.",
            "WHEREAS, Releasor previously filed a Claim of Mechanic's Lien dated October 12, 2026, recorded at Book 1374, Page 488, Instrument No. 2026-009871, against property owned by HEADSHOOTS LLC, situated at Z-22 in the Trophy Hall District, for labor and materials furnished in connection with the installation of precision crossbow mounting mechanisms and projectile trajectory enhancement systems; and",
            "WHEREAS, Owner has paid in full all amounts claimed in said lien, and Releasor acknowledges receipt of full and complete satisfaction of all claims asserted therein; NOW THEREFORE, Releasor hereby releases, discharges, and forever cancels said Mechanic's Lien of record, and certifies that no further amounts are owed in connection with the above-referenced work.",
            "This Release shall serve as a full and complete satisfaction of all claims arising under the prior lien filing. Releasor warrants that it has full authority to execute this Release and that no other claims, liens, or encumbrances have been filed or are contemplated to be filed arising from the same contract or work. Releasor indemnifies Owner against any such claims by subcontractors or material suppliers claiming through Releasor.",
        ],
    },
    {
        "file_num": "26-010831", "title": "ASSIGNMENT OF MORTGAGE", "doc_type": "ASGN",
        "last_name": "IRONHAND", "first_name": "AVAR", "index": "ASGN", "sat": "",
        "amount": "500.00 Gold Sovereigns", "status": "RECORDED",
        "z_level": "Z-19 (Ironhand Family Compound)", "book": "1375", "page_num": 189,
        "inst": "2026-010831", "fee": "20.00 GP", "record_date": "01/28/2027",
        "grantor": "MOUNTAINHOME SAVINGS & TRUST",
        "grantee": "AVAR IRONHAND",
        "claim_id": "CLM-831-IRON",
        "body_paragraphs": [
            "THIS ASSIGNMENT OF MORTGAGE, made this 28th day of January, 2027, between MOUNTAINHOME SAVINGS & TRUST, hereinafter Assignor, and AVAR IRONHAND, an individual, hereinafter Assignee.",
            "FOR VALUE RECEIVED, the sufficiency and receipt of which are hereby acknowledged, Assignor does hereby assign, transfer, and set over unto Assignee all of Assignor's right, title, and interest in and to that certain Mortgage dated November 18, 2025, made by Bolin Deepstone to secure a note in the original principal amount of Five Hundred (500.00) Gold Sovereigns, recorded at Book 1371, Page 44, in the Registry of Deeds of the Grand Duchy of Eldoria.",
            "THE MORTGAGE so assigned covers the property situated at Z-19 in the Ironhand Family Compound, being more particularly described in the original Mortgage instrument, which description is incorporated herein by reference. Assignee takes title to said Mortgage subject to all terms and conditions of the original instrument, including all rights and remedies available upon default by the Mortgagor.",
            "ASSIGNOR WARRANTS that the Mortgage is a valid and subsisting lien upon the mortgaged property; that the unpaid principal balance as of the date hereof is Five Hundred (500.00) Gold Sovereigns; that Assignor has not previously assigned or encumbered said Mortgage; and that Assignor has full authority to execute this Assignment. Assignee assumes all obligations of the Mortgagee from and after the date hereof.",
        ],
    },
    {
        "file_num": "26-010999", "title": "CLAIM OF MECHANIC'S LIEN", "doc_type": "LIEN",
        "last_name": "FUNGIWOOD TRUST", "first_name": "", "index": "LIEN", "sat": "",
        "amount": "3,400.50 Gold Sovereigns", "status": "DELINQUENT",
        "z_level": "Z-60 (Fungiwood Cavern Biome)", "book": "1376", "page_num": 5,
        "inst": "2026-010999", "fee": "10.00 GP", "record_date": "02/03/2027",
        "grantor": "SPORE & SPROUT EXCAVATION CO",
        "grantee": "FUNGIWOOD TRUST",
        "claim_id": "CLM-999-FUNGI",
        "body_paragraphs": [
            "BEFORE ME, the undersigned authority, personally appeared Brewer Mosspelt, Principal Engineer of Spore & Sprout Excavation Co, the Affiant, who being duly sworn, deposes and says that Affiant is the Principal Engineer and duly authorized agent of Spore & Sprout Excavation Co, a limited partnership registered with the Grand Duchy of Eldoria, License No. GDE-4421.",
            "That pursuant to a written contract executed on the 12th day of September, 2026, Affiant's firm furnished labor, equipment, and specialized bio-luminescent growing medium materials for the cultivation and excavation of underground mycological growth corridors on real property owned by FUNGIWOOD TRUST, situated at Z-60 in the Fungiwood Cavern Biome.",
            "That the total value of said labor, services, and materials furnished amounts to THREE THOUSAND FOUR HUNDRED AND 50/100 Gold Sovereigns (3,400.50 GP), which amount remains wholly unpaid and DELINQUENT. Demands for payment were made on January 5, 2027, and January 22, 2027, both of which were refused without explanation.",
            "That this claim of lien is filed within the statutory period required by the Grand Duchy of Eldoria Subterranean Construction Lien Act, and Affiant claims a valid mechanic's lien upon the above-described property and all improvements thereon for the full delinquent amount stated herein.",
        ],
        "schedule_a": [
            ("800", "Bio-Luminescent Spore Medium (cubic spans)", "1.50 GP", "1,200.00 GP"),
            ("15", "Mycological Corridor Framework Units", "80.00 GP", "1,200.00 GP"),
            ("3", "Subterranean Climate Control Nodes", "166.83 GP", "500.49 GP"),
            ("40", "Reinforced Fungal Growth Trellises", "12.50 GP", "500.00 GP"),
            ("-", "Installation & Cultivation Labor (100 hrs)", "0.001 GP/hr", "0.01 GP"),
        ],
        "lien_total": "3,400.50 GP",
    },
    {
        "file_num": "26-011102", "title": "GENERAL WARRANTY DEED", "doc_type": "DEED",
        "last_name": "SPEARBREAKER", "first_name": "MOLDATH", "index": "DEED", "sat": "",
        "amount": "800.00 Gold Sovereigns", "status": "RECORDED",
        "z_level": "Z-48 (Spearbreaker Holdings Zone)", "book": "1376", "page_num": 38,
        "inst": "2027-011102", "fee": "40.00 GP", "record_date": "02/14/2027",
        "grantor": "ELDORIA LAND DISPOSITION AUTHORITY",
        "grantee": "MOLDATH SPEARBREAKER",
        "claim_id": "CLM-102-SPEAR",
        "body_paragraphs": [
            "THIS GENERAL WARRANTY DEED, made this 14th day of February, 2027, between the ELDORIA LAND DISPOSITION AUTHORITY, a governmental entity of the Grand Duchy of Eldoria, hereinafter Grantor, and MOLDATH SPEARBREAKER, an individual and citizen of the Grand Duchy of Eldoria, hereinafter Grantee.",
            "WITNESSETH, that for and in consideration of the sum of Eight Hundred (800.00) Gold Sovereigns and other valuable consideration, the receipt and sufficiency of which are hereby acknowledged, Grantor does hereby grant, bargain, sell, and convey unto Grantee, with general warranty of title, all that certain subterranean parcel situated at Z-48 in the Spearbreaker Holdings Zone, comprising 31,200 cubic dwarven spans of improved underground property, together with all appurtenances thereto belonging.",
            "SAID PROPERTY is bounded as follows: On the north by the Great Hall Corridor, 80 dwarven spans; on the east by the Common Cistern Wall, 120 dwarven spans; on the south by Tunnel Route 7-B, 80 dwarven spans; and on the west by the Common Cistern Wall, 120 dwarven spans, more particularly described by survey on file with the Grand Duchy Registry, Survey No. 2027-0044.",
            "GRANTOR HEREBY WARRANTS the title to said property and covenants to defend the same against the lawful claims of all persons claiming by, through, or under the Grantor, and against the claims of all persons whomsoever. This conveyance is made subject to real property taxes for the current year, all easements, restrictions, and rights-of-way of public record, and all applicable Grand Duchy land use ordinances.",
        ],
    },
    {
        "file_num": "26-011287", "title": "MORTGAGE (SATISFIED)", "doc_type": "MTG",
        "last_name": "DWARVEN IRON GUILD", "first_name": "", "index": "MTG", "sat": "SAT",
        "amount": "2,500.00 Gold Sovereigns", "status": "SATISFIED",
        "z_level": "Z-70 (Guild Hall Complex)", "book": "1376", "page_num": 71,
        "inst": "2027-011287", "fee": "125.00 GP", "record_date": "02/20/2027",
        "grantor": "DWARVEN IRON GUILD",
        "grantee": "GRAND DUCHY COMMERCIAL BANK",
        "claim_id": "CLM-287-GUILD",
        "body_paragraphs": [
            "THIS MORTGAGE, made this 20th day of February, 2027, between DWARVEN IRON GUILD, a recognized guild of the Grand Duchy of Eldoria, hereinafter Mortgagor, and GRAND DUCHY COMMERCIAL BANK, a chartered commercial bank, hereinafter Mortgagee.",
            "WHEREAS, Mortgagor is indebted to Mortgagee in the principal sum of Two Thousand Five Hundred (2,500.00) Gold Sovereigns, which indebtedness is evidenced by a promissory note of even date herewith, bearing interest at the fixed rate of 5.25% per annum, payable in equal monthly installments of principal and interest over a period of twenty (20) years, maturing in full on February 20, 2047.",
            "TO SECURE repayment of said indebtedness, Mortgagor hereby mortgages and pledges to Mortgagee the Guild Hall Complex situated at Z-70, including all equipment, fixtures, forges, smelting apparatus, and inventory permanently affixed to or used in connection with the operation of said Guild premises.",
            "UNIFORM COVENANTS: (1) Mortgagor shall maintain comprehensive hazard insurance on all improvements; (2) Mortgagor shall pay all property taxes and special assessments when due; (3) Mortgagor shall not commit waste or permit deterioration of any improvements; (4) In the event of default, Mortgagee may accelerate the entire outstanding balance; (5) Mortgagor shall maintain the Guild in good standing with the Grand Duchy Guild Registry.",
        ],
    },
    {
        "file_num": "26-011344", "title": "AFFIDAVIT OF TITLE", "doc_type": "AFF",
        "last_name": "STONECLEAVE", "first_name": "RIMTAR", "index": "AFF", "sat": "",
        "amount": "10.00 Gold Sovereigns", "status": "RECORDED",
        "z_level": "Z-15 (Stonecleave Family Claim)", "book": "1376", "page_num": 99,
        "inst": "2027-011344", "fee": "10.00 GP", "record_date": "02/27/2027",
        "grantor": "RIMTAR STONECLEAVE",
        "grantee": "N/A",
        "claim_id": "CLM-344-STONE",
        "body_paragraphs": [
            "STATE OF ELDORIA, COUNTY OF THE DEEP: BEFORE ME, the undersigned Notarial Magistrate, personally appeared RIMTAR STONECLEAVE, who being duly sworn according to the laws and customs of the Grand Duchy of Eldoria, deposes and states as follows:",
            "That Affiant is the sole and lawful owner of the real property known as Parcel CLM-344-STONE, situated at Z-15 in the Stonecleave Family Claim, being approximately 8,900 cubic dwarven spans of developed subterranean residential property, acquired by Affiant pursuant to a Quitclaim Deed recorded at Book 1369, Page 44, Registry of Deeds of the Grand Duchy of Eldoria.",
            "That to the best of Affiant's knowledge, information, and belief, the property is free and clear of all mortgages, liens, claims, encumbrances, and defects of title except as disclosed herein; that there are no unrecorded deeds, mortgages, agreements, or contracts affecting the property; that there are no parties in possession of the property other than the Affiant; and that there are no pending legal proceedings which would affect the title to or possession of said property.",
            "That this Affidavit is made for the purpose of inducing prospective purchasers and lenders to rely upon the accuracy of the title representations made herein, and Affiant understands that any false statement made herein constitutes perjury under the laws of the Grand Duchy of Eldoria and may result in the forfeiture of all property rights and mandatory conscription into the Tunnel Defense Corps.",
        ],
    },
    {
        "file_num": "26-011521", "title": "CLAIM OF MECHANIC'S LIEN", "doc_type": "LIEN",
        "last_name": "IDEN METALCRAFTERS LLC", "first_name": "", "index": "LIEN", "sat": "",
        "amount": "6,750.00 Gold Sovereigns", "status": "DELINQUENT",
        "z_level": "Z-80 (Deep Forge District)", "book": "1376", "page_num": 133,
        "inst": "2027-011521", "fee": "10.00 GP", "record_date": "03/05/2027",
        "grantor": "IDEN METALCRAFTERS LLC",
        "grantee": "DEEPFORGE PROPERTY HOLDINGS",
        "claim_id": "CLM-521-FORGE",
        "body_paragraphs": [
            "STATE OF ELDORIA, COUNTY OF THE DEEP: BEFORE ME, the undersigned Notarial Magistrate, personally appeared Iden Craftmaster, Principal of IDEN METALCRAFTERS LLC, who being duly sworn states: That Affiant is the duly authorized principal and managing member of IDEN METALCRAFTERS LLC, a limited liability company engaged in the fabrication and installation of masterwork metal works, registered with the Grand Duchy of Eldoria under License No. GDE-7823.",
            "That pursuant to a contract for services executed on July 1, 2026, Affiant's firm furnished masterwork metalworking labor, custom forged components, and heat-resistant installation materials to the real property owned by DEEPFORGE PROPERTY HOLDINGS, situated at Z-80 in the Deep Forge District, for the construction and installation of a commercial-grade smelting and fabrication facility.",
            "That the total value of labor and materials furnished and remaining unpaid amounts to SIX THOUSAND SEVEN HUNDRED FIFTY AND 00/100 Gold Sovereigns (6,750.00 GP), which sum is wholly DELINQUENT. Payment demands were submitted on February 1, 2027, and February 28, 2027, and both were refused by the property owner.",
            "This lien is filed timely under the Grand Duchy Subterranean Construction Lien Act, and Affiant hereby claims a valid mechanic's lien upon the property and all improvements thereon, including the newly constructed smelting facility, for the full delinquent amount stated herein. The lien amount is itemized in Schedule A attached hereto.",
        ],
        "schedule_a": [
            ("50", "Masterwork Steel Forge Plates", "50.00 GP", "2,500.00 GP"),
            ("8", "Adamantine-Lined Smelting Crucibles", "375.00 GP", "3,000.00 GP"),
            ("20", "Precision Heat Baffles & Flues", "37.50 GP", "750.00 GP"),
            ("6", "Automated Bellows Mechanisms", "62.50 GP", "375.00 GP"),
            ("-", "Master Metalsmith Labor (500 hrs)", "0.25 GP/hr", "125.00 GP"),
        ],
        "lien_total": "6,750.00 GP",
    },
    {
        "file_num": "26-011689", "title": "TRUSTEE'S DEED", "doc_type": "DEED",
        "last_name": "GODEN BOULDERBACK TRUST", "first_name": "", "index": "DEED", "sat": "",
        "amount": "1,500.00 Gold Sovereigns", "status": "RECORDED",
        "z_level": "Z-33 (Boulderback Estate Sector)", "book": "1376", "page_num": 177,
        "inst": "2027-011689", "fee": "75.00 GP", "record_date": "03/09/2027",
        "grantor": "GODEN BOULDERBACK, TRUSTEE",
        "grantee": "GODEN BOULDERBACK TRUST",
        "claim_id": "CLM-689-BOULD",
        "body_paragraphs": [
            "THIS TRUSTEE'S DEED, made this 9th day of March, 2027, between GODEN BOULDERBACK, an individual acting in the capacity of Trustee of the GODEN BOULDERBACK TRUST, a revocable living trust established under the laws of the Grand Duchy of Eldoria, pursuant to a Declaration of Trust dated January 15, 2025, hereinafter Grantor-Trustee, and the GODEN BOULDERBACK TRUST, hereinafter Grantee-Trust.",
            "FOR THE CONSIDERATION of One Gold Sovereign (1.00 GP) and the transfer of the property into the trust estate for estate planning and asset protection purposes, Grantor-Trustee does hereby grant, transfer, and convey to the GODEN BOULDERBACK TRUST all right, title, and interest in that certain subterranean parcel situated at Z-33 in the Boulderback Estate Sector, more particularly described as Parcel CLM-689-BOULD, comprising approximately 62,000 cubic dwarven spans of developed underground residential and agricultural property.",
            "THIS CONVEYANCE is made for the fair market value consideration of One Thousand Five Hundred (1,500.00) Gold Sovereigns, representing the assessed value of the property as determined by the Grand Duchy Office of Subterranean Property Valuation. The conveyance is made for no consideration other than the orderly transfer of property into the trust estate as part of the Grantor-Trustee's estate plan.",
            "THE TRUST shall hold the property subject to all existing easements, restrictions, covenants, and rights-of-way of record. The Trustee is authorized under the trust declaration to manage, encumber, convey, and otherwise deal with the trust property in accordance with the terms of the Declaration of Trust, and this Deed is executed pursuant to that authority.",
        ],
    },
    {
        "file_num": "26-011872", "title": "NOTICE OF COMMENCEMENT", "doc_type": "NTC",
        "last_name": "ZULBAN TUNNELWORKS LLC", "first_name": "", "index": "NTC", "sat": "",
        "amount": "25.00 Gold Sovereigns", "status": "RECORDED",
        "z_level": "Z-92 (New Tunnelworks Extension)", "book": "1376", "page_num": 211,
        "inst": "2027-011872", "fee": "10.00 GP", "record_date": "03/11/2027",
        "grantor": "ZULBAN TUNNELWORKS LLC",
        "grantee": "N/A",
        "claim_id": "CLM-872-TUNN",
        "body_paragraphs": [
            "THIS NOTICE OF COMMENCEMENT, made this 11th day of March, 2027, by ZULBAN TUNNELWORKS LLC, a limited liability company organized and existing under the laws of the Grand Duchy of Eldoria, hereinafter Owner, gives notice of commencement of construction and improvement of real property as required by the Grand Duchy Subterranean Construction Lien Act.",
            "OWNER hereby provides notice that construction has commenced or will imminently commence on the property known as Parcel CLM-872-TUNN, situated at Z-92 in the New Tunnelworks Extension sector of the Grand Duchy of Eldoria, for the purpose of excavating and constructing a new tunnel network system including access corridors, ventilation shafts, support pillars, drainage channels, and associated infrastructure.",
            "THE GENERAL CONTRACTOR for said construction is Deepbore Engineering Associates, License No. GDE-5512, whose address for lien purposes is Level Z-10, Engineers' Quarter, Grand Duchy of Eldoria. The expected total cost of construction is Twenty-Five (25.00) Gold Sovereigns for the first phase of development, with additional phases to be announced by separate notice. Construction is expected to commence on March 15, 2027.",
            "THIS NOTICE IS FILED pursuant to Article 8 of the Grand Duchy Subterranean Construction Lien Act for the purpose of protecting the Owner's interest and limiting lien rights to those contractors who serve proper notice in accordance with the statute. All persons furnishing labor, services, or materials to the above-described property shall serve a copy of their Notice to Owner upon the undersigned within 45 days of first furnishing such labor, services, or materials.",
        ],
    },
]


class EldoriaRODPDF(FPDF):
    def __init__(self, book, page_num, inst_num, fee, record_date):
        super().__init__()
        self.book = book
        self.page_num = page_num
        self.inst_num = inst_num
        self.fee = fee
        self.record_date = record_date

    def header(self):
        self.set_font("Courier", "B", 9)
        self.set_xy(110, 10)
        self.cell(90, 4, "FILED, RECORDED, INDEXED", 0, 1, "R")
        self.set_x(110)
        self.cell(90, 4, f"Date: {self.record_date}  Time: 09:00:00", 0, 1, "R")
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


def _base_header(pdf, rec):
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, rec["title"], 0, 1, "C")
    pdf.ln(3)
    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 6, f"Claim / Parcel ID: {rec['claim_id']}", 0, 1, "L")
    pdf.cell(0, 6, f"Z-Level / Address: {rec['z_level']}", 0, 1, "L")
    pdf.ln(4)


def _notary_block(pdf):
    pdf.ln(8)
    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 6, "NOTARY ACKNOWLEDGMENT", 0, 1, "L")
    pdf.set_font("Arial", "", 10)
    pdf.multi_cell(0, 5,
        "STATE OF ELDORIA, COUNTY OF THE DEEP\n"
        "Before me, the undersigned Notarial Magistrate, personally appeared the person(s) "
        "whose name(s) appear above, known to me to be the person(s) who executed the "
        "foregoing instrument, and acknowledged that they executed the same for the purposes "
        "therein stated.\n"
        "Sworn and subscribed before me this _____ day of _____________, 20___."
    )
    pdf.ln(5)
    pdf.cell(80, 8, "___________________________________", 0, 1, "L")
    pdf.cell(80, 5, "Notarial Magistrate, Grand Duchy of Eldoria", 0, 1, "L")
    pdf.cell(80, 5, "Commission Expires: 12/31/2030", 0, 1, "L")


def _signature_block(pdf, grantor_label, grantee_label):
    pdf.ln(10)
    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 6, "SIGNED, SEALED AND DELIVERED IN THE PRESENCE OF:", 0, 1, "L")
    pdf.ln(8)
    pdf.set_font("Arial", "", 10)
    pdf.cell(80, 8, "___________________________________", 0, 0, "L")
    pdf.cell(30, 8, "", 0, 0, "C")
    pdf.cell(80, 8, "___________________________________", 0, 1, "L")
    pdf.cell(80, 5, "Witness #1", 0, 0, "L")
    pdf.cell(30, 5, "", 0, 0, "C")
    pdf.cell(80, 5, grantor_label, 0, 1, "L")
    pdf.ln(8)
    pdf.cell(80, 8, "___________________________________", 0, 0, "L")
    pdf.cell(30, 8, "", 0, 0, "C")
    pdf.cell(80, 8, "___________________________________", 0, 1, "L")
    pdf.cell(80, 5, "Witness #2 (Magistrate)", 0, 0, "L")
    pdf.cell(30, 5, "", 0, 0, "C")
    pdf.cell(80, 5, grantee_label, 0, 1, "L")


def create_deed(rec):
    pdf = EldoriaRODPDF(rec["book"], rec["page_num"], rec["inst"], rec["fee"], rec["record_date"])
    pdf.add_page()
    _base_header(pdf, rec)

    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 6, "LEGAL DESCRIPTION", 0, 1, "L")
    pdf.set_font("Arial", "", 10)
    pdf.multi_cell(0, 5,
        f"All that certain tract or parcel of subterranean real property situated in the "
        f"Grand Duchy of Eldoria, identified as Parcel {rec['claim_id']}, located at "
        f"{rec['z_level']}, bounded on all sides by the natural rock formations of said "
        f"Z-level sector, together with all mineral rights, subsoil interests, and "
        f"appurtenances thereto belonging or in anywise appertaining. Cubic footage: "
        f"approximately 40,000 cubic dwarven spans of improved subterranean property."
    )
    pdf.ln(4)

    pdf.set_font("Arial", "", 11)
    for para in rec["body_paragraphs"]:
        pdf.multi_cell(0, 6, para)
        pdf.ln(3)

    _signature_block(pdf, f"Grantor: {rec['grantor']}", f"Grantee: {rec['grantee']}")
    _notary_block(pdf)
    pdf.output(os.path.join(output_dir, f"{rec['file_num']}.pdf"))


def create_mortgage(rec):
    pdf = EldoriaRODPDF(rec["book"], rec["page_num"], rec["inst"], rec["fee"], rec["record_date"])
    pdf.add_page()
    _base_header(pdf, rec)

    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 6, "LEGAL DESCRIPTION OF MORTGAGED PREMISES", 0, 1, "L")
    pdf.set_font("Arial", "", 10)
    pdf.multi_cell(0, 5,
        f"All that certain subterranean parcel identified as {rec['claim_id']}, situated "
        f"at {rec['z_level']}, comprising all improvements, fixtures, and appurtenances "
        f"thereto belonging, together with all mineral rights appurtenant to said parcel "
        f"not previously reserved of record."
    )
    pdf.ln(4)

    pdf.set_font("Arial", "", 11)
    for para in rec["body_paragraphs"]:
        pdf.multi_cell(0, 6, para)
        pdf.ln(3)

    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 6, "UNIFORM COVENANTS", 0, 1, "L")
    pdf.set_font("Arial", "", 10)
    covenants = [
        "1. INSURANCE. Mortgagor shall keep all improvements insured against fire, cave-in, magma incursion, and Forgotten Beast attacks.",
        "2. MAINTENANCE. Mortgagor shall maintain all fortifications, supports, and drainage in good repair and shall not permit deterioration.",
        "3. HAZARD EVENTS. Upon occurrence of any hazard event, Mortgagor shall promptly notify Mortgagee and provide a written remediation plan.",
        "4. ACCELERATION. Upon any default, Mortgagee may declare the entire indebtedness immediately due and payable without further notice.",
        "5. ASSIGNMENT. Mortgagee may assign this Mortgage and the underlying note to any successor holder without Mortgagor's consent.",
        "6. COMPLIANCE. Mortgagor shall comply with all applicable Grand Duchy mining safety and subterranean use regulations.",
    ]
    for cov in covenants:
        pdf.multi_cell(0, 5, cov)
        pdf.ln(2)

    if rec.get("sat") == "SAT":
        pdf.ln(8)
        pdf.set_font("Arial", "B", 14)
        pdf.set_text_color(0, 0, 200)
        pdf.cell(0, 10, "** SATISFIED IN FULL -- LIEN DISCHARGED **", 0, 1, "C")
        pdf.set_font("Arial", "", 10)
        pdf.set_text_color(0, 0, 0)
        pdf.multi_cell(0, 5,
            "This mortgage has been paid in full. The Mortgagee hereby releases, "
            "discharges, and cancels this mortgage lien. All obligations of the "
            "Mortgagor hereunder are extinguished and of no further force or effect."
        )

    _signature_block(pdf, f"Mortgagor: {rec['grantor']}", f"Mortgagee: {rec['grantee']}")
    _notary_block(pdf)
    pdf.output(os.path.join(output_dir, f"{rec['file_num']}.pdf"))


def create_lien(rec):
    pdf = EldoriaRODPDF(rec["book"], rec["page_num"], rec["inst"], rec["fee"], rec["record_date"])
    pdf.add_page()
    _base_header(pdf, rec)

    pdf.set_font("Arial", "B", 11)
    pdf.cell(0, 6, "STATE OF ELDORIA", 0, 1, "C")
    pdf.cell(0, 6, "COUNTY OF THE DEEP", 0, 1, "C")
    pdf.ln(3)

    pdf.set_font("Arial", "", 11)
    for para in rec["body_paragraphs"]:
        pdf.multi_cell(0, 6, para)
        pdf.ln(3)

    pdf.ln(4)
    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 8, "SCHEDULE A: ALLOCATED MATERIALS & LABOR", 0, 1, "L")

    pdf.set_fill_color(220, 220, 220)
    pdf.cell(20, 8, "QTY", 1, 0, "C", fill=True)
    pdf.cell(90, 8, "DESCRIPTION", 1, 0, "C", fill=True)
    pdf.cell(40, 8, "UNIT PRICE", 1, 0, "C", fill=True)
    pdf.cell(40, 8, "TOTAL", 1, 1, "C", fill=True)

    pdf.set_font("Courier", "", 10)
    for qty, desc, unit, total in rec["schedule_a"]:
        pdf.cell(20, 8, qty, 1, 0, "C")
        pdf.cell(90, 8, desc, 1, 0, "L")
        pdf.cell(40, 8, unit, 1, 0, "R")
        pdf.cell(40, 8, total, 1, 1, "R")

    pdf.set_font("Arial", "B", 10)
    pdf.cell(150, 8, "TOTAL DELINQUENT AMOUNT:", 1, 0, "R")
    pdf.cell(40, 8, rec["lien_total"], 1, 1, "R")

    pdf.ln(8)
    pdf.set_font("Arial", "B", 11)
    pdf.set_text_color(180, 0, 0)
    pdf.cell(0, 8, f"DELINQUENT AMOUNT: {rec['amount']}", 0, 1, "C")
    pdf.set_text_color(0, 0, 0)

    pdf.ln(5)
    pdf.set_font("Arial", "", 10)
    pdf.cell(80, 8, "___________________________________", 0, 1, "L")
    pdf.cell(80, 5, f"Affiant: {rec['grantor']}", 0, 1, "L")

    _notary_block(pdf)
    pdf.output(os.path.join(output_dir, f"{rec['file_num']}.pdf"))


def create_affidavit(rec):
    pdf = EldoriaRODPDF(rec["book"], rec["page_num"], rec["inst"], rec["fee"], rec["record_date"])
    pdf.add_page()
    _base_header(pdf, rec)

    pdf.set_font("Arial", "B", 11)
    pdf.cell(0, 6, "STATE OF ELDORIA", 0, 1, "C")
    pdf.cell(0, 6, "COUNTY OF THE DEEP", 0, 1, "C")
    pdf.ln(3)

    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 6, "LEGAL DESCRIPTION OF SUBJECT PROPERTY", 0, 1, "L")
    pdf.set_font("Arial", "", 10)
    pdf.multi_cell(0, 5,
        f"Real property identified as Parcel {rec['claim_id']}, situated at "
        f"{rec['z_level']}, in the Grand Duchy of Eldoria, as more particularly "
        f"described in the deed of record at Book 1369, Page 44, Registry of Deeds."
    )
    pdf.ln(4)

    pdf.set_font("Arial", "", 11)
    for para in rec["body_paragraphs"]:
        pdf.multi_cell(0, 6, para)
        pdf.ln(3)

    pdf.ln(5)
    pdf.set_font("Arial", "", 10)
    pdf.cell(80, 8, "___________________________________", 0, 1, "L")
    pdf.cell(80, 5, f"Affiant: {rec['grantor']}", 0, 1, "L")

    _notary_block(pdf)
    pdf.output(os.path.join(output_dir, f"{rec['file_num']}.pdf"))


GENERATORS = {
    "DEED": create_deed,
    "ESMT": create_deed,
    "ASGN": create_deed,
    "REL": create_deed,
    "NTC": create_deed,
    "MTG": create_mortgage,
    "LIEN": create_lien,
    "AFF": create_affidavit,
}

if __name__ == "__main__":
    for rec in RECORDS:
        GENERATORS[rec["doc_type"]](rec)
        print(f"  Generated {rec['file_num']}.pdf  ({rec['title']})")
    print(f"\nSuccessfully generated {len(RECORDS)} PDFs in {output_dir}/")
