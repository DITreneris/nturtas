export type Locale = 'lt' | 'en' | 'es'

export interface SotMode {
  id: string
  label: string
  desc: string
  formId: string
  icon: string
  fields: string[]
  libraryPromptId?: string
}

export interface FieldMetaItem {
  label: string
  type?: 'text' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
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
}
