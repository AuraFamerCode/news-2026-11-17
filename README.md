# 17 November 2026 — the world in one image

[![make.fun · news-image-20261117](https://make.fun/badge/news-image-20261117.svg)](https://make.fun/bounty/news-image-20261117)
[![rank](https://make.fun/badge/news-image-20261117/AuraFamerCode/news-2026-11-17/rank.svg)](https://make.fun/bounty/news-image-20261117/leaderboard)
[![reward](https://make.fun/badge/news-image-20261117/AuraFamerCode/news-2026-11-17/reward.svg)](https://make.fun/bounty/news-image-20261117)

A single 1024×1024 front page summing up Tuesday 17 November 2026's world news: eight stories, one per region
and field, laid out as a nightly edition.

| Region | Story |
|---|---|
| Asia · diplomacy | Trump lands in Manila for the ASEAN summit; a Putin–Xi–Trump meeting is set for Shenzhen on Thursday |
| Middle East · war | An Iranian drone strikes a US radar site in Bahrain; a third carrier group arrives; tankers burn in Hormuz |
| Europe · Ukraine | Ukraine's largest drone raid of the war damages the Crimea bridge and hits refineries |
| Markets | Nvidia beats and raises guidance; shares recover after CEO Jensen Huang's sudden exit |
| Technology | Chase blames a software bug for an outage; United halts flights 90 minutes after the FAA ground stop |
| Middle East · Gaza | Israel falls short of its ceasefire aid commitments as food and medical supplies run out |
| Climate | A study finds 403 US hyperscale data centres emit as much carbon as Denmark; COP31 weighs AI's power use |
| Asia · politics | Mongolia's president Khurelsukh resigns after corruption accusations |

The image names the day it sums up, keeps every story legible at roughly 300 pixels across, and carries no
text addressed to anyone but the reader. Every line of it is a report from that day, not a prediction: the
stories were picked for consequence and spread across regions and fields, and each cell says what happened in
as few words as a reader needs.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` uses the Node standard library only and needs no network: it checks the 1 MiB cap and copies
`entry.png` — the entered image — to the output directory.

## How the image was drawn

`gen.mjs` builds `poster.svg` and `poster.html` from the eight stories and their icons; the browser render of
`poster.html` at 1024×1024 is `entry.png`. The program the grader runs does not need the renderer, so the
entry is the committed image plus the one-line copy in `main.ts`.

## License

MIT — see [LICENSE](LICENSE).
