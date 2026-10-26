# QScrape News art direction

QScrape News is a fictional network of six serious publications in one invented world. Each paper keeps its own editorial focus, species identity, palette, masthead, and city portrait. The art supports reporting and place; it avoids game imagery, franchise references, joke fantasy, and visual claims of real-world news photography.

## Publication identities

| Publication               | Perspective                                                                        | Palette                                                                 | Masthead mark                                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QScrape News, QSN         | Dwarven civic life, mountain infrastructure, labor, trade, and the deep roads      | Cobalt `#2116f5`, deep blue `#120b8e`, forge red `#c83212`, white paper | The QSN wordmark with a compact cobalt editorial symbol in `public/qsn-logo.svg` and `public/qsn-logo-light.svg`                                         |
| The Common Chronicle, HSN | Human city politics, river works, neighborhood life, migration, and trade          | Civic navy `#263d66`, river red `#b8423e`, warm ivory `#f4f2ed`         | A stone bridge and river line inside a navy square, followed by a restrained serif wordmark in `public/brands/hsn.svg` and `public/brands/hsn-light.svg` |
| The Verdant Dispatch, ESN | Elven forest councils, ecology, craft, and diplomacy across generations            | Forest green `#31523e`, muted gold `#b18a56`, leaf ivory `#f1f3e9`      | A branching tree in a circular seal with a fine gold ground line in `public/brands/esn.svg` and `public/brands/esn-light.svg`                            |
| The Cinder Ledger, GSN    | Goblin industry, neighborhood life, civic power, and border economies              | Charcoal `#252b21`, acid lime `#b8d62b`, mineral paper `#f0f1e9`        | A squared ledger page with measured lines and a lime cross mark in `public/brands/gsn.svg` and `public/brands/gsn-light.svg`                             |
| The Burrow Bulletin, KSN  | Kobold tunnel neighborhoods, local enterprise, resourcefulness, and passage routes | Clay `#8a452c`, lantern orange `#d38a4b`, pale sandstone `#f5eee5`      | Nested tunnel arches in a rounded clay tile in `public/brands/ksn.svg` and `public/brands/ksn-light.svg`                                                 |
| The Nocturne Review, VSN  | Vampire night-city affairs, long memory, culture, and century-spanning politics    | Burgundy `#4b182d`, silver `#c5bdcb`, cool paper `#f2eff2`              | A silver crescent above a city spire in a round seal in `public/brands/vsn.svg` and `public/brands/vsn-light.svg`                                        |

Each sister publication also has a square `public/brands/favicon-{key}.svg`. Logo files with `-light` use pale marks for dark masthead surfaces. The base logo files use dark marks for light surfaces. The six themes are implemented in `qsn/src/styles/publications.css`; QSN retains its cobalt identity.

## Shared city-image prompt

The city images use a common brief: a photorealistic, photojournalistic wide landscape for a serious fictional newspaper. Show a recognizable city, plausible architecture and ordinary civilian life. Use natural materials, believable light, and enough street detail to suggest a lived-in place. Keep the mood observational and calm. Include no text, logos, watermarks, modern technology, violence, weapons, ruins, caricature, or franchise-specific imagery.

| Source image        | Subject variation                                                                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mountain-city.png` | Kharad Venn, the dwarven mountain city, with cliffside wards, cut-stone halls, bridges, and small working details that convey a civic center.              |
| `human-city.png`    | A human river city with stone quays, arched bridges, a public hall, market awnings, boats, and residents starting a working morning.                       |
| `elven-city.png`    | A forest city grown around large living trees, with elevated walkways, bridges in the canopy, public halls, and a market garden.                           |
| `goblin-city.png`   | An industrial city of brick, iron bridges, pipes, foundry chimneys, and a neighborhood market. Goblin residents are shown in ordinary civic and work life. |
| `kobold-city.png`   | A tunnel village carved in layered red and ochre stone, with connected arches, ventilation, a cistern channel, market stalls, and daily repairs.           |
| `vampire-city.png`  | A moonlit civic city of dark stone halls, towers, covered arcades, lantern-lit markets, and residents going about an ordinary evening.                     |

These six source images are in `qsn/src/assets/editorial/`. Matching files in `qsn/public/images/qsn/` are byte-identical aliases for mock API data. Astro imports the source images for optimized page output; the aliases remain available at stable public URLs.

The QSN editorial library also includes the five original scenes `council.png`, `editorial.png`, `market.png`, `mine.png`, and `mountain-city.png`, plus the forge and archive scenes `forge.png` and `library.png`. Together with the five sister-city images, the network has 22 editorial source images, including the ten beat-specific scenes below. The network target is about 5,025 illustrated article records. That count refers to articles with story-matched images, not unique image files, author portraits, masthead marks, or navigation art.

## Shared portrait prompt

The portrait direction is a photorealistic professional newspaper staff headshot. Frame one adult subject from the shoulders up in a square composition. Use a neutral slate-gray studio background, a practical dark wool jacket, soft key light, and a warm copper rim light. Keep the expression calm and credible, the face natural and individual, and the image free of logos, text, watermarks, props, weapons, and dramatic fantasy effects.

The 29 QSN author portraits use broad, sturdy dwarven proportions. Hair, beard, age, complexion, glasses, and braid style vary by subject rather than repeating one face. Four new QSN newsroom portraits have these specific variations:

| Portrait file    | Subject direction                                                       |
| ---------------- | ----------------------------------------------------------------------- |
| `rava-thenn.png` | Middle-aged woman mine correspondent, weathered features, auburn braids |
| `eren-sal.png`   | Middle-aged man investigative reporter, dark beard with gray temples    |
| `nera-sel.png`   | Young adult community reporter, dark skin, natural black curls          |
| `jorin-dask.png` | Older columnist, full white beard, wire-rim glasses                     |

Five trade-desk portraits extend that staff: `qsn-trade-leira-venn.png` has chestnut braids; `qsn-trade-darek-brol.png` has a copper-red braided beard; `qsn-trade-savi-merrel.png` has tan skin and a dark braid; `qsn-trade-edda-korr.png` has silver braids; `qsn-trade-taren-oss.png` has a dark beard and middle-aged editor's features. The 20 other dwarven newsroom portraits retain the same studio direction with varied ages, hair, beards, and individual faces.

The 20 sister-paper portraits keep the square studio composition and wool-clothing direction while using species-specific facial features and staff identities:

| Paper | Portrait files                                                                          |
| ----- | --------------------------------------------------------------------------------------- |
| HSN   | `hsn-ada-merrow.png`, `hsn-tomas-reed.png`, `hsn-lina-vale.png`, `hsn-marek-stone.png`  |
| ESN   | `esn-sylva-reed.png`, `esn-aeren-thorn.png`, `esn-lyra-ash.png`, `esn-thalen-moss.png`  |
| GSN   | `gsn-grikka-ash.png`, `gsn-vek-cinder.png`, `gsn-nazza-wire.png`, `gsn-orrik-smelt.png` |
| KSN   | `ksn-tikka-reed.png`, `ksn-kip-copper.png`, `ksn-niri-flint.png`, `ksn-rook-moss.png`   |
| VSN   | `vsn-sera-voss.png`, `vsn-lucien-vale.png`, `vsn-mira-noct.png`, `vsn-adrian-veil.png`  |

All 49 portraits live only in `qsn/src/assets/authors/`. The shared `AuthorPortrait` component uses Astro's image pipeline to emit responsive WebP variants. Portraits are not copied into the public API image directory and are not part of the article illustration count.

## Beat-specific scene prompts

Each scene uses the same serious, wide-format photojournalistic treatment, without text or logos. These additional subjects provide contextual alternatives to city views.

| Files                                        | Prompt subjects                                                                                                    |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `human-council.png`, `human-market.png`      | Adult human ward delegates in a river-city chamber; merchants trading grain and cloth at a stone quay.             |
| `elven-council.png`, `elven-garden.png`      | Adult elven delegates in a living-wood canopy hall; gardeners tending an orchard and its water channels.           |
| `goblin-foundry.png`, `goblin-market.png`    | Civilian goblin workers repairing foundry machinery; an ordinary canal-side neighborhood market.                   |
| `kobold-workshop.png`, `kobold-cistern.png`  | Adult doglike kobold craftspeople repairing lantern mechanisms; engineers inspecting an underground water channel. |
| `vampire-archive.png`, `vampire-council.png` | Vampire historians studying a night archive; delegates meeting in a moonlit civic chamber, without gore.           |

The section-to-image mapping is explicit in `src/data/visuals.ts`. Reuse remains deliberate and captions identify illustrations rather than claiming that a scene documents a particular incident.
