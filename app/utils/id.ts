
import { customAlphabet } from 'nanoid'
const nano = customAlphabet('0123456789', 4)

const pad = (n: number) => n.toString().padStart(2, '0')

export const newJobId = () => {
  const d = new Date()
  const id = `job_${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(parseInt(nano(),10))}`
  return id
}

export const newCandidateId = () => {
  const d = new Date()
  const id = `cand_${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(parseInt(nano(),10))}`
  return id
}

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
