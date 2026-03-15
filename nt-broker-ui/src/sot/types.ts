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
  whatsappLabel?: string
  whatsappUrl?: string
  skipToContentLabel?: string
  footerTagline?: string
  footerCopyright?: string
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
}
