"use client";
import { useParams, useRouter } from "next/navigation";
import { getJobBySlug } from "@/db/jobs";
import { salaryText } from "@/utils/format";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

export default function JobDetail() {
 const params = useParams();
 const router = useRouter();
 const slug = params?.slug as string;
 const job = getJobBySlug(slug);

 if (!job) {
  return (
   <div className='card p-4'>
    <p className='text-slate-400'>Job not found or inactive.</p>
   </div>
  );
 }

 return (
  <div className='card p-6 flex flex-col gap-4'>
   <div className='flex items-center justify-between flex-wrap gap-3'>
    <div>
     <h2 className='text-2xl font-bold m-0'>{job.title}</h2>
     <p className='text-slate-400'>
      {job.department} • {job.company}
     </p>
    </div>
    <Badge text={job.status[0].toUpperCase() + job.status.slice(1)} />
   </div>

   <div>
    <p className='text-lg font-semibold text-slate-200'>
     {salaryText(job.salary_range)}
    </p>
   </div>

   <p className='text-slate-300 leading-relaxed whitespace-pre-line'>
    {job.description || "No job description provided."}
   </p>

   <div className='flex justify-end'>
    <Button
     variant='primary'
     onClick={() => router.push(`/app/jobs/${job.slug}/apply`)}
    >
     Apply Now
    </Button>
   </div>
  </div>
 );
}
