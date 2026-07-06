"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { group } from "@/data/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-graphite-900/15 bg-white px-4 py-3 text-sm text-graphite-900 placeholder:text-graphite-400 focus:border-graphite-500 focus:outline-none focus:ring-2 focus:ring-brand-300";

/**
 * Front-end-only enquiry form. Composes a mailto: to the group inbox — no
 * booking/CRM backend is required in this phase (per the brief). Swap the
 * onSubmit for a POST to an API route or form service when one exists.
 */
export function EnquiryForm({
  subjectPrefix = "Website enquiry",
  showSubject = true,
  defaultSubject = "",
}: {
  subjectPrefix?: string;
  showSubject?: boolean;
  defaultSubject?: string;
}) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const subject = String(data.get("subject") ?? defaultSubject);
    const message = String(data.get("message") ?? "");

    const body = `Name: ${name}%0AEmail: ${email}%0A%0A${encodeURIComponent(message)}`;
    const mailSubject = encodeURIComponent(
      subject ? `${subjectPrefix}: ${subject}` : subjectPrefix,
    );
    window.location.href = `mailto:${group.email}?subject=${mailSubject}&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-graphite-800">Name</span>
          <input required name="name" type="text" className={inputClass} placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-graphite-800">Email</span>
          <input
            required
            name="email"
            type="email"
            className={inputClass}
            placeholder="you@example.com"
          />
        </label>
      </div>

      {showSubject && (
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-graphite-800">Subject</span>
          <input
            name="subject"
            type="text"
            defaultValue={defaultSubject}
            className={inputClass}
            placeholder="How can we help?"
          />
        </label>
      )}

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-graphite-800">Message</span>
        <textarea
          required
          name="message"
          rows={5}
          className={cn(inputClass, "resize-y")}
          placeholder="Tell us a little about your enquiry…"
        />
      </label>

      <div className="flex items-center gap-4">
        <Button type="submit" variant="primary">
          <Send className="h-4 w-4" strokeWidth={1.8} />
          Send message
        </Button>
        {sent && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-graphite-600">
            <Check className="h-4 w-4 text-brand-600" /> Opening your email app…
          </span>
        )}
      </div>
    </form>
  );
}
