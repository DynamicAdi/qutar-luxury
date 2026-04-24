export const SITE_NAME = "FIND";

export const NAV_ITEMS = [
  { label: "Search", href: "/search" },
  { label: "Agents", href: "/agents" },
  { label: "Join", href: "/join" },

  {
    label: "Paperwork",
    dropdown: [
      { label: "Contracts", href: "/paperwork/contracts" },
      { label: "Disclosures", href: "/paperwork/disclosures" },
      { label: "Forms", href: "/paperwork/forms" },
    ],
  },

  {
    label: "Resources",
    dropdown: [
      { label: "Blog", href: "/resources/blog" },
      { label: "Guides", href: "/resources/guides" },
      { label: "FAQs", href: "/resources/faqs" },
    ],
  },

  {
    label: "About",
    dropdown: [
      { label: "Company", href: "/about/company" },
      { label: "Team", href: "/about/team" },
      { label: "Contact", href: "/about/contact" },
    ],
  },
];