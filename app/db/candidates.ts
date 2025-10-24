import { get, set } from "@/db/storage";
import { Candidate, CandidateAttribute } from "@/types";
import { newCandidateId } from "@/utils/id";

type State = { byJob: Record<string, Candidate[]> };
const empty: State = { byJob: {} };

const read = (): State => get<State>("candidates", empty);
const write = (s: State) => set<State>("candidates", s);

export function listCandidates(jobId: string) {
 const s = read();
 return s.byJob[jobId] || [];
}

export function addCandidate(jobId: string, attributes: CandidateAttribute[]) {
 const s = read();
 const c: Candidate = {
  id: newCandidateId(),
  jobId,
  attributes,
  applied_at: new Date().toISOString(),
 };
 if (!s.byJob[jobId]) s.byJob[jobId] = [];
 s.byJob[jobId].unshift(c);
 write(s);
 return c;
}
