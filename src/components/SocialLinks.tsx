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
    <div className="flex items-center gap-4 pt-2">
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
            className="text-ink-faint hover:text-[var(--brand)] transition-colors
                       focus:outline-none focus:ring-2 focus:ring-accent rounded-sm p-1 -m-1"
          >
            <Icon className="w-[18px] h-[18px]" aria-hidden="true" strokeWidth={1.75} />
          </a>
        );
      })}
    </div>
  );
}
