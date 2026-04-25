// ============================================================
// Vex — Cross the line.
// SubmitForm — Payload submission form with live preview
// ============================================================

'use client';

import { useState, useCallback } from 'react';
import {
  Send,
  Copy,
  Check,
  AlertCircle,
  FileCode,
  Download,
} from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import PayloadCode from '@/components/payload/PayloadCode';
import {
  validateForm,
  INITIAL_FORM_DATA,
  type SubmitFormData,
  type ValidationError,
} from '@/lib/form-validation';
import { exportToYAML } from '@/lib/yaml-export';

const CONTEXT_OPTIONS = [
  { value: 'html', label: 'HTML' },
  { value: 'attribute', label: 'Attribute' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'url', label: 'URL' },
  { value: 'css', label: 'CSS' },
  { value: 'dom', label: 'DOM' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner', color: '#00ff88' },
  { value: 'intermediate', label: 'Intermediate', color: '#00d4ff' },
  { value: 'advanced', label: 'Advanced', color: '#ff8800' },
  { value: 'expert', label: 'Expert', color: '#ff3366' },
];

const BROWSER_OPTIONS = ['chrome', 'firefox', 'safari', 'edge', 'opera', 'ie'];

export default function SubmitForm() {
  const [form, setForm] = useState<SubmitFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [yamlOutput, setYamlOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const getError = (field: keyof SubmitFormData) =>
    errors.find((e) => e.field === field)?.message;

  const updateField = useCallback(
    <K extends keyof SubmitFormData>(field: K, value: SubmitFormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => prev.filter((e) => e.field !== field));
    },
    []
  );

  const toggleArrayField = useCallback(
    (field: 'browsers' | 'wafBypass', value: string) => {
      setForm((prev) => ({
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter((v) => v !== value)
          : [...prev[field], value],
      }));
    },
    []
  );

  const addTag = useCallback(() => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  }, [tagInput, form.tags]);

  const removeTag = useCallback((tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }, []);

  const handleSubmit = useCallback(() => {
    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      const yaml = exportToYAML(form);
      setYamlOutput(yaml);
    }
  }, [form]);

  const handleCopyYAML = useCallback(async () => {
    if (!yamlOutput) return;
    await navigator.clipboard.writeText(yamlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [yamlOutput]);

  const handleDownloadYAML = useCallback(() => {
    if (!yamlOutput) return;
    const blob = new Blob([yamlOutput], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payload-${Date.now()}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  }, [yamlOutput]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Form */}
      <div className="space-y-6">
        {/* Payload code */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Payload Code <span className="text-accent-red">*</span>
          </label>
          <textarea
            value={form.payload}
            onChange={(e) => updateField('payload', e.target.value)}
            placeholder="<svg onload=alert('XSS')>"
            rows={4}
            className={`w-full px-4 py-3 rounded-xl bg-bg-surface border font-mono text-sm text-accent-cyan placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent-green/30 transition-all resize-none ${
              getError('payload') ? 'border-accent-red/50' : 'border-border'
            }`}
          />
          {getError('payload') && (
            <p className="mt-1 text-xs text-accent-red flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {getError('payload')}
            </p>
          )}
          <p className="mt-1 text-xs text-text-muted font-mono">
            {form.payload.length} characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Description <span className="text-accent-red">*</span>
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="SVG onload event XSS with alert"
            className={`w-full px-4 py-3 rounded-xl bg-bg-surface border text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent-green/30 transition-all ${
              getError('description') ? 'border-accent-red/50' : 'border-border'
            }`}
          />
          {getError('description') && (
            <p className="mt-1 text-xs text-accent-red flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {getError('description')}
            </p>
          )}
        </div>

        {/* Category + Context + Difficulty row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Category <span className="text-accent-red">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value as SubmitFormData['category'])}
              className={`w-full px-3 py-2.5 rounded-xl bg-bg-surface border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-green/30 transition-all ${
                getError('category') ? 'border-accent-red/50' : 'border-border'
              }`}
            >
              <option value="">Select...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Context <span className="text-accent-red">*</span>
            </label>
            <select
              value={form.context}
              onChange={(e) => updateField('context', e.target.value as SubmitFormData['context'])}
              className={`w-full px-3 py-2.5 rounded-xl bg-bg-surface border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-green/30 transition-all ${
                getError('context') ? 'border-accent-red/50' : 'border-border'
              }`}
            >
              <option value="">Select...</option>
              {CONTEXT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Difficulty <span className="text-accent-red">*</span>
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => updateField('difficulty', e.target.value as SubmitFormData['difficulty'])}
              className={`w-full px-3 py-2.5 rounded-xl bg-bg-surface border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-green/30 transition-all ${
                getError('difficulty') ? 'border-accent-red/50' : 'border-border'
              }`}
            >
              <option value="">Select...</option>
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Tags
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add tags..."
              className="flex-1 px-3 py-2 rounded-lg bg-bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent-green/30"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 rounded-lg bg-bg-elevated border border-border text-sm text-text-secondary hover:text-accent-green hover:border-accent-green/30 transition-all"
            >
              Add
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => removeTag(tag)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono bg-bg-elevated text-text-secondary border border-border hover:border-accent-red/30 hover:text-accent-red transition-all"
                >
                  {tag} ×
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Browsers */}
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Compatible Browsers
          </label>
          <div className="flex flex-wrap gap-1.5">
            {BROWSER_OPTIONS.map((b) => (
              <button
                key={b}
                onClick={() => toggleArrayField('browsers', b)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  form.browsers.includes(b)
                    ? 'border-accent-green/40 bg-accent-green/15 text-accent-green'
                    : 'border-border bg-bg-elevated text-text-muted'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Contributor info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Your Name <span className="text-accent-red">*</span>
            </label>
            <input
              type="text"
              value={form.contributor}
              onChange={(e) => updateField('contributor', e.target.value)}
              placeholder="HackerHandle"
              className={`w-full px-3 py-2.5 rounded-xl bg-bg-surface border text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent-green/30 transition-all ${
                getError('contributor') ? 'border-accent-red/50' : 'border-border'
              }`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              GitHub Username
            </label>
            <input
              type="text"
              value={form.githubUsername}
              onChange={(e) => updateField('githubUsername', e.target.value)}
              placeholder="@username"
              className="w-full px-3 py-2.5 rounded-xl bg-bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent-green/30 transition-all"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent-green to-accent-cyan text-bg-primary font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <Send className="w-4 h-4" />
          Generate YAML Submission
        </button>

        {errors.length > 0 && (
          <div className="p-3 rounded-xl bg-accent-red/5 border border-accent-red/20">
            <p className="text-xs text-accent-red font-medium">
              Please fix {errors.length} error{errors.length > 1 ? 's' : ''} above
            </p>
          </div>
        )}
      </div>

      {/* Right: Live Preview + YAML Output */}
      <div className="space-y-6">
        {/* Live Preview */}
        <div className="rounded-xl border border-border bg-bg-surface/50 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-bg-elevated/50">
            <FileCode className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs font-mono text-text-muted">Live Preview</span>
          </div>
          <div className="p-4">
            {form.payload ? (
              <PayloadCode code={form.payload} maxLength={0} />
            ) : (
              <p className="text-sm text-text-muted italic">Enter a payload to see preview...</p>
            )}
          </div>
        </div>

        {/* YAML Output */}
        {yamlOutput && (
          <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-accent-green/20">
              <span className="text-xs font-mono text-accent-green">Generated YAML</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyYAML}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-accent-green hover:bg-accent-green/10 transition-all"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownloadYAML}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-accent-green hover:bg-accent-green/10 transition-all"
                >
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            </div>
            <pre className="p-4 text-xs font-mono text-text-secondary leading-relaxed overflow-x-auto whitespace-pre">
              {yamlOutput}
            </pre>
          </div>
        )}

        {/* Guide link */}
        <div className="p-4 rounded-xl border border-border bg-bg-surface/30">
          <h3 className="text-sm font-semibold text-text-primary mb-1">How to submit</h3>
          <ol className="text-xs text-text-secondary space-y-1.5 list-decimal list-inside">
            <li>Fill in the form and generate the YAML</li>
            <li>Fork the Vex repository on GitHub</li>
            <li>Add the YAML file under <code className="text-accent-cyan">/payloads/</code></li>
            <li>Open a Pull Request with your submission</li>
          </ol>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-xs text-accent-green hover:underline"
          >
            Read CONTRIBUTING.md →
          </a>
        </div>
      </div>
    </div>
  );
}
