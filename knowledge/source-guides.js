const sourceGuides = {
  schema_version: "1.0",
  records: [
    {
      id: "source.catalog.owner-guides",
      topics: ["available guides", "production guides", "fruit guides", "sources", "regional coverage", "what information do you have"],
      facts: [
        "TFPM's owner-supplied guide collection currently includes six verified commercial tree-fruit guides covering the Mid-Atlantic, Southeast, New Jersey, Michigan, Washington, and the Pacific Northwest.",
        "A guide being present in the catalog does not mean every page has already been converted into searchable facts.",
        "The Michigan guide has partial topic-level indexing. The other five guides are cataloged and awaiting topic-by-topic extraction.",
        "Source names are provided when the user asks for them; ordinary grower answers present the information without citations."
      ],
      confidence: "source-inventory",
      source_ids: [
        "mid-atlantic-spray-bulletin-2026",
        "southeast-peach-guide-2026",
        "southeast-apple-guide-2026",
        "rutgers-tree-fruit-guide-2025-2026",
        "wsu-integrated-fruit-production-guide",
        "msu-fruit-guide-2026"
      ]
    }
  ]
};

export default sourceGuides;
