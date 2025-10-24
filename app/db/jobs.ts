import { set, get } from "@/db/storage";
import { Job, JobConfig, JobStatus } from "@/types";
import { newJobId, slugify } from "@/utils/id";

type JobsState = { jobs: Job[]; configs: Record<string, JobConfig> };

const empty: JobsState = { jobs: [], configs: {} };

const read = (): JobsState => get<JobsState>("jobs", empty);
const write = (s: JobsState) => set<JobsState>("jobs", s);

export function listJobs(opts?: {
 keyword?: string;
 status?: JobStatus | "all";
 sort?: "newest" | "oldest" | "title";
}) {
 const s = read();
 let arr = [...s.jobs];
 if (opts?.status && opts.status !== "all")
  arr = arr.filter((j) => j.status === opts.status);
 if (opts?.keyword) {
  const q = opts.keyword.toLowerCase();
  arr = arr.filter((j) =>
   [j.title, j.department, j.company].some((x) => x.toLowerCase().includes(q))
  );
 }
 if (opts?.sort === "title") arr.sort((a, b) => a.title.localeCompare(b.title));
 else if (opts?.sort === "oldest")
  arr.sort((a, b) => a.created_at.localeCompare(b.created_at));
 else arr.sort((a, b) => b.created_at.localeCompare(a.created_at));
 return arr;
}

export function listActiveJobs() {
 return listJobs({ status: "active" });
}

export function getJob(id: string) {
 return read().jobs.find((j) => j.id === id) || null;
}

export function getJobBySlug(slug: string) {
 return read().jobs.find((j) => j.slug === slug) || null;
}

export function getJobConfig(jobId: string) {
 return read().configs[jobId] || null;
}

export function createJob(
 input: Omit<Job, "id" | "slug" | "created_at"> & { config: JobConfig }
) {
 const s = read();
 const id = newJobId();
 const slug = slugify(input.title);
 const job: Job = {
  id,
  slug,
  title: input.title,
  description: input.description,
  department: input.department,
  company: input.company,
  status: input.status,
  salary_range: input.salary_range,
  created_at: new Date().toISOString(),
 };
 s.jobs.push(job);
 s.configs[id] = input.config;
 write(s);
 return job;
}

export function updateJob(jobId: string, patch: Partial<Job>) {
 const s = read();
 const idx = s.jobs.findIndex((j) => j.id === jobId);
 if (idx >= 0) {
  s.jobs[idx] = { ...s.jobs[idx], ...patch };
  write(s);
  return s.jobs[idx];
 }
 return null;
}

export function saveJobConfig(jobId: string, config: JobConfig) {
 const s = read();
 s.configs[jobId] = config;
 write(s);
}
