import { createJob } from "@/db/jobs";
import { get, set } from "@/db/storage";
import { JobConfig } from "@/types";

export function seed() {
 const seeded = get<boolean>("seeded", false);
 if (seeded) return;

 const config: JobConfig = {
  application_form: {
   sections: [
    {
     title: "Minimum Profile Information Required",
     fields: [
      { key: "full_name", validation: { required: true } },
      { key: "photo_profile", validation: { required: true } },
      { key: "gender", validation: { required: true } },
      { key: "domicile", validation: { required: false } },
      { key: "email", validation: { required: true } },
      { key: "phone_number", validation: { required: true } },
      { key: "linkedin_link", validation: { required: true } },
      { key: "date_of_birth", validation: { required: false } },
     ],
    },
   ],
  },
 };

 createJob({
  title: "Frontend Developer",
  department: "Engineering",
  company: "Techify",
  status: "active",
  salary_range: {
   min: 7000000,
   max: 8000000,
   currency: "IDR",
   display_text: "Rp7.000.000 - Rp8.000.000",
  },
  description:
   "We are looking for a Frontend Engineer passionate about DX and exceptional UX.",
  config,
 });

 createJob({
  title: "QA Engineer",
  department: "Quality",
  company: "Techify",
  status: "draft",
  salary_range: { min: 6000000, max: 7500000, currency: "IDR" },
  description:
   "Own quality from day one: test plans, automation, and exploratory testing.",
  config,
 });

 set("seeded", true);
}
