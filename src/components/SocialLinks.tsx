import { Github, Linkedin, Mail, GraduationCap, type LucideIcon } from "lucide-react";

import { siteConfig, type SocialIcon } from "@/config/site";

/**
 * The config stores icon *names* rather than components so it stays plain data
 * and doesn't drag React imports into every consumer.
 */
const ICONS: Record<SocialIcon, LucideIcon> = {
  linkedin: Linkedin,
  github: Github,
  scholar: GraduationCap,
  email: Mail,
};

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-5 mt-6">
      {siteConfig.social.map(({ name, href, icon, color }) => {
        const Icon = ICONS[icon];
        const isMailto = href.startsWith("mailto:");
        return (
          <a
            key={name}
            href={href}
            target={isMailto ? undefined : "_blank"}
            rel={isMailto ? undefined : "noopener noreferrer"}
            aria-label={name}
            title={name}
            // Exposed as a CSS var so the hover color can come from config.
            style={{ "--brand": color } as React.CSSProperties}
            className="group text-slate-600 dark:text-slate-300 transition-transform hover:scale-110
                       focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md
                       hover:text-[var(--brand)]"
          >
            <Icon className="w-8 h-8 transition-colors duration-200" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
