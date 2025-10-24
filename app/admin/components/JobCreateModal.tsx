import React from "react";
import { useForm } from "react-hook-form";
import { createJob } from "@/db/jobs";
import { FieldKey, Job, JobConfig } from "@/types";
import ToggleGroup, { TriState } from "@/components/ToggleGroup";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Select from "@/components/Select";

const FIELD_KEYS: FieldKey[] = [
 "full_name",
 "photo_profile",
 "gender",
 "domicile",
 "email",
 "phone_number",
 "linkedin_link",
 "date_of_birth",
];

type Form = {
 title: string;
 department: string;
 company: string;
 status: "active" | "inactive" | "draft";
 salary_min: number;
 salary_max: number;
 currency: string;
 description: string;
};

export default function JobCreateModal({
 open,
 onClose,
 onCreated,
}: Readonly<{
 open: boolean;
 onClose: () => void;
 onCreated: (job: Job) => void;
}>) {
 const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
 } = useForm<Form>({
  defaultValues: {
   status: "active",
   currency: "IDR",
  },
 });

 const [states, setStates] = React.useState<Record<FieldKey, TriState>>({
  full_name: "mandatory",
  photo_profile: "mandatory",
  gender: "mandatory",
  domicile: "optional",
  email: "mandatory",
  phone_number: "mandatory",
  linkedin_link: "mandatory",
  date_of_birth: "optional",
 });

 const onSubmit = (d: Form) => {
  const config: JobConfig = {
   application_form: {
    sections: [
     {
      title: "Minimum Profile Information Required",
      fields: FIELD_KEYS.filter((k) => states[k] !== "off").map((k) => ({
       key: k,
       validation: { required: states[k] === "mandatory" },
      })),
     },
    ],
   },
  };
  const job = createJob({
   title: d.title,
   department: d.department,
   company: d.company,
   status: d.status,
   salary_range: {
    min: Number(d.salary_min),
    max: Number(d.salary_max),
    currency: d.currency,
    display_text: "",
   },
   description: d.description,
   config,
  });
  reset();
  onCreated(job);
  onClose();
 };

 return (
  <Modal open={open} onClose={onClose} title='Create Job'>
   <form className='col' onSubmit={handleSubmit(onSubmit)}>
    <div className='grid'>
     <div className='span-6'>
      <Input
       label='Title'
       placeholder='e.g. Frontend Developer'
       {...register("title", { required: "Title is required" })}
       error={errors.title?.message}
      />
     </div>
     <div className='span-3'>
      <Input
       label='Department'
       placeholder='e.g. Engineering'
       {...register("department", { required: "Department is required" })}
       error={errors.department?.message}
      />
     </div>
     <div className='span-3'>
      <Input
       label='Company'
       placeholder='e.g. Techify'
       {...register("company", { required: "Company is required" })}
       error={errors.company?.message}
      />
     </div>

     <div className='span-3'>
      <Select label='Status' {...register("status")}>
       <option value='active'>Active</option>
       <option value='inactive'>Inactive</option>
       <option value='draft'>Draft</option>
      </Select>
     </div>
     <div className='span-3'>
      <Input
       type='number'
       label='Salary Min'
       placeholder='7000000'
       {...register("salary_min", { required: "Required" })}
       error={errors.salary_min?.message as string}
      />
     </div>
     <div className='span-3'>
      <Input
       type='number'
       label='Salary Max'
       placeholder='8000000'
       {...register("salary_max", { required: "Required" })}
       error={errors.salary_max?.message as string}
      />
     </div>
     <div className='span-3'>
      <Input
       label='Currency'
       placeholder='IDR'
       {...register("currency", { required: "Required" })}
       error={errors.currency?.message}
      />
     </div>

     <div className='span-12'>
      <div className='label'>Description</div>
      <textarea
       className='textarea'
       placeholder='Write a short description...'
       {...register("description", { required: "Required" })}
      />
      {errors.description && (
       <div className='error'>{errors.description.message}</div>
      )}
     </div>
    </div>

    <hr className='hr' />

    <div className='col'>
     <div className='space-between'>
      <h4 style={{ margin: 0 }}>Minimum Profile Information Required</h4>
      <div className='muted'>
       Set each field: <span className='chip'>Mandatory</span> /{" "}
       <span className='chip'>Optional</span> /{" "}
       <span className='chip'>Off</span>
      </div>
     </div>
     {FIELD_KEYS.map((k) => (
      <div key={k} className='space-between'>
       <div style={{ textTransform: "capitalize" }}>{k.replace(/_/g, " ")}</div>
       <ToggleGroup
        value={states[k]}
        onChange={(v) => setStates((s) => ({ ...s, [k]: v }))}
       />
      </div>
     ))}
    </div>

    <div className='space-between' style={{ marginTop: 8 }}>
     <div className='help'>
      Saved to LocalStorage (mock backend). You can wire Supabase later without
      changing UI.
     </div>
     <Button type='submit' variant='primary'>
      Create Job
     </Button>
    </div>
   </form>
  </Modal>
 );
}
