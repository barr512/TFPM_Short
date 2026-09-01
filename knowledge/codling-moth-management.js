const codlingMothManagement = {
  schema_version: "0.1",
  target: {
    type: "insect",
    common_name: "codling moth",
    scientific_name: "Cydia pomonella",
    aliases: ["CM", "cm"]
  },
  domain: "codling-moth",
  records: [
    {
      id: "cm.management.mating-disruption",
      topics: ["codling moth management", "CM management", "codling moth mating disruption", "pheromone disruption", "CM dispensers"],
      facts: [
        "Codling moth can be managed with mating-disruption programs using pheromone products, with product-specific placement, rate, and duration requirements.",
        "Cornell guidance notes that codling moth mating disruption can also affect oriental fruit moth, although supplemental insecticides may be needed in some situations, especially during the first generation.",
        "Mating disruption is generally more effective in larger or more isolated blocks; smaller blocks may need supplemental insecticide treatment in some regional programs.",
        "Monitoring remains important when mating disruption is used rather than treating disruption as a substitute for monitoring."
      ],
      confidence: "high",
      source_ids: ["cornell-cm-2025", "ucipm-cm"]
    },
    {
      id: "cm.management.insecticides",
      topics: ["codling moth insecticides", "CM insecticides", "CM pesticides", "what to spray for codling moth", "codling moth chemical control"],
      facts: [
        "Insecticides are one codling moth management tactic and are commonly timed using monitoring information and degree-day models in programs that use those models.",
        "An owner-supplied apple efficacy guide lists Assail (acetamiprid) as providing control of both codling moth and oriental fruit moth.",
        "The same owner-supplied guide lists Avaunt (indoxacarb) as effective against both codling moth and oriental fruit moth.",
        "Regional tree-fruit efficacy information also includes other insecticides with codling moth activity, but efficacy alone does not establish a universal spray timing, rate, crop label, PHI, REI, or use pattern.",
        "Pesticide use details are label- and region-specific and should not be converted into one universal TFPM spray schedule."
      ],
      confidence: "high",
      source_ids: ["owner-pesticide-control-guide", "psu-apple-insect-efficacy", "psu-cm-2026"]
    },
    {
      id: "cm.management.resistance",
      topics: ["codling moth resistance", "CM resistance", "IRAC", "codling moth insecticide rotation", "resistance management"],
      facts: [
        "Codling moth insecticide programs need resistance-management considerations rather than relying repeatedly on the same mode of action.",
        "Regional tree-fruit guidance describes rotating or alternating IRAC mode-of-action groups as part of resistance management.",
        "North Carolina guidance identifies diamides as IRAC group 28 and spinosyns as group 5 in its regional codling moth program and discusses resistance management; those group examples are regional program information, not a universal spray prescription.",
        "A pesticide's presence in an efficacy table does not mean it is appropriate for every crop, region, timing, or situation."
      ],
      confidence: "high",
      source_ids: ["psu-apple-insect-efficacy", "ncsu-cm-2026"]
    },
    {
      id: "cm.management.integrated",
      topics: ["codling moth IPM", "codling moth integrated management", "CM management program", "codling moth control program"],
      facts: [
        "Codling moth management programs can combine monitoring, degree-day or phenology information, mating disruption, insecticides, and reassessment of pest activity.",
        "Trap catches describe adult activity near the trap and are used with other monitoring information rather than automatically serving as a universal spray decision.",
        "When codling moth and oriental fruit moth occur together, some management tools can address both pests, but the applicable product, timing, and regional program still need to match the specific situation."
      ],
      confidence: "high",
      source_ids: ["cornell-cm-2025", "psu-cm-2026", "owner-pesticide-control-guide"]
    }
  ]
};

export default codlingMothManagement;
