"use client";
import { listJobs } from "@/db/jobs";
import { salaryText } from "@/utils/format";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function JobList() {
 const router = useRouter();
 const jobs = listJobs({ status: "active" });

 if (!jobs.length) {
  return (
   <div className='card p-6 text-center text-slate-400'>
    Tidak ada lowongan aktif saat ini.
   </div>
  );
 }

 return (
  <div className='grid grid-cols-12 gap-4'>
   {jobs.map((job) => (
    <div
     key={job.id}
     className='card p-5 col-span-12 md:col-span-6 lg:col-span-4'
    >
     <div className='flex items-start justify-between'>
      <div>
       <h3 className='text-lg font-semibold'>{job.title}</h3>
       <p className='text-slate-400 text-sm'>
        {job.department} • {job.company}
       </p>
      </div>
      <Badge text='Active' />
     </div>

     <div className='mt-2 text-slate-200 font-medium'>
      {salaryText(job.salary_range)}
     </div>

     <p className='mt-3 text-slate-400 text-sm line-clamp-3'>
      {job.description}
     </p>

     <div className='mt-4 flex justify-end'>
      <Button
       variant='default'
       onClick={() => router.push(`/app/jobs/${job.slug}`)}
      >
       View Details
      </Button>
     </div>
    </div>
   ))}
  </div>
 );
}
