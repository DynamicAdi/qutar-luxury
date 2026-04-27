export const SITE_NAME = "QLP";

export const NAV_ITEMS = [
  { label: "Search", href: "/search" },
  { label: "Agents", href: "/agents" },
  { label: "Join", href: "/join" },

  {
    label: "Paperwork",
    dropdown: [
      { label: "Submit An Application", href: "/submit-application" },
      { label: "Make a Payment", href: "/make-a-payment" },
      { label: "Online Forms", href: "/online-forms" },
    ],
  },

  {
    label: "Resources",
    dropdown: [
      { label: "Helpful Partnerships", href: "/helpful-partnerships" },
      { label: "Commercial", href: "/commercial" },
      { label: "Operating Procedure", href: "/operating-procedure" },
      { label: "Rent vs Buy Calculator", href: "/calculator" },
    ],
  },

  {
    label: "About",
    dropdown: [
      { label: "About us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
    ],
  },
];