import { Github, Linkedin, Twitter, Mail, Globe } from "lucide-react";

export default function SocialLinks() {
  const links = [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/yourprofile",
      icon: Linkedin,
    },
    { name: "GitHub", href: "https://github.com/yourhandle", icon: Github },
    { name: "Twitter", href: "https://twitter.com/yourhandle", icon: Twitter },
    {
      name: "Google Scholar",
      href: "https://scholar.google.com/citations?user=XXXX",
      icon: Globe,
    },
    { name: "Email", href: "mailto:you@example.com", icon: Mail },
  ];

  return (
    <div className="flex items-center gap-5 mt-6">
      {links.map(({ name, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          title={name}
          className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md"
        >
          <Icon className="w-6 h-6" />
        </a>
      ))}
    </div>
  );
}
