# 🎬 File Under Mystery — Trailer Mini-Game Guide & Asset Pipelines

---

## 📌 Official Event Details Configured

- **Event**: `FILE UNDER MYSTERY`
- **Club**: `Mathematics Club`
- **Date**: `03/09/2026`
- **Venue**: `AB3 - 301`
- **Timings**: `11:00 AM – 04:00 PM`
- **Registration Form**: Configure in [`apps/trailer/src/config/trailerConfig.js`](file:///c:/Personal/VIT/Maths%20Club/Events/File%20Under%20Mystery/apps/trailer/src/config/trailerConfig.js) (`registrationUrl`)

---

## 🖼️ 1. Google Flow Image Prompt & Embedding (Level 01)

### 🎨 Recommended Google Flow / Midjourney / DALL-E Prompt:
```text
CCTV surveillance capture at 3:14 AM outside a brutalist university science building (Academic Block 3), dark night atmosphere, eerie security camera grain, dramatic moonlight casting shadows over concrete pathways and dense trees, cinematic noir thriller style, low exposure, photorealistic 8k --ar 16:9
```

### 🛠️ How to Embed Any Custom Image:
Once you have generated your image:
1. Save it to `apps/trailer/public/evidence/my_raw_image.png`
2. Run the embedding script:
```powershell
python content-pipeline/embed_custom_trailer_image.py --input apps/trailer/public/evidence/my_raw_image.png --output apps/trailer/public/evidence/trailer_surveillance.png --code M47H9
```
*(Default Level 1 Answer: `M47H9`)*

---

## 🎧 2. Audio Generation (Level 02)

The Level 2 audio track is synthesized at:
👉 `apps/trailer/public/evidence/trailer_beacon.wav`

It contains atmospheric low-frequency noise masking high-pitch continuous Morse beeps at $2400\text{ Hz}$.
- **Morse Sequence**: `-` `...--` `....-` `...` `..---`
- **Default Level 2 Answer**: `T34S2`

To re-generate or change the answer code:
```powershell
python content-pipeline/generate_trailer_level2_audio.py
```

---

## 🎙️ 3. Studio Voice Narration (100% Text Matched)

All neural audio voice files have been generated with 1-to-1 word alignment in:
👉 `apps/trailer/public/audio/`

| Audio File | Exact Spoken Narration Text |
| :--- | :--- |
| `prologue_0.mp3` | *"October 14, 2026. Department of Theoretical Mathematics."* |
| `prologue_1.mp3` | *"A classified signal has breached the departmental network."* |
| `prologue_2.mp3` | *"Dr. Elias Marrow vanished thirty-seven days ago, leaving behind an encrypted black box."* |
| `prologue_3.mp3` | *"Before the uplink severed, two teaser telemetry files were transmitted."* |
| `prologue_4.mp3` | *"Your terminal has intercepted these opening anomalies."* |
| `prologue_5.mp3` | *"Analyze the evidence, recover the hidden passcodes, and prepare for what lies ahead."* |
| `briefing_level1_0.mp3` | *"Teaser Anomaly One: The Surveillance Negative."* |
| `briefing_level1_1.mp3` | *"Recovered from a damaged sensor node outside Academic Block 3."* |
| `briefing_level1_2.mp3` | *"The image was captured in pitch darkness and seems completely empty."* |
| `briefing_level1_3.mp3` | *"Stretch the dynamic range histogram to expose the hidden code."* |
| `briefing_level2_0.mp3` | *"Teaser Anomaly Two: The Intercepted Beacon."* |
| `briefing_level2_1.mp3` | *"An anomalous radio transmission broadcast across the campus relay."* |
| `briefing_level2_2.mp3` | *"A low-frequency acoustic disturbance masks a high-pitch telegraph carrier."* |
| `briefing_level2_3.mp3` | *"Tune the audio bandpass filter to isolate the Morse sequence."* |

To regenerate voices at any time:
```powershell
python content-pipeline/generate_trailer_voices.py
```

---

## 🚀 4. Running the Trailer

```powershell
cd "apps/trailer"
npm run dev
```
Open **http://localhost:3001**
