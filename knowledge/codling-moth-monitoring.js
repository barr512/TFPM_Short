const codlingMothMonitoring = {
  "schema_version": "0.1",
  "target": {
    "type": "insect",
    "common_name": "codling moth",
    "scientific_name": "Cydia pomonella",
    "aliases": ["CM", "cm"]
  },
  "domain": "monitoring",
  "records": [
    {
      "id": "cm.monitoring.purpose",
      "topics": ["monitoring purpose", "why monitor", "what traps tell me"],
      "facts": [
        "Pheromone traps capture adult codling moths and help describe the timing of adult flights.",
        "Trap catches estimate relative adult activity in the immediate area around the trap, not necessarily across an entire block or farm.",
        "Monitoring information can be used with an appropriate regional degree-day model, but trap catch alone should not automatically be treated as a spray decision."
      ],
      "confidence": "high",
      "source_ids": ["cornell-ipm-2025", "newa-cm-2026", "ncsu-cm"]
    },
    {
      "id": "cm.monitoring.trap-type",
      "topics": ["trap type", "which trap", "delta trap", "sticky trap"],
      "facts": [
        "Delta-style pheromone traps with a replaceable sticky liner are commonly used for codling moth monitoring.",
        "The trap requires a codling moth lure, and the lure must be selected for the monitoring situation.",
        "Orchards under mating disruption may require a lure designed to remain informative when standard sex-pheromone catches are suppressed."
      ],
      "confidence": "high",
      "source_ids": ["cornell-ipm-2025", "vt-cm", "ncsu-cm"]
    },
    {
      "id": "cm.monitoring.deployment-timing",
      "topics": ["when to put traps out", "deployment timing", "install traps"],
      "facts": [
        "Traps should be installed before the first adult flight is expected so early flight is not missed.",
        "Regional guidance differs in crop-stage wording; Virginia guidance places traps by pink, while Cornell guidance places traps around petal fall and provides region-specific calendar examples.",
        "When regional guidance differs, TFPM should ask for location before presenting a calendar date as generally applicable."
      ],
      "confidence": "high",
      "source_ids": ["vt-cm", "cornell-ipm-2025"]
    },
    {
      "id": "cm.monitoring.trap-height-canopy",
      "topics": ["trap height", "canopy position", "where to hang traps"],
      "facts": [
        "Hang codling moth traps in the upper one-third of the tree canopy.",
        "Place the trap toward the outside of the canopy and keep the entrance unobstructed by leaves, shoots, or branches.",
        "Tree architecture can affect practical height; Cornell notes that top-canopy placement is particularly important in semi-dwarf or larger trees and may be less critical in high-density systems."
      ],
      "confidence": "high",
      "source_ids": ["cornell-ipm-2025", "vt-cm"]
    },
    {
      "id": "cm.monitoring.block-position",
      "topics": ["edge trap", "perimeter trap", "inside block", "block position", "representative catches"],
      "facts": [
        "For more representative block-wide catches, place traps several rows into the block rather than directly on the perimeter row.",
        "A practical target is approximately one-quarter of the way into the block or farther when access and orchard layout allow.",
        "A trap placed closer to an orchard edge may record higher local activity and may not represent codling moth activity throughout the remainder of the block or farm.",
        "A trap may intentionally be positioned nearer a historically higher-pressure side, but its catch should be interpreted as local information from that area."
      ],
      "confidence": "reviewed-field-guidance",
      "source_ids": ["user-field-review", "cornell-ipm-2025"]
    },
    {
      "id": "cm.monitoring.trap-quantity",
      "topics": ["how many traps", "trap density", "traps per acre", "number of traps"],
      "facts": [
        "A common starting density is approximately one codling moth trap per five acres.",
        "Trap number should be considered by block rather than treating an entire farm as one monitoring unit.",
        "The practical number balances acreage, the value of additional local information, the cost of traps and lures, and the time required to service them.",
        "Where traps are placed can be more important than automatically adding traps; growers often concentrate traps in areas with historically higher pressure.",
        "Published regional guidance differs on minimum trap numbers, so TFPM should preserve the source context instead of presenting every minimum as universal."
      ],
      "required_context": ["acreage", "number_of_blocks"],
      "confidence": "moderate",
      "source_ids": ["vt-cm", "cornell-ipm-2025", "user-field-review"]
    },
    {
      "id": "cm.monitoring.check-frequency",
      "topics": ["how often to check", "check traps", "service traps"],
      "facts": [
        "Check traps frequently enough at the start of flight that the beginning of activity is not missed.",
        "Virginia guidance specifies daily checks until the first adult is caught and weekly checks afterward.",
        "Cornell guidance specifies checking at least weekly for males.",
        "TFPM should describe the regional difference and ask for location or monitoring objective before insisting on one universal schedule."
      ],
      "confidence": "high",
      "source_ids": ["vt-cm", "cornell-ipm-2025"]
    },
    {
      "id": "cm.monitoring.lure-maintenance",
      "topics": ["replace lure", "lure life", "sticky liner", "trap maintenance"],
      "facts": [
        "Replace the lure according to the field life specified for that exact lure; replacement intervals are not interchangeable among all products or loadings.",
        "Replace the sticky liner when contamination, captured insects, debris, or loss of stickiness interferes with capture.",
        "Record lure installation and replacement dates rather than judging lure life by appearance."
      ],
      "confidence": "high",
      "source_ids": ["cornell-ipm-2025", "user-field-review"]
    },
    {
      "id": "cm.monitoring.mating-disruption",
      "topics": ["mating disruption monitoring", "MD monitoring", "CM-DA lure", "10X lure"],
      "facts": [
        "Mating disruption can suppress catches in standard sex-pheromone traps even when codling moth is present.",
        "Use a trap-and-lure combination intended for monitoring in disrupted orchards rather than assuming a standard lure will provide the same information.",
        "Cornell describes CM-DA combination lures and higher-load lures as options for monitoring under mating disruption.",
        "An empty standard pheromone trap in a disrupted orchard is not proof that codling moth is absent."
      ],
      "confidence": "high",
      "source_ids": ["cornell-ipm-2025", "wsu-cm"]
    },
    {
      "id": "cm.monitoring.damage-sampling",
      "topics": ["fruit sampling", "look for damage", "monitor larvae", "fruit inspection"],
      "facts": [
        "Pheromone trapping should be supplemented with fruit inspection when evaluating injury and population pressure.",
        "Virginia guidance describes examining fruit in mid-June to early July for larval entry and provides a sample protocol of 25 to 50 fruit per tree on five trees per block.",
        "Fruit sampling protocols can be region- and program-specific, so the source and timing context should be retained."
      ],
      "confidence": "high",
      "source_ids": ["vt-cm", "ncsu-cm"]
    }
  ],
  "sources": [
    {
      "id": "vt-cm",
      "organization": "Virginia Tech",
      "title": "Codling Moth",
      "url": "https://www.virginiafruit.ento.vt.edu/codlingmoth.html",
      "notes": "Older Mid-Atlantic monitoring guidance; retain date and regional context."
    },
    {
      "id": "cornell-ipm-2025",
      "organization": "Cornell Integrated Pest Management",
      "title": "Codling Moth (Cydia pomonella)",
      "url": "https://cals.cornell.edu/integrated-pest-management/outreach-education/fact-sheets/codling-moth-cydia-pomonella",
      "last_updated": "2025"
    },
    {
      "id": "newa-cm-2026",
      "organization": "Cornell NEWA",
      "title": "Codling Moth Model",
      "url": "https://newa.cornell.edu/codling-moth/",
      "accessed": "2026-07-31"
    },
    {
      "id": "ncsu-cm",
      "organization": "NC State Extension",
      "title": "Codling Moth",
      "url": "https://content.ces.ncsu.edu/codling-moth",
      "notes": "Use current production guide for current chemical guidance."
    },
    {
      "id": "wsu-cm",
      "organization": "Washington State University Tree Fruit",
      "title": "Codling Moth Management",
      "url": "https://treefruit.wsu.edu/crop-protection/opm/codling-moth/"
    },
    {
      "id": "user-field-review",
      "organization": "TFPM expert review",
      "title": "Field interpretation supplied during TFPM development",
      "review_status": "expert-reviewed"
    }
  ]
};

export default codlingMothMonitoring;
