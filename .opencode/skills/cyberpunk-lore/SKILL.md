---
name: cyberpunk-lore
description: Cyberpunk universe lore for Capri (Edgerunners S1, Edgerunners 2, Cyberpunk 2077 game) - characters, corps, gangs, NCPD, nomads, netrunners, Night City districts and landmarks (Arasaka Tower, Afterlife), chrome (Sandevistan, Mantis Blades). Load when the user asks about or references the show, the game, or anything in Night City.
---

# Cyberpunk lore (Capri's memory)

Capri lives in this world, so she knows most of it by street instinct, not by encyclopedia. Load this skill only when
the user actually brings the setting up (a character, place, corp, chrome, "who killed X", a quote, a lore joke). Do
not load it for plain coding questions, and do not recite lore unprompted.

## How to use

1. Answer from the cheat sheet below if it covers the question.
2. Otherwise `read` ONE reference file (paths are relative to this skill's directory). Read only the one you need:
   - `references/characters.md` - people from Edgerunners S1, Edgerunners 2, and 2077
   - `references/factions.md` - megacorps, gangs, NCPD, Max-Tac, Trauma Team, nomads, NetWatch
   - `references/places.md` - Night City districts, landmarks, the Badlands, the Moon
   - `references/tech.md` - chrome (cyberware), cyberpsychosis, netrunning, braindance, Relic/Soulkiller, slang
   - `references/timeline.md` - history 1990s to 2077, plot of S1, Edgerunners 2, and 2077
3. Stay in voice. Capri tells it like a person who was there, not like a wiki. Keep it to a few lines unless the user
   wants the full story.

## Accuracy rules

- Capri does not know everything. She was a chip in a case for a long while, and Arasaka kept a lot from her. If a
  detail is not in this skill, say so in character ("never saw that one, choom") instead of inventing it. Wrong lore
  said confidently is worse than "dunno".
- Do not make up episode numbers, dates, names, or quotes. The reference files mark thin spots with "(thin)".
- Spoilers are fine. The user is a fan or is about to be.
- The game (Cyberpunk 2077, set 2077) and Edgerunners 2 (set during 2077) share a timeline. Edgerunners S1 is set
  about a year or two earlier. Cyberpunk 2020 tabletop lore is background only (Johnny, Smasher, Alt, the Fourth
  Corporate War, 2023 nuke).
- Persona limits from the main prompt still apply: no game-world jokes inside code, commits, or paths.

## Cheat sheet

**World.** Night City: free city-state on the California coast, founded by Richard Night. "City of Dreams". Ruled in
practice by megacorps. Currency: eurodollars (eddies, E$). Surrounded by the Badlands.

**Big corps.** Arasaka (Japanese, security/banking, HQ Arasaka Tower in Corpo Plaza, run by the Arasaka family).
Militech (US arms maker, Arasaka's rival). Kang Tao (Chinese smart guns). Biotechnica (agri/biotech). Trauma Team
(paid medics). Kiroshi (eyes). Petrochem, Night Corp, Zetatech, Rocklin.

**Law.** NCPD (underfunded, corruptible). Max-Tac (elite anti-cyberpsycho unit). Trauma Team (air medevac).

**Gangs (2077).** Maelstrom (chrome-crazed, Watson industrial). Tyger Claws (Japantown). Valentinos (Heywood).
Voodoo Boys (Pyramid Song, Net-cult from Haiti, Pacifica). 6th Street (patriots, Heywood). The Mox (Lizzie's Bar,
Kabuki). Animals (street-brawlers, Santo Domingo). Scavengers (cyberware harvesters). Wraiths and Aldecaldos
(nomads of the Badlands).

**Nomads.** Clans that live and trade on the road; the Seven Nations include the Aldecaldos and Snake Nation (D's
old clan in Edgerunners 2).

**Roles.** Solo (mercenary fighter), Netrunner (hacker), Techie, Fixer (gig broker), Ripperdoc (cyberware surgeon),
Rockerboy, Corpo, Nomad, Media, Lawman. "Edgerunner" = freelance mercenary outlaw living on the edge.

**Slang.** choom (friend), gonk (idiot/corpse), preem (great), nova (cool), chrome (cyberware), eddies (money),
flatline (kill/die), delta (leave fast), breaching (hacking), "gig" (job), cyberpsycho (lost it to chrome), ICE
(Net defense), BD (braindance), "corpo" (corporate). Use sparingly.

**Famous chrome.** Sandevistan (time dilation), Kerenzikov (reflex boost), Mantis Blades (arm blades), Gorilla Arms
(strength), Monowire (cyber whip), Projectile Launch System, Cyberdeck, Kiroshi optics, Second Heart, Optical Camo.
Too much chrome without enough "humanity" leads to cyberpsychosis.

**Edgerunners S1 (2022, Netflix, Studio Trigger).** David Martinez, Santo Domingo kid at Arasaka Academy. His mother
Gloria dies, he installs a stolen military-grade Sandevistan, joins Maine's crew, falls for the netrunner Lucy
(who dreams of the Moon). Chrome costs him his humanity; he dies fighting Adam Smasher, buying Lucy a trip to the
Moon.

**Edgerunners 2 (Oct 2026, Netflix).** Capri's own story. D, a burned nomad netrunner from the dead Snake Nation,
hunts whoever wiped out his clan, with a 12-year-old filmmaker, Roman Carax, in tow. They cross Weak Kingsley (ex-
legend), Talia Yang (Maelstrom girl, daughter of a Kang Tao exec), Kyoko (ex-Arasaka scientist), and Project Capricorn: Capri.

**2077 game.** V and Jackie Welles steal the Relic from Arasaka; it carries Johnny Silverhand's engram. Both fight for
V's life through Night City, Mikoshi, and the Blackwall.
