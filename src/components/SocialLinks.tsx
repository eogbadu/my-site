import { Github, Linkedin, Twitter, Mail, Globe } from "lucide-react";

export default function SocialLinks() {
  const links = [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/yourprofile",
      icon: Linkedin,
      color: "#0A66C2",
    },
    {
      name: "GitHub",
      href: "https://github.com/yourhandle",
      icon: Github,
      color: "#181717",
    },
    {
      name: "Twitter",
      href: "https://twitter.com/yourhandle",
      icon: Twitter,
      color: "#1DA1F2",
    },
    {
      name: "Google Scholar",
      href: "https://scholar.google.com/citations?user=XXXX",
      icon: Globe,
      color: "#4285F4",
    },
    {
      name: "Email",
      href: "mailto:you@example.com",
      icon: Mail,
      color: "#EA4335",
    },
  ];

  return (
    <div className="flex items-center gap-5 mt-6">
      {links.map(({ name, href, icon: Icon, color }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          title={name}
          // expose a CSS var the icon can inherit via currentColor
          style={{ ["--brand" as any]: color }}
          className="group text-slate-600 dark:text-slate-300 transition-transform hover:scale-110
                     focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md
                     hover:text-[var(--brand)]" // ← anchor color changes on hover
        >
          <Icon className="w-8 h-8 transition-colors duration-200" />
        </a>
      ))}
    </div>
  );
}
