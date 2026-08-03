const codlingMothMonitoring = {
  "schema_version": "0.1",
  "target": {
    "type": "insect",
    "common_name": "codling moth",
    "scientific_name": "Cydia pomonella",
    "aliases": [
      "CM",
      "cm"
    ]
  },
  "domain": "monitoring",
  "records": [
    {
      "id": "cm.monitoring.purpose",
      "topics": [
        "monitoring purpose",
        "why monitor",
        "what traps tell me"
      ],
      "facts": [
        "Pheromone traps capture adult codling moths and help describe the timing of adult flights.",
        "Trap catches estimate relative adult activity in the immediate area around the trap, not necessarily across an entire block or farm.",
        "Monitoring information can be used with an appropriate regional degree-day model, but trap catch alone should not automatically be treated as a spray decision."
      ],
      "confidence": "high",
      "source_ids": [
        "cornell-ipm-2025",
        "newa-cm-2026",
        "ncsu-cm"
      ]
    },
    {
      "id": "cm.monitoring.trap-type",
      "topics": [
        "trap type",
        "which trap",
        "delta trap",
        "sticky trap"
      ],
      "facts": [
        "Delta-style traps with a replaceable sticky liner are commonly used for codling moth monitoring.",
        "In orchards without mating disruption, two common lure choices are CM 1X and CM L2.",
        "CM 1X has a four-week field life.",
        "CM L2 has an eight-week field life."
      ],
      "confidence": "high",
      "source_ids": [
        "cornell-ipm-2025",
        "vt-cm",
        "ncsu-cm"
      ]
    },
    {
      "id": "cm.monitoring.deployment-timing",
      "topics": [
        "when to put traps out",
        "deployment timing",
        "install traps"
      ],
      "facts": [
        "Traps should be installed before the first adult flight is expected so early flight is not missed.",
        "Regional guidance differs in crop-stage wording; Virginia guidance places traps by pink, while Cornell guidance places traps around petal fall and provides region-specific calendar examples.",
        "When regional guidance differs, TFPM should ask for location before presenting a calendar date as generally applicable."
      ],
      "confidence": "high",
      "source_ids": [
        "vt-cm",
        "cornell-ipm-2025"
      ]
    },
    {
      "id": "cm.monitoring.trap-height-canopy",
      "topics": [
        "trap height",
        "canopy position",
        "where to hang traps"
      ],
      "facts": [
        "Hang codling moth traps in the upper one-third of the tree canopy.",
        "Place the trap toward the outside of the canopy and keep the entrance unobstructed by leaves, shoots, or branches.",
        "Tree architecture can affect practical height; Cornell notes that top-canopy placement is particularly important in semi-dwarf or larger trees and may be less critical in high-density systems."
      ],
      "confidence": "high",
      "source_ids": [
        "cornell-ipm-2025",
        "vt-cm"
      ]
    },
    {
      "id": "cm.monitoring.block-position",
      "topics": [
        "edge trap",
        "perimeter trap",
        "inside block",
        "block position",
        "representative catches"
      ],
      "facts": [
        "For more representative block-wide catches, place traps several rows into the block rather than directly on the perimeter row.",
        "A practical target is approximately one-quarter of the way into the block or farther when access and orchard layout allow.",
        "A trap placed closer to an orchard edge may record higher local activity and may not represent codling moth activity throughout the remainder of the block or farm.",
        "A trap may intentionally be positioned nearer a historically higher-pressure side, but its catch should be interpreted as local information from that area."
      ],
      "confidence": "reviewed-field-guidance",
      "source_ids": [
        "user-field-review",
        "cornell-ipm-2025"
      ]
    },
    {
      "id": "cm.monitoring.trap-quantity",
      "topics": [
        "how many traps",
        "trap density",
        "traps per acre",
        "number of traps"
      ],
      "facts": [
        "Codling moth trap counts are considered separately for each orchard block.",
        "The general minimum is two traps in each orchard block.",
        "For an individual block of ten acres or less, the guideline works out to two traps.",
        "For blocks larger than ten acres, one trap per five acres is the reference rate.",
        "When a block acreage falls between five-acre increments, express the count as a range between the whole-trap values below and above that acreage instead of forcing one value.",
        "For example, a block larger than ten but smaller than fifteen acres has a range of two to three traps, while a block larger than fifteen but smaller than twenty acres has a range of three to four traps.",
        "When acreage is an exact multiple of five, use the exact whole-trap count; for example, a fifteen-acre block corresponds to three traps.",
        "The rule can be explained without collecting the acreage of every block, and a general question about trap numbers should receive the rule rather than a clarification questionnaire.",
        "Questions about where traps are placed can be answered without knowing block acreage or calculating the number of traps."
      ],
      
      "confidence": "high-with-regional-variation",
      "source_ids": [
        "vt-cm",
        "cornell-ipm-2025",
        "user-field-review",
        "penn-state-cm-2026",
        "purdue-cm-traps-2024"
      ]
    },
    {
      "id": "cm.monitoring.check-frequency",
      "topics": [
        "how often to check",
        "check traps",
        "service traps"
      ],
      "facts": [
        "Check traps frequently enough at the start of flight that the beginning of activity is not missed.",
        "Virginia guidance specifies daily checks until the first adult is caught and weekly checks afterward.",
        "Cornell guidance specifies checking at least weekly for males.",
        "TFPM should describe the regional difference and ask for location or monitoring objective before insisting on one universal schedule."
      ],
      "confidence": "high",
      "source_ids": [
        "vt-cm",
        "cornell-ipm-2025"
      ]
    },
    {
      "id": "cm.monitoring.lure-maintenance",
      "topics": [
        "replace lure",
        "lure life",
        "sticky liner",
        "trap maintenance"
      ],
      "facts": [
        "Replace the lure according to the field life specified for that exact lure; replacement intervals are not interchangeable among all products or loadings.",
        "Typical sticky-liner service interval: about four weeks.",
        "Replace a sticky liner sooner when insects, dust, leaves, or other debris cover enough of the sticky surface to interfere with capture.",
        "Record lure installation and replacement dates rather than judging lure life by appearance."
      ],
      "confidence": "high",
      "source_ids": [
        "cornell-ipm-2025",
        "user-field-review"
      ]
    },
    {
      "id": "cm.monitoring.mating-disruption",
      "topics": [
        "mating disruption monitoring",
        "MD monitoring",
        "CM-DA lure",
        "10X lure",
        "CM 1X under disruption",
        "CM 10X lure",
        "acetic acid co-lure",
        "CM 4K lure",
        "kairomone lure",
        "monitor disruption efficacy",
        "monitor activity under disruption"
      ],
      "facts": [
        "Mating disruption can suppress catches in standard sex-pheromone traps even when codling moth is present.",
        "If the monitoring objective is to evaluate suppression of standard pheromone response, CM 1X may be used and would be expected to remain near zero under mating disruption.",
        "If the objective is to monitor codling moth activity despite disruption, CM 10X is a higher-load pheromone option and is not expected to remain near zero.",
        "CM 10X has an approximate field life of two weeks.",
        "CM-DA combines pheromone and kairomone and may be used with or without acetic acid.",
        "CM 4K contains kairomones and no pheromone.",
        "CM-DA and CM 4K have approximate field lives of 8–12 weeks.",
        "Variation in the reported efficacy of CM 4K, CM-DA, and other kairomone-containing lures has occurred among locations and even within a season.",
        "Lure choice under mating disruption depends first on the monitoring objective and then on locally relevant performance evidence.",
        "An empty CM 1X trap under disruption is not proof that codling moth is absent.",
        "There are no universally recognized treatment thresholds for kairomone-based codling moth lures.",
        "Some growers and consultants use locally and seasonally developed relationships between captures in kairomone-based lures and treatment need.",
        "Historically, CM 1X catches under mating disruption have been expected to remain very close to zero.",
        "CM 1X captures that depart from the near-zero expectation under disruption may indicate that a spray should be considered, but the catch should not be treated as one universal automatic spray threshold."
      ],
      "confidence": "high",
      "source_ids": [
        "cornell-ipm-2025",
        "wsu-cm"
      ]
    },
    {
      "id": "cm.monitoring.biofix",
      "topics": [
        "biofix",
        "codling moth biofix",
        "when is biofix",
        "first sustained capture",
        "degree-day start"
      ],
      "facts": [
        "Codling moth biofix is established from the first sustained capture of adult codling moths, not automatically from the first single moth caught.",
        "An isolated early capture may occur before sustained flight and should not by itself be treated as biofix.",
        "Biofix marks the starting point used for the codling moth degree-day model.",
        "Do not invent a fixed number of consecutive catches or a universal catch sequence to define sustained capture when no such criterion has been supplied."
      ],
      "confidence": "expert-reviewed",
      "source_ids": [
        "user-field-review"
      ]
    },
    {
      "id": "cm.monitoring.damage-sampling",
      "topics": [
        "fruit sampling",
        "look for damage",
        "monitor larvae",
        "fruit inspection"
      ],
      "facts": [
        "Pheromone trapping should be supplemented with fruit inspection when evaluating injury and population pressure.",
        "Virginia guidance describes examining fruit in mid-June to early July for larval entry and provides a sample protocol of 25 to 50 fruit per tree on five trees per block.",
        "Fruit sampling protocols can be region- and program-specific, so the source and timing context should be retained."
      ],
      "confidence": "high",
      "source_ids": [
        "vt-cm",
        "ncsu-cm"
      ]
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
