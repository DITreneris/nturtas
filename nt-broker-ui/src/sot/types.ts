export type Locale = 'lt' | 'en' | 'es'

export interface FieldGroup {
  label: string
  fields: string[]
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export interface SotMode {
  id: string
  label: string
  desc: string
  longDesc?: string
  ctaLabel?: string
  outputTitle?: string
  outputHint?: string
  formId: string
  icon: string
  accentColor?: string
  fields: string[]
  fieldGroups?: FieldGroup[]
  libraryPromptId?: string
}

export interface FieldMetaItem {
  label: string
  type?: 'text' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
  recommended?: boolean
}

export interface SotCopy {
  promptAnatomyUrl?: string
  heroTitle?: string
  heroSubtitle?: string
  heroCtaPrimary?: string
  heroCtaSecondary?: string
  heroCtaMeta?: string
  badge?: string
  loadingLabel?: string
  copyErrorLabel?: string
  copyRetryLabel?: string
  copySuccess?: string
  copyFailed?: string
  btnCopy?: string
  rulesAriaLabel?: string
  themeToggleLabelLight?: string
  themeToggleLabelDark?: string
  promptAnatomyLinkText?: string
  promptAnatomyAriaLabel?: string
  inputBlockLabel?: string
  footerDebugLabel?: string
  modalTemplatesTitle?: string
  btnUse?: string
  btnClose?: string
  selectPlaceholder?: string
  loadError404?: string
  loadErrorGeneric?: string
  activeModeLabel?: string
  contactEmail?: string
  footerContactLabel?: string
  footerCredit?: string
  firstStepHint?: string
  outputDefaultTitle?: string
  outputDefaultHint?: string
  onboardingSteps?: string[]
  fieldProgressLabel?: string
  baseFieldsGroupLabel?: string
  rulesTitle?: string
  emptyGenerateHint?: string
  aiToolLinksLabel?: string
  charCountLabel?: string
  operationCenterLabel?: string
  operationCenterSubLabel?: string
  step1Label?: string
  whatsappLabel?: string
  whatsappUrl?: string
  skipToContentLabel?: string
  footerTagline?: string
  footerCopyright?: string
  communityTitle?: string
  communitySubtitle?: string
  communityCtaPrimary?: string
  communityCtaSecondary?: string
  privacyLabel?: string
  privacyUrl?: string
  outputBadgeLabel?: string
  outputCopyCtaLabel?: string
  noTemplateHint?: string
  noTemplateCtaLabel?: string
  templatesSectionTitle?: string
  templatesExpandLabel?: string
  templatesCollapseLabel?: string
  sessionsTitle?: string
  sessionsSaveLabel?: string
  sessionsDeleteAllLabel?: string
  sessionsEmptyLabel?: string
  sessionDeleteLabel?: string
  sessionCopyLabel?: string
  sessionRestoreLabel?: string
  sessionsFullLabel?: string
  recommendedStartLabel?: string
  copySuccessCtaPrefix?: string
  outputLearnMorePrefix?: string
  aiToolLinksPromptAnatomyLabel?: string
  templatesSourcePrefix?: string
  whenToUseLabel?: string
  modeNavAriaLabel?: string
  languageGroupAriaLabel?: string
  localeLabelLt?: string
  localeLabelEn?: string
  localeLabelEs?: string
  /** Vienas aiškus sakinys virš output (kai yra promptas) */
  outputUseHint?: string
  /** Antraštė virš onboarding žingsnių hero */
  onboardingStepsTitle?: string
  /** Step 2 label (forma) */
  step2Label?: string
  /** Step 3 label (output) */
  step3Label?: string
  /** Prie recommended laukų – priesaga prie label, pvz. " (Rekomenduojama)" */
  fieldRecommendedSuffix?: string
  /** Testimonial citata */
  testimonialQuote?: string
  /** Testimonial autorius */
  testimonialAuthor?: string
  /** Testimonial pareigos */
  testimonialRole?: string
  /** Po pirmo sėkmingo copy – hint įklijuoti į ChatGPT */
  copySuccessNextHint?: string
  /** Footer: kai privacyUrl tuščias – rodomas tekstas */
  privacyComingSoonLabel?: string
}

export interface SotTheme {
  light: Record<string, string>
  dark: Record<string, string>
}

export interface SotCta {
  primary?: { background?: string; text?: string; hoverBackground?: string }
  secondary?: { border?: string; text?: string }
  accent?: { background?: string; hoverBackground?: string }
}

export interface AiToolLink {
  label: string
  url: string
  icon: string
}

export interface Sot {
  brand?: { productName?: string; edition?: string; positioning?: string }
  copy?: SotCopy
  colors?: Record<string, string>
  showDebugInFooter?: boolean
  cta?: SotCta
  modesOrder?: string[]
  modes?: Record<string, SotMode>
  fieldMeta?: Record<string, FieldMetaItem>
  theme?: SotTheme
  libraryPrompts?: Array<{ id: string; title: string; desc: string; icon: string; prompt: string }>
  rules?: Array<{ text: string; icon: string }>
  aiToolLinks?: AiToolLink[]
  footerBadges?: string[]
}
