// Default content (from the design). Anything saved in WordPress "Exotica Home" overrides these.
export const DEFAULTS = {
  // header
  logo_text: 'Exotica',
  logo_tagline: 'AI Shaping The Future',
  logo_image: '',
  nav: [
    { nav_label: 'Services', nav_url: '#svc' },
    { nav_label: 'Industries', nav_url: '#ind' },
    { nav_label: 'About Us', nav_url: '#why' },
    { nav_label: 'Our Work', nav_url: '#work' },
    { nav_label: 'Blog', nav_url: '#stories' },
    { nav_label: 'Contact Us', nav_url: '#talk' },
  ],
  header_cta_label: 'Exotica AI ↗',
  header_cta_url: '#talk',

  // hero  (use | in the headline to break the line)
  hero_eyebrow: '● AI, Automation and Integration for owner-operated businesses',
  hero_title: 'Your whole operation,|connected to itself.',
  hero_subtitle:
    'We find where your operation is leaking time and money, then build the AI and automation that closes the gap. One dashboard for the whole business, with each role seeing only what it needs. The return target is agreed before we write a line.',
  hero_video: '',
  hero_poster: '',
  hero_cta_label: 'Calculate your ROI →',
  hero_cta_url: '#talk',
  hero_secondary_label: 'Book a Revenue Constraint Audit',
  hero_secondary_url: '#faq',

  // trusted by
  trusted_title: '',
  trusted_logos: [
    { logo_name: '▣ CREDIT' },
    { logo_name: '✦ Syncora' },
    { logo_name: 'Robynn AI' },
    { logo_name: '◉ Chordia' },
  ],

  // stats
  stats_heading: 'From Concept to Reality',
  stats_subheading: 'Your Vision, Our Expertise',
  stats: [
    { stat_number: '50+', stat_label: '5-star rated developers' },
    { stat_number: '100+', stat_label: 'Global clients' },
    { stat_number: '10+', stat_label: 'Enterprise & startups' },
    { stat_number: '25+', stat_label: 'Industries' },
    { stat_number: '20+', stat_label: 'Countries served' },
  ],

  // AI engineering
  ai_eyebrow: 'AI Engineering',
  ai_title: 'AI Engineering for Modern Businesses',
  ai_highlight: 'Modern',
  ai_text:
    'Our AI engineering teams integrate advanced models, enterprise data, and modern software into scalable digital platforms.',
  ai_cards: [
    { card_kicker: 'Large Language Models', card_title: 'LLM Integration & RAG', card_text: 'Make your enterprise knowledge precise, secure, and immediately useful.', card_tags: 'RAG pipelines, Knowledge retrieval, Document AI, LLM API integration', card_image: '/images/ai-chip.jpg' },
    { card_kicker: 'Intelligent Assistance', card_title: 'Copilot Development', card_text: 'Purpose-built copilots that multiply capacity across your highest-value workflows.', card_tags: 'Developer copilot, Workflow automation, Support copilot, Sales copilot', card_image: '/images/workflow-automation.png' },
    { card_kicker: 'Machine Learning', card_title: 'ML Development', card_text: 'Production-grade learning systems tailored to your industry outcomes.', card_tags: 'Predictive analytics, Custom ML models, Deployment pipelines, Model optimization', card_image: '/images/data-extraction.png' },
  ],

  // services / leaks
  leaks_eyebrow: 'Our Services',
  leaks_title: 'Where your operation leaks',
  leaks_highlight: 'leaks',
  leaks: [
    { leak_title: "Systems that don't talk", leak_text: 'The same job, client or deal is typed into tools and the numbers disagree.', leak_link_label: 'What we build' },
    { leak_title: 'Handoffs that lose information', leak_text: 'Automated project set-up when a deal closes; the AI summary of notes and contracts for the delivery team, and a flag when the plan drifts from what was sold.', leak_link_label: 'Tap to close', leak_featured: true },
    { leak_title: 'Documents and compliance', leak_text: 'Contracts and approvals stuck in email, and insurance or licences found expired too late.', leak_link_label: 'What we build' },
    { leak_title: 'Cash leakage', leak_text: "Billing errors, unbilled work, orders that don't match invoices, and late payments.", leak_link_label: 'What we build' },
    { leak_title: 'Conversations nobody can see', leak_text: 'Enquiries seen on a person, and key client calls never reach the system.', leak_link_label: 'What we build' },
    { leak_title: 'No visibility', leak_text: "The owner learns about problems after they've cost money.", leak_link_label: 'What we build' },
  ],
  leaks_banner_text: "Need something we haven't listed? We build custom software, and we can embed a dedicated engineering team in yours.",
  leaks_banner_label: 'Talk to us ↗',
  leaks_banner_url: '#talk',

  // industries
  industries_eyebrow: 'Industries',
  industries_title: 'Industry-specific excellence with AI & innovation',
  industries_highlight: 'AI',
  industries: [
    { industry_name: 'Construction' },
    { industry_name: 'Property Management' },
    { industry_name: 'Real Estate' },
    { industry_name: 'Home & Field Services' },
  ],

  // case studies
  cases_eyebrow: 'Case Studies',
  cases_title: 'Innovation in action with us',
  cases_highlight: 'us',
  cases: [
    { case_tab: 'E-commerce Price Monitoring with AI', case_kicker: 'Web Scraping & Cloud Deployment', case_heading: 'E-commerce Price Monitoring with AI-Driven Web Scraping and Cloud Deployment', case_text: 'Our client, an emerging e-commerce platform, faced challenges staying competitive in a dynamic market. We built an AI-driven monitor that tracks competitor pricing and adjusts strategy in real time.', case_stats: '4.8|Client rating\n3M+|Total visitors\n5M+|Weekly reach', case_button_label: 'View case study ↗', case_button_url: '#talk', case_image: '/images/data-extraction.png' },
    { case_tab: 'Automated Real Estate Auction Management', case_kicker: 'Automation & CRM', case_heading: 'Automated Real Estate Auction Management System', case_text: 'Automated invoice parsing, smart OCR data capture and instant CRM integration replaced a slow, manual auction workflow.', case_stats: '70%|Less manual work\n2×|Faster closings\n50K+|Listings managed', case_button_label: 'View case study ↗', case_button_url: '#talk', case_image: '/images/workflow-automation.png' },
    { case_tab: 'Business Process Automation for a Digital Agency', case_kicker: 'Workflow Automation', case_heading: 'Business Process Automation for a Digital Marketing Agency', case_text: 'Connected reporting, lead routing and client comms into one automated pipeline, freeing the team for strategy.', case_stats: '60%|Process automated\n3×|Faster reporting\n0|Missed leads', case_button_label: 'View case study ↗', case_button_url: '#talk', case_image: '/images/home-banner.png' },
  ],

  // why choose us
  why_eyebrow: 'Why choose Exotica',
  why_title: 'How we drive successful digital transformation',
  why_text: 'We combine next-gen AI capabilities with proven delivery to adapt your business to new heights.',
  why_cards: [
    { why_card_title: 'AI-Powered Transformation', why_card_text: 'Intelligence woven into products, not bolted on afterwards.' },
    { why_card_title: 'Human-Centric Approach', why_card_text: 'Built around the people who use it.' },
    { why_card_title: 'Future-Proof Scalability', why_card_text: 'Architecture that grows with you.' },
    { why_card_title: 'Transparent Communication & Collaboration', why_card_text: 'One team, clear milestones, no surprises.' },
  ],

  // faq
  faq_eyebrow: 'FAQ',
  faq_title: 'Questions before you automate.',
  faq_card_title: 'Revenue Constraint Audit',
  faq_card_text: 'Find the operational bottlenecks costing revenue before you build. Pinpoint where automation pays back first.',
  faq_card_label: 'Get Your Free Audit ↗',
  faq_card_url: '#talk',
  faqs: [
    { faq_question: 'What mobile app development services do you offer?', faq_answer: 'We build high-performance React Native, iOS, Android, and cross-platform mobile products with integrated backend API engines.' },
    { faq_question: 'What is the average cost and timeline for custom projects?', faq_answer: 'Scope drives both. After a discovery call we agree a fixed estimate, a timeline and the return target before any build starts.' },
    { faq_question: 'Can you integrate AI into our existing web applications?', faq_answer: 'Yes. We add LLM, retrieval and automation layers to existing stacks without a rebuild.' },
  ],

  // blog
  blog_eyebrow: 'Case Stories',
  blog_title: 'Latest highlights & updates',
  blog_all_label: 'View All Stories',
  blog_all_url: '#',
  posts: [
    { post_title: 'Healthcare SEO Services for Clinics in Canada and the US', post_url: '#', post_image: '/images/home-banner.png' },
    { post_title: 'AI Workflow Automation Agency', post_url: '#', post_image: '/images/workflow-automation.png' },
    { post_title: 'White Label Web Design', post_url: '#', post_image: '/images/ai-chip.jpg' },
  ],

  // contact
  contact_eyebrow: 'Start a Conversation',
  contact_title: 'Partner with tech catalysts who transform ideas into impact.',
  contact_big: "Let's Talk!",
  contact_text: 'Book your consultation with us. A 30-minute discovery call with our senior strategists — no obligation.',
  contact_launch_options: 'Immediately\n1–3 months\n3–6 months',
  contact_submit_label: 'Submit ↗',

  // footer
  footer_text: 'Engineering intelligent systems for organizations building the next era of business.',
  footer_badges: [],
  footer_columns: [
    { column_title: 'Services', column_links: 'Custom Software|#svc\nAutomation|#svc\nDigital Marketing|#svc\nE-Commerce|#svc' },
    { column_title: 'Industries', column_links: 'FinTech|#ind\nRetailing|#ind\nHealth & Pharma|#ind\nTelecom|#ind' },
    { column_title: 'About us', column_links: 'Solutions|#why\nCareer|#\nLeadership|#\nGallery|#' },
    { column_title: 'Portfolio', column_links: 'AI / ML|#work\nAutomation|#work\nPrivacy Policy|#\nTerms|#' },
  ],
  footer_copyright: '© 2026 Exotica IT Solutions. All rights reserved.',
}
