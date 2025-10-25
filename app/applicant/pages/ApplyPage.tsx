"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { getJobBySlug, getJobConfig } from "@/db/jobs";
import { addCandidate } from "@/db/candidates";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import GestureCamera from "@/applicant/components/GestureCamera";
import { CandidateAttribute, FieldConfig, FieldKey } from "@/types";

type Values = { [k in FieldKey]?: string };

const LABELS: Record<FieldKey, string> = {
 full_name: "Full Name",
 photo_profile: "Photo Profile",
 gender: "Gender",
 domicile: "Domicile",
 email: "Email",
 phone_number: "Phone Number",
 linkedin_link: "LinkedIn",
 date_of_birth: "Date of Birth",
};

export default function ApplyPage() {
 const router = useRouter();
 const params = useParams();
 const slug = params?.slug as string;
 const job = getJobBySlug(slug);
 const config = job ? getJobConfig(job.id) : null;

 const {
  register,
  handleSubmit,
  setValue,
  formState: { errors },
  watch,
 } = useForm<Values>();
 const photoValue = watch("photo_profile");

 if (!job || !config)
  return <div className='card p-4 text-slate-400'>Job not found</div>;

 const fields: FieldConfig[] = config.application_form.sections.flatMap(
  (s) => s.fields
 );

 const onSubmit = (values: Values) => {
  const attributes: CandidateAttribute[] = [];
  for (const f of fields) {
   const key = f.key;
   if (values[key]) {
    attributes.push({
     key,
     label: LABELS[key],
     value: String(values[key] ?? ""),
     order: attributes.length + 1,
    });
   } else if (f.validation?.required) {
    alert(`❌ Missing required field: ${LABELS[key]}`);
    return;
   }
  }

  addCandidate(job.id, attributes);
  alert("✅ Your application has been submitted successfully.");
  router.push(`/app/jobs/${job.slug}`);
 };

 return (
  <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
   <div className='card p-6'>
    <h2 className='mt-0 text-xl font-semibold'>{job.title} — Application</h2>
    <div className='grid grid-cols-12 gap-4'>
     {fields.map((f) => {
      const required = !!f.validation?.required;

      // --- Full Name
      if (f.key === "full_name")
       return (
        <div key={f.key} className='col-span-12 md:col-span-6'>
         <Input
          label={LABELS[f.key]}
          placeholder='Your full name'
          {...register("full_name", {
           required: required ? "Full name is required" : false,
          })}
          error={errors.full_name?.toString()}
         />
        </div>
       );

      // --- Email
      if (f.key === "email")
       return (
        <div key={f.key} className='col-span-12 md:col-span-6'>
         <Input
          type='email'
          label={LABELS[f.key]}
          placeholder='you@example.com'
          {...register("email", {
           required: required ? "Email is required" : false,
           pattern: {
            value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
            message: "Invalid email format",
           },
          })}
          error={errors.email?.toString()}
         />
        </div>
       );

      // --- Phone Number
      if (f.key === "phone_number")
       return (
        <div key={f.key} className='col-span-12 md:col-span-6'>
         <Input
          label={LABELS[f.key]}
          placeholder='+62 ...'
          {...register("phone_number", {
           required: required ? "Phone is required" : false,
          })}
          error={errors.phone_number?.toString()}
         />
        </div>
       );

      // --- Gender
      if (f.key === "gender")
       return (
        <div key={f.key} className='col-span-12 md:col-span-3'>
         <Select
          label={LABELS[f.key]}
          {...register("gender", {
           required: required ? "Gender is required" : false,
          })}
         >
          <option value=''>Select</option>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
          <option value='other'>Other</option>
         </Select>
         {errors.gender && (
          <div className='text-xs text-rose-400 mt-1'>
           {String(errors.gender.message)}
          </div>
         )}
        </div>
       );

      // --- Domicile
      if (f.key === "domicile")
       return (
        <div key={f.key} className='col-span-12 md:col-span-3'>
         <Input
          label={LABELS[f.key]}
          placeholder='City'
          {...register("domicile", {
           required: required ? "Domicile is required" : false,
          })}
          error={errors.domicile?.toString()}
         />
        </div>
       );

      // --- LinkedIn
      if (f.key === "linkedin_link")
       return (
        <div key={f.key} className='col-span-12 md:col-span-6'>
         <Input
          label={LABELS[f.key]}
          placeholder='https://linkedin.com/in/yourname'
          {...register("linkedin_link", {
           required: required ? "LinkedIn is required" : false,
           pattern: {
            value: /^https?:\/\/$/,
            message: "Enter a valid URL (must start with http:// or https://)",
           },
          })}
          error={errors.linkedin_link?.toString()}
         />
        </div>
       );

      // --- Date of Birth
      if (f.key === "date_of_birth")
       return (
        <div key={f.key} className='col-span-12 md:col-span-3'>
         <Input
          type='date'
          label={LABELS[f.key]}
          {...register("date_of_birth", {
           required: required ? "Date of birth is required" : false,
          })}
          error={errors.date_of_birth?.toString()}
         />
        </div>
       );

      // --- Photo Profile (gesture-based)
      if (f.key === "photo_profile")
       return (
        <div key={f.key} className='col-span-12'>
         <div className='label'>
          {LABELS[f.key]} {required ? "*" : ""}
         </div>
         <GestureCamera
          value={photoValue || ""}
          onCapture={(dataUrl) =>
           setValue("photo_profile", dataUrl, { shouldValidate: true })
          }
          onClear={() => setValue("photo_profile", "")}
          required={required}
         />
         {required && !photoValue && (
          <div className='text-xs text-rose-400 mt-1'>Photo is required</div>
         )}
        </div>
       );

      return null;
     })}
    </div>
   </div>

   <div className='flex items-center justify-between'>
    <div className='text-slate-400 text-sm'>
     All required fields are validated dynamically from backend configuration.
    </div>
    <Button type='submit' variant='primary'>
     Submit Application
    </Button>
   </div>
  </form>
 );
}
