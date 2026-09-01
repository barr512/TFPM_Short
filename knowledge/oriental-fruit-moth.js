const orientalFruitMoth = {
  schema_version: "0.1",
  target: {
    type: "insect",
    common_name: "oriental fruit moth",
    scientific_name: "Grapholita molesta",
    aliases: ["OFM", "ofm"]
  },
  domain: "oriental-fruit-moth",
  records: [
    {
      id: "ofm.identification",
      topics: ["oriental fruit moth", "OFM", "identification", "biology", "life cycle"],
      facts: [
        "Oriental fruit moth is a pest of tree fruit, including peaches and apples.",
        "OFM can produce multiple generations during the growing season; the number and timing depend on region and weather."
      ],
      confidence: "high",
      source_ids: ["psu-ofm-2026"]
    },
    {
      id: "ofm.damage.shoots-fruit",
      topics: ["OFM damage", "shoot flagging", "shoot injury", "fruit injury", "fruit damage"],
      facts: [
        "Early-season OFM larvae can tunnel into growing shoots, causing wilted or flagged shoot tips.",
        "Later generations can attack fruit, so monitoring needs to include both shoot injury and fruit injury when those stages are relevant.",
        "Fruit injury and shoot flagging are useful scouting observations alongside pheromone trap catches."
      ],
      confidence: "high",
      source_ids: ["psu-ofm-2026", "ucipm-ofm"]
    },
    {
      id: "ofm.monitoring.pheromone-traps",
      topics: ["OFM monitoring", "OFM traps", "pheromone trap", "OFM biofix", "trap catch", "moth trap"],
      facts: [
        "OFM can be monitored with species-specific pheromone traps.",
        "In the Pennsylvania monitoring program, traps are placed in orchards in early April and checked frequently until biofix is established, then weekly.",
        "Pennsylvania guidance uses the first sustained capture of two or more moths per trap as an example of an OFM biofix; this is a regional monitoring rule, not a universal threshold.",
        "Trap catches are used together with observations of shoot flagging and fruit injury to assess OFM activity."
      ],
      confidence: "high",
      source_ids: ["psu-ofm-2026"]
    },
    {
      id: "ofm.monitoring.degree-days",
      topics: ["OFM degree days", "degree-day model", "OFM timing", "egg hatch", "biofix"],
      facts: [
        "OFM management programs can use degree-day models after an established trap biofix to estimate development and important treatment windows.",
        "Cornell's NEWA OFM model uses a 45°F base temperature and tracks three generations from the first trap-catch biofix in that program.",
        "Degree-day timing rules are model- and region-specific and should not be presented as one universal OFM spray schedule."
      ],
      confidence: "high",
      source_ids: ["newa-ofm-2026", "psu-ofm-2026"]
    },
    {
      id: "ofm.monitoring.scouting",
      topics: ["OFM scouting", "shoot scouting", "fruit scouting", "flagged shoots", "fruit inspection"],
      facts: [
        "OFM monitoring can combine pheromone trap information with field scouting for flagged shoots and fruit injury.",
        "Monitoring remains important when mating disruption is being used rather than treating mating disruption as a substitute for scouting."
      ],
      confidence: "high",
      source_ids: ["psu-ofm-2026", "ucipm-ofm"]
    },
    {
      id: "ofm.management.mating-disruption",
      topics: ["OFM management", "OFM mating disruption", "pheromone disruption", "hand-applied dispensers", "sprayable pheromone"],
      facts: [
        "OFM mating disruption is available through hand-applied pheromone dispensers and sprayable pheromone formulations.",
        "In the Pennsylvania program, hand-applied OFM dispensers are placed in the upper canopy at the product label rate around the pink stage; product duration varies by formulation.",
        "Sprayable pheromone duration depends on formulation, rate, and weather.",
        "Pennsylvania guidance notes that mating disruption works best in orchards of about 5–10 acres in that program, while other regions and products can have different requirements.",
        "If codling moth is also a problem in the same block, Pennsylvania guidance describes selecting a mating-disruption material that controls both species.",
        "Monitoring should continue when mating disruption is used."
      ],
      confidence: "high",
      source_ids: ["psu-ofm-2026", "cornell-cm-2025", "ucipm-ofm"]
    },
    {
      id: "ofm.management.insecticides",
      topics: ["OFM insecticides", "OFM pesticides", "what to spray for OFM", "OFM chemical control", "OFM control"],
      facts: [
        "Insecticides are one OFM management tactic and are commonly timed using monitoring information and degree-day models in programs that use those models.",
        "An owner-supplied apple efficacy guide lists Assail (acetamiprid) as providing control of both codling moth and oriental fruit moth.",
        "The same owner-supplied guide lists Avaunt (indoxacarb) as effective against both codling moth and oriental fruit moth.",
        "Product efficacy does not by itself establish a universal spray timing, rate, crop label, PHI, REI, or use pattern; those details are label- and region-specific."
      ],
      confidence: "high",
      source_ids: ["owner-pesticide-control-guide", "psu-ofm-2026", "ucipm-ofm"]
    },
    {
      id: "ofm.management.resistance",
      topics: ["OFM resistance", "IRAC", "insecticide rotation", "resistance management"],
      facts: [
        "OFM insecticide programs need resistance-management considerations rather than relying repeatedly on the same mode of action.",
        "Regional tree-fruit guides describe rotating or alternating IRAC mode-of-action groups as part of resistance management.",
        "A pesticide's presence in an efficacy table does not mean it is appropriate for every crop, region, timing, or situation."
      ],
      confidence: "high",
      source_ids: ["owner-pesticide-control-guide", "psu-apple-insect-efficacy"]
    }
  ]
};

export default orientalFruitMoth;
