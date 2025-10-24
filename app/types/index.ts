
export type JobStatus = 'active' | 'inactive' | 'draft'

export interface SalaryRange {
  min: number
  max: number
  currency: string
  display_text?: string
}

export interface Job {
  id: string
  slug: string
  title: string
  department: string
  company: string
  status: JobStatus
  salary_range: SalaryRange
  description: string
  created_at: string
}

export type FieldKey =
  | 'full_name'
  | 'photo_profile'
  | 'gender'
  | 'domicile'
  | 'email'
  | 'phone_number'
  | 'linkedin_link'
  | 'date_of_birth'

export interface FieldValidation {
  required?: boolean
}

export interface FieldConfig {
  key: FieldKey
  validation?: FieldValidation
}

export interface ApplicationFormConfig {
  sections: {
    title: string
    fields: FieldConfig[]
  }[]
}

export interface JobConfig {
  application_form: ApplicationFormConfig
}

export interface CandidateAttribute {
  key: string
  label: string
  value: string
  order?: number
}

export interface Candidate {
  id: string
  jobId: string
  attributes: CandidateAttribute[]
  applied_at: string
}

export interface JobListCardMeta {
  badge: string
  started_on_text?: string
  cta?: string
}
