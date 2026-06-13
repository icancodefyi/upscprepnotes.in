"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { IconInfoCircle } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Topper } from "@/types/topper";

interface TopperFormProps {
  topper?: Topper | null;
}

const defaultMarks = {
  gs1: 0, gs2: 0, gs3: 0, gs4: 0,
  essay: 0,
  optional1: 0, optional2: 0,
  interview: 0, written: 0, total: 0,
};

function ArrayInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={v}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(values.filter((_, j) => j !== i))}
            className="shrink-0 text-red-500"
          >
            ×
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...values, ""])}
      >
        + Add
      </Button>
    </div>
  );
}

export function TopperForm({ topper }: TopperFormProps) {
  const router = useRouter();
  const isEditing = !!topper;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [firstName, setFirstName] = useState(topper?.firstName || "");
  const [lastName, setLastName] = useState(topper?.lastName || "");
  const [rank, setRank] = useState(topper?.rank || 0);
  const [year, setYear] = useState(topper?.year || new Date().getFullYear());
  const [optionalSubject, setOptionalSubject] = useState(topper?.optionalSubject || "");
  const [slug, setSlug] = useState(topper?.slug || "");
  const [ProfileImage, setProfileImage] = useState(topper?.ProfileImage || "");

  const [bio, setBio] = useState(topper?.bio || "");
  const [strategy, setStrategy] = useState(topper?.strategy || "");

  const [marks, setMarks] = useState({ ...defaultMarks, ...topper?.marks });
  const [insights, setInsights] = useState<string[]>(topper?.insights || []);
  const [answerCopies, setAnswerCopies] = useState({
    gs1: topper?.answerCopies?.gs1 || [],
    gs2: topper?.answerCopies?.gs2 || [],
    gs3: topper?.answerCopies?.gs3 || [],
    gs4: topper?.answerCopies?.gs4 || [],
    essay: topper?.answerCopies?.essay || [],
  });
  const [resources, setResources] = useState({
    essayLinks: topper?.resources?.essayLinks || [],
    gs1Links: topper?.resources?.gs1Links || [],
    gs2Links: topper?.resources?.gs2Links || [],
    gs3Links: topper?.resources?.gs3Links || [],
    gs4Links: topper?.resources?.gs4Links || [],
  });
  const [image, setImage] = useState({
    profileImage: topper?.image?.profileImage || "",
    imageUrl: topper?.image?.imageUrl || "",
  });

  const [isFeatured, setIsFeatured] = useState(topper?.isFeatured || false);
  const [isIndexed, setIsIndexed] = useState(topper?.isIndexed || false);
  const [freeAnswerCopyUrl, setFreeAnswerCopyUrl] = useState(topper?.freeAnswerCopyUrl || "");
  const [freeAnswerCopyUrls, setFreeAnswerCopyUrls] = useState<string[]>(topper?.freeAnswerCopyUrls?.length ? topper.freeAnswerCopyUrls : []);

  function setMarkField(field: string, value: number) {
    setMarks((prev) => ({ ...prev, [field]: value }));
  }

  function handleAnswerCopyChange(gs: string, values: string[]) {
    setAnswerCopies((prev) => ({ ...prev, [gs]: values }));
  }

  function handleResourceChange(category: string, values: string[]) {
    setResources((prev) => ({ ...prev, [category]: values }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      firstName,
      lastName,
      rank,
      year,
      optionalSubject,
      slug: slug || undefined,
      ProfileImage: ProfileImage || undefined,
      bio,
      strategy,
      marks,
      insights,
      answerCopies,
      resources,
      image,
      isFeatured,
      isIndexed,
      freeAnswerCopyUrl: freeAnswerCopyUrl || undefined,
      freeAnswerCopyUrls: freeAnswerCopyUrls.length > 0 ? freeAnswerCopyUrls : undefined,
    };

    try {
      const url = isEditing
        ? `/api/admin/toppers/${topper._id}`
        : "/api/admin/toppers";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rank">Rank</Label>
              <Input
                id="rank"
                type="number"
                value={rank}
                onChange={(e) => setRank(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="optionalSubject">Optional Subject</Label>
              <Input
                id="optionalSubject"
                value={optionalSubject}
                onChange={(e) => setOptionalSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug{" "}
                <span className="text-zinc-400">(auto-generated if empty)</span>
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="space-y-3 sm:col-span-2">
              <Label>Profile Image</Label>

              {ProfileImage && (
                <div className="relative mb-3 h-32 w-32 overflow-hidden rounded-xl border">
                  <img
                    src={ProfileImage}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="block w-full text-sm text-zinc-500 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImageUploading(true);
                    try {
                      const fd = new FormData();
                      fd.append("file", file);
                      const res = await fetch("/api/admin/toppers/upload-image", {
                        method: "POST",
                        body: fd,
                      });
                      if (!res.ok) throw new Error("Upload failed");
                      const data = await res.json();
                      setProfileImage(data.url);
                    } catch {
                      setError("Failed to upload image");
                    } finally {
                      setImageUploading(false);
                    }
                  }}
                />
                {imageUploading && (
                  <span className="shrink-0 text-sm text-zinc-500">
                    Uploading…
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  id="ProfileImage"
                  value={ProfileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="Or paste an image URL and click Fetch →"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={imageUploading}
                  onClick={async () => {
                    const urlInput = document.getElementById(
                      "ProfileImage",
                    ) as HTMLInputElement;
                    const url = urlInput?.value?.trim();
                    if (!url) return;
                    setImageUploading(true);
                    try {
                      const res = await fetch(
                        "/api/admin/toppers/upload-image",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ url }),
                        },
                      );
                      if (!res.ok) throw new Error("Fetch failed");
                      const data = await res.json();
                      setProfileImage(data.url);
                    } catch {
                      setError("Failed to fetch image from URL");
                    } finally {
                      setImageUploading(false);
                    }
                  }}
                >
                  Fetch →
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300"
              />
              Featured
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex cursor-help text-zinc-300 hover:text-zinc-500">
                    <IconInfoCircle className="size-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Shows this topper on the homepage featured section. Only toppers with this flag appear in the featured carousel and featured grid on the landing page.
                </TooltipContent>
              </Tooltip>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isIndexed}
                onChange={(e) => setIsIndexed(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300"
              />
              Indexed
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex cursor-help text-zinc-300 hover:text-zinc-500">
                    <IconInfoCircle className="size-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Controls whether this topper appears in the sitemap (SEO). Uncheck for draft or incomplete profiles to prevent search engines from crawling them.
                </TooltipContent>
              </Tooltip>
            </label>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="freeAnswerCopyUrl">Free Download PDF URL (single, fallback)</Label>
              <Input
                id="freeAnswerCopyUrl"
                value={freeAnswerCopyUrl}
                onChange={(e) => setFreeAnswerCopyUrl(e.target.value)}
                placeholder="https://upscprepnotes.in/pdfs/answer-copies/..."
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="freeAnswerCopyUrls">Free Download PDF URLs (multiple — one per line)</Label>
              <textarea
                id="freeAnswerCopyUrls"
                value={freeAnswerCopyUrls.join("\n")}
                onChange={(e) => setFreeAnswerCopyUrls(e.target.value.split("\n").map(s => s.trim()).filter(Boolean))}
                placeholder={`https://upscprepnotes.in/pdfs/answer-copies/gs1.pdf\nhttps://upscprepnotes.in/pdfs/answer-copies/gs2.pdf`}
                className="mt-1.5 flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                rows={4}
              />
              <p className="mt-1 text-xs text-zinc-400">One URL per line. This takes priority over the single URL field above.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {Object.keys(defaultMarks).map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={`marks-${field}`}>{field}</Label>
                <Input
                  id={`marks-${field}`}
                  type="number"
                  value={marks[field as keyof typeof marks] || 0}
                  onChange={(e) =>
                    setMarkField(field, Number(e.target.value))
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bio & Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Short biography in markdown..."
            />
          </div>
          <MarkdownEditor
            id="strategy"
            label="Strategy"
            value={strategy}
            onChange={setStrategy}
            rows={12}
            placeholder="Full strategy content in markdown..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ArrayInput
            label="Insights"
            values={insights}
            onChange={setInsights}
            placeholder="Add an insight..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Answer Copies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(["gs1", "gs2", "gs3", "gs4", "essay"] as const).map((gs) => (
            <ArrayInput
              key={gs}
              label={gs.toUpperCase()}
              values={answerCopies[gs]}
              onChange={(v) => handleAnswerCopyChange(gs, v)}
              placeholder="https://..."
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resources / Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(["essayLinks", "gs1Links", "gs2Links", "gs3Links", "gs4Links"] as const).map((cat) => (
            <ArrayInput
              key={cat}
              label={cat}
              values={resources[cat]}
              onChange={(v) => handleResourceChange(cat, v)}
              placeholder="https://..."
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="image-profileImage">Profile Image URL</Label>
              <Input
                id="image-profileImage"
                value={image.profileImage}
                onChange={(e) =>
                  setImage((prev) => ({
                    ...prev,
                    profileImage: e.target.value,
                  }))
                }
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-imageUrl">Image URL</Label>
              <Input
                id="image-imageUrl"
                value={image.imageUrl}
                onChange={(e) =>
                  setImage((prev) => ({ ...prev, imageUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Topper"
              : "Create Topper"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
