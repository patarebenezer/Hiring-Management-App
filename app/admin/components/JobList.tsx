import React from "react";
import { Link } from "react-router-dom";
import { useModal } from "@/hooks/useModal";
import JobCreateModal from "./JobCreateModal";
import { listJobs } from "@/db/jobs";
import { salaryText } from "@/utils/format";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

export default function AdminJobList() {
 const modal = useModal(false);
 const [keyword, setKeyword] = React.useState("");
 const [status, setStatus] = React.useState<
  "all" | "active" | "inactive" | "draft"
 >("all");
 const [sort, setSort] = React.useState<"newest" | "oldest" | "title">(
  "newest"
 );
 const [jobs, setJobs] = React.useState(() =>
  listJobs({ keyword, status, sort })
 );

 const reload = React.useCallback(() => {
  setJobs(listJobs({ keyword, status, sort }));
 }, [keyword, status, sort]);

 React.useEffect(() => {
  reload();
 }, [keyword, status, sort, reload]);

 return (
  <div className='flex flex-col gap-4'>
   {/* Toolbar: filters and Create button */}
   <div className='toolbar'>
    <div className='flex items-center gap-3 flex-wrap'>
     <div className='min-w-[260px]'>
      <Input
       placeholder='Search jobs...'
       value={keyword}
       onChange={(e) => setKeyword(e.target.value)}
      />
     </div>
     <div className='w-40'>
      <Select
       value={status}
       onChange={(e) =>
        setStatus(e.target.value as "all" | "active" | "inactive" | "draft")
       }
      >
       <option value='all'>All Status</option>
       <option value='active'>Active</option>
       <option value='inactive'>Inactive</option>
       <option value='draft'>Draft</option>
      </Select>
     </div>
     <div className='w-40'>
      <Select
       value={sort}
       onChange={(e) =>
        setSort(e.target.value as "newest" | "oldest" | "title")
       }
      >
       <option value='newest'>Newest</option>
       <option value='oldest'>Oldest</option>
       <option value='title'>Title</option>
      </Select>
     </div>
    </div>
    <Button variant='primary' onClick={modal.openModal}>
     + Create Job
    </Button>
   </div>

   {/* Job cards */}
   <div className='grid grid-cols-12 gap-4'>
    {jobs.map((j) => (
     <div key={j.id} className='card p-4 col-span-12 md:col-span-6'>
      <div className='flex items-start justify-between'>
       <div>
        <div className='font-bold'>{j.title}</div>
        <div className='text-slate-400'>
         {j.department} • {j.company}
        </div>
       </div>
       <Badge text={j.status[0].toUpperCase() + j.status.slice(1)} />
      </div>
      <div className='mt-2'>{salaryText(j.salary_range)}</div>
      <div className='mt-3 flex items-center justify-between'>
       <div className='text-slate-400 max-w-[540px]'>{j.description}</div>
       <Link to={`/admin/jobs/${j.id}/candidates`} className='btn btn-base'>
        Manage Job
       </Link>
      </div>
     </div>
    ))}
   </div>

   {/* Create job modal */}
   <JobCreateModal
    open={modal.open}
    onClose={modal.closeModal}
    onCreated={() => {
     setTimeout(() => reload(), 0);
    }}
   />
  </div>
 );
}
