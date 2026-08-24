/**
 * ============================================================================
 * FILE UNDER MYSTERY // INVESTIGATION PORTAL CONFIGURATION
 * ============================================================================
 */

export const TRAILER_CONFIG = {
  // 1. OFFICIAL EVENT DETAILS & REGISTRATION
  mainEvent: {
    title: "FILE UNDER MYSTERY",
    subtitle: "The Marrow Protocol // 12-Tier Forensic Anomaly Investigation",
    clubName: "Mathematics Club",
    eventDate: "03/09/2026",
    eventTime: "11:00 AM - 04:00 PM",
    venue: "AB3 - 301",
    teamSize: "1 to 3 Investigators per Team",
    prizePool: "Exciting Cash Prizes & Official Forensics Certification",
    registrationUrl: "https://chennaievents.vit.ac.in/technovit/",
    instagramUrl: "https://instagram.com/vitmathsclub",
    discordUrl: "https://discord.gg/vitmathsclub",
    registrationSteps: [
      { step: "01", title: "Open TechnoVIT Portal", text: "Click the registration button to navigate to the official TechnoVIT event portal." },
      { step: "02", title: "Login / Authenticate", text: "Sign in with your VIT student credentials (or register as an external participant)." },
      { step: "03", title: "Search Event", text: "Search for 'File Under Mystery' listed under the Mathematics Club category." },
      { step: "04", title: "Confirm Team", text: "Add your team members and complete your registration slot." }
    ]
  },

  // 2. CINEMATIC PROLOGUE LINES (100% Matched With Female Studio Voice)
  prologueLines: [
    "October 14, 2026. Department of Mathematics.",
    "Dr. Elias Marrow vanished thirty-seven days ago, leaving behind a locked air-gapped terminal.",
    "Before the campus network severed, two anomalous signal traces surfaced.",
    "A proof is not given; it is earned. Enter the frequency space to uncover what lies in the noise."
  ],

  // 3. INVESTIGATION LEVELS
  levels: {
    level1: {
      id: "level1",
      nextLevelId: "level2",
      title: "Evidence Item #01: The Surveillance Negative",
      evidenceType: "image",
      evidenceFile: "/evidence/trailer_surveillance.png",
      storyBriefing: [
        "Timestamp: 03:14 AM. Closed-circuit camera intercept outside Academic Block 3.",
        "Campus security logs confirm an anomaly occurred right before the blackout.",
        "Where human eyes see only empty shadows, the sensor matrix captured lingering luminance.",
        "Look where the light fails to discover what Marrow concealed in the dark."
      ],
      tools: ["brightness", "contrast", "gamma", "histogramStretch"],
      defaultTool: "histogramStretch",
      // Expected Code:
      correctAnswer: "M47H9",
      hints: [
        { cost: 3, text: "The camera sensor recorded low non-zero pixel intensities clustered in the dark shadows. Adjust the Min and Max luminance sliders to stretch this range." },
        { cost: 3, text: "Drag the Min cutoff to around ~6-10 and Max cutoff to ~18-25, then check the five dark shadow zones across the canopy, wall base, and recesses." },
        { cost: 5, text: "Assemble the five coordinates (1:M, 2:4, 3:7, 4:H, 5:9) in sequential order: M47H9." }
      ],
      notebookFragment: "First coordinate locked. The anomaly outside AB3 was not a glitch."
    },

    level2: {
      id: "level2",
      nextLevelId: "cliffhanger",
      title: "Evidence Item #02: The Voicemail Transmission",
      evidenceType: "audio",
      evidenceFile: "/evidence/trailer_beacon.wav",
      storyBriefing: [
        "Timestamp: 03:22 AM. An incoming voice transmission logged on the departmental relay.",
        "The speaker's voice is muffled, drowned beneath an acoustic veil.",
        "Department technicians dismissed it as interference, but a hidden carrier pulse vibrates beneath.",
        "Tune through the frequencies to isolate the concealed carrier."
      ],
      tools: ["waveform", "spectrogram", "bandpass"],
      defaultTool: "spectrogram",
      // Expected Code:
      correctAnswer: "T34S2",
      hints: [
        { cost: 3, text: "The muffled voice masks an underlying high-frequency telegraph carrier tone vibrating above the vocal range." },
        { cost: 3, text: "Switch the filter mode to Bandpass Isolator and sweep the center frequency slider toward ~2400 Hz. Listen for the distinct 1.35s gaps between letters." },
        { cost: 5, text: "Decode the five Morse pulse groups: - (T), ...-- (3), ....- (4), ... (S), ..--- (2) -> T34S2." }
      ],
      notebookFragment: "Second coordinate locked. The carrier frequency leads directly to the Blackbox protocol."
    }
  },

  // 4. CLIFFHANGER CLIMAX & MARKETING TEASER
  cliffhanger: {
    badge: "UPLINK INTERRUPTED // SECURITY CLEARANCE BREACHED",
    headline: "THE TRANSMISSION HAS GONE DARK...",
    interruptedTransmission: [
      "\"If you are reading this, you have bypassed the opening anomalies...\"",
      "\"You uncovered the surveillance negative at AB3, and you isolated my 2400 Hz carrier frequency.\"",
      "\"...BUT THIS WAS ONLY THE BOOTSTRAP PROTOCOL.\"",
      "\"The true master black box contains 12 deep mathematical anomaly tiers... Cellular Automata, Elliptic Curves, 2D Fourier Transforms, and Eulerian Graph Topologies.\"",
      "\"The full investigation convenes on 03/09/2026 in AB3 - 301. Assemble your team and register now.\""
    ],
    marrowSignature: "- Dr. Elias Marrow // Senior Faculty in Theoretical Mathematics",
    marketingHighlights: [
      { label: "12 Forensic Anomaly Tiers", desc: "Image steganography, acoustic filtering, cryptographic ciphers, and network packet forensics." },
      { label: "Live Competitive Leaderboard", desc: "Compete against the sharpest analytical minds in real-time with live scoring and hint penalties." },
      { label: "Grand Cash Prize & Lore Climax", desc: "Discover the shocking conclusion of the Marrow Conjecture and take home top investigator honours." },
      { label: "No High-End Setup Required", desc: "Direct browser-based forensic laboratory workbench accessible from any laptop or device." }
    ]
  }
};
