const orientalFruitMothManagement = {
  schema_version: "0.1",
  target: { type: "insect", common_name: "oriental fruit moth", scientific_name: "Grapholita molesta", aliases: ["OFM", "ofm"] },
  domain: "oriental-fruit-moth",
  records: [
    {
      id: "ofm.management.mating-disruption",
      topics: ["oriental fruit moth management", "OFM management", "OFM mating disruption", "OFM pheromone disruption", "sprayable mating disruption"],
      facts: [
        "Mating disruption is a management option for oriental fruit moth.",
        "Penn State describes attract-and-kill Last Call OFM as an OFM management option, with pheromone and insecticide solution droplets placed in the mid to upper canopy at the label rate around pink stage in apples and again at approximately 45-day intervals; the droplets remain effective for at least 6 to 7 weeks.",
        "Monitoring should continue when mating disruption is used so its effectiveness can be evaluated.",
        "Penn State notes that targeted insecticides and/or OFM sprayable mating disruption during the first two flight generations can reduce OFM pressure in a no-crop year."
      ],
      confidence: "high",
      source_ids: ["psu-ofm-2026", "psu-no-crop-2026"]
    },
    {
      id: "ofm.management.insecticides",
      topics: ["oriental fruit moth insecticides", "OFM insecticides", "OFM pesticides", "what to spray for oriental fruit moth", "OFM chemical control"],
      facts: [
        "Pheromone trap monitoring can be used to help time insecticide applications for oriental fruit moth.",
        "Penn State's 2026 home-fruit guidance describes broad-spectrum insecticide applications at about 7 days after the beginning of each generation and a repeat 7 to 10 days later, but this is home-fruit guidance and should not be presented as a universal commercial-orchard spray schedule.",
        "An owner-supplied apple efficacy guide lists Assail (acetamiprid) as providing control of both oriental fruit moth and codling moth.",
        "The same owner-supplied guide lists Avaunt (indoxacarb) as effective against both oriental fruit moth and codling moth.",
        "Regional tree-fruit efficacy information contains additional products with OFM activity, but efficacy information alone does not establish a universal rate, timing, PHI, REI, crop label, or regional use pattern.",
        "Pesticide use details are label- and region-specific."
      ],
      confidence: "high",
      source_ids: ["psu-ofm-2026", "owner-pesticide-control-guide", "psu-apple-insect-efficacy"]
    },
    {
      id: "ofm.management.resistance",
      topics: ["oriental fruit moth resistance", "OFM resistance", "OFM IRAC", "OFM insecticide rotation", "OFM resistance management"],
      facts: [
        "Oriental fruit moth populations have developed resistance to multiple insecticide classes, making resistance management an important part of control programs.",
        "Penn State notes that codling moth and oriental fruit moth have developed varying levels of resistance to organophosphates, carbamates, and pyrethroids.",
        "Resistance-management programs use different modes of action rather than repeatedly relying on the same insecticide class.",
        "The presence of a pesticide in an efficacy table does not mean it is appropriate for every crop, region, timing, or situation."
      ],
      confidence: "high",
      source_ids: ["psu-resistance-toolbox-2026", "psu-apple-insect-efficacy"]
    },
    {
      id: "ofm.management.sanitation",
      topics: ["oriental fruit moth sanitation", "OFM sanitation", "OFM dropped fruit", "OFM orchard sanitation", "OFM cultural control"],
      facts: [
        "Orchard sanitation can help reduce oriental fruit moth pressure by removing dropped fruit and other ground litter that can provide development or overwintering sites.",
        "OFM larvae can also complete development in growing apple or peach shoots, so fruit removal alone does not eliminate the pest."
      ],
      confidence: "high",
      source_ids: ["psu-ofm-2026", "psu-no-crop-2026"]
    },
    {
      id: "ofm.management.integrated",
      topics: ["oriental fruit moth IPM", "OFM integrated management", "OFM control program", "oriental fruit moth management program"],
      facts: [
        "OFM management can combine monitoring, phenology or degree-day information, mating disruption, insecticides, sanitation, and reassessment of pest activity.",
        "The appropriate combination depends on crop, production system, pest pressure, regional guidance, and whether mating disruption is being used.",
        "When OFM and codling moth occur together, some insecticides can have activity against both pests, but timing and label requirements still need to match the particular pest, crop, product, and region."
      ],
      confidence: "high",
      source_ids: ["psu-ofm-2026", "owner-pesticide-control-guide", "psu-resistance-toolbox-2026"]
    }
  ]
};

export default orientalFruitMothManagement;
