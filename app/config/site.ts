export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Next.js",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}

export const adminConfig = {
  name: "eShop",
  description:
    "My NextJS learning Playground",
  mainNav: [
    {
      title: "Visit Store Front",
      href: "/",
    },    
  ],
  frontendNav: [
    {
      title: "Home",
      href: "/admin",
    },
    {
      title: "Categories",
      href: "/admin/categories",
    },
    {
      title: "Product",
      href: "/admin/products",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
  sidebarMenu: [
    {
      id: 1,
      title: "Quick Links",
      listItems: [
        {
          id: 1,
          title: "Dashboard",
          url: "/admin",
          icon: "home",
        },
        {
          id: 2,
          title: "Profile",
          url: "/users/1",
          icon: "person",
        },
      ],
    },
    {
      id: 2,
      title: "MAIN",
      listItems: [        
        {
          id: 1,
          title: "Products",
          url: "/admin/products",
          icon: "products",
        },
        {
          id: 2,
          title: "Options",
          url: "/admin/options",
          icon: "list",
        },
        {
          id: 3,
          title: "Categories",
          url: "/admin/categories",
          icon: "lists",
        },
        {
          id: 4,
          title: "Tags",
          url: "/admin/tags",
          icon: "vertical-list",
        },
        {
          id: 5,
          title: "Orders",
          url: "/admin/orders",
          icon: "shopping-bag",
        },
        {
          id: 6,
          title: "Users",
          url: "/admin/users",
          icon: "persons",
        },
      ],
    },
    {
      id: 3,
      title: "General",
      listItems: [
        {
          id: 1,
          title: "Settings",
          url: "/",
          icon: "cog",
        },
        {
          id: 2,
          title: "Backups",
          url: "/",
          icon: "server",
        },
        {
          id: 3,
          title: "Logs",
          url: "/",
          icon: "list",
        },
      ],
    },    
  ],
  links: {
    twitter: "https://twitter.com/",
    github: "https://github.com/",
    docs: "https://ui.shadcn.com",
  },
}

