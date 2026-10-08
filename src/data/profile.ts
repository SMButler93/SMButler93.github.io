export interface SocialLink {
  readonly label: string;
  readonly handle: string;
  readonly url: string;
}

export const profile = {
  name: 'Scott Butler',
  role: 'Full-Stack .NET Engineer',
  headline: 'I build scalable, resilient APIs in',
  headlineAccent: 'modern .NET.',
  summary:
    'I am a full-stack software engineer with professional experience in delivering web-based solutions, with a focus on building scalable, performant and resilient backend APIs using modern .NET to improve workflows and drive business outcomes.',
  email: 'scottmbutler93@gmail.com',
  social: {
    linkedin: {
      label: 'LinkedIn',
      handle: 'in/scottmbutler93',
      url: 'https://www.linkedin.com/in/scottmbutler93/',
    },
    github: {
      label: 'GitHub',
      handle: '@SMButler93',
      url: 'https://github.com/SMButler93',
    },
  },
} as const satisfies {
  name: string;
  role: string;
  headline: string;
  headlineAccent: string;
  summary: string;
  email: string;
  social: Record<string, SocialLink>;
};

export const socialLinks: readonly SocialLink[] = Object.values(profile.social);
