import { useState, useEffect } from 'react'
import { useSubscriptionStore } from '@/popup/store'
import { useLogo } from '@/popup/hooks/useLogo'
import { CURRENCIES, BILLING_CYCLES, CATEGORIES } from '@/shared/constants'
import type { Subscription, SubscriptionFormData, BillingCycle, SubscriptionStatus } from '@/shared/types'
import { format } from 'date-fns'

interface SubscriptionFormProps {
  mode: 'add' | 'edit'
  subscription?: Subscription
  onClose: () => void
}

const defaultFormData: SubscriptionFormData = {
  name: '',
  url: null,
  logo: null,
  amount: 0,
  currency: 'USD',
  cycle: 'monthly',
  billingDay: new Date().getDate(),
  startDate: format(new Date(), 'yyyy-MM-dd'),
  trialEndDate: null,
  category: 'Other',
  status: 'active',
  notes: null,
}

export default function SubscriptionForm({ mode, subscription, onClose }: SubscriptionFormProps) {
  const addSubscription = useSubscriptionStore((s) => s.addSubscription)
  const updateSubscription = useSubscriptionStore((s) => s.updateSubscription)
  const deleteSubscription = useSubscriptionStore((s) => s.deleteSubscription)

  const [form, setForm] = useState<SubscriptionFormData>(
    subscription
      ? {
          name: subscription.name,
          url: subscription.url,
          logo: subscription.logo,
          amount: subscription.amount,
          currency: subscription.currency,
          cycle: subscription.cycle,
          billingDay: subscription.billingDay,
          startDate: subscription.startDate,
          trialEndDate: subscription.trialEndDate,
          category: subscription.category,
          status: subscription.status,
          notes: subscription.notes,
        }
      : { ...defaultFormData }
  )

  const { logoUrl, onError, resetError } = useLogo(form.url)

  useEffect(() => {
    resetError()
  }, [form.url])

  const handleChange = <K extends keyof SubscriptionFormData>(
    key: K,
    value: SubscriptionFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || form.amount <= 0) return

    const data: SubscriptionFormData = {
      ...form,
      logo: logoUrl,
      url: form.url?.trim() || null,
      notes: form.notes?.trim() || null,
      trialEndDate: form.status === 'trial' ? form.trialEndDate : null,
    }

    if (mode === 'edit' && subscription) {
      updateSubscription(subscription.id, data)
    } else {
      addSubscription(data)
    }
    onClose()
  }

  const handleDelete = () => {
    if (mode === 'edit' && subscription) {
      deleteSubscription(subscription.id)
      onClose()
    }
  }

  const inputClass =
    'w-full px-3 py-2 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-text-secondary'
  const labelClass = 'block text-xs font-medium text-text-secondary mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Name */}
      <div>
        <label className={labelClass}>Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. Netflix"
          className={inputClass}
          required
        />
      </div>

      {/* URL + Logo preview */}
      <div>
        <label className={labelClass}>Website URL</label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={form.url || ''}
            onChange={(e) => handleChange('url', e.target.value || null)}
            placeholder="https://netflix.com"
            className={`${inputClass} flex-1`}
          />
          {logoUrl && (
            <img
              src={logoUrl}
              alt=""
              className="w-8 h-8 rounded shrink-0"
              onError={onError}
            />
          )}
        </div>
      </div>

      {/* Amount + Currency */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className={labelClass}>Amount *</label>
          <input
            type="number"
            value={form.amount || ''}
            onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
            placeholder="9.99"
            step="0.01"
            min="0"
            className={inputClass}
            required
          />
        </div>
        <div className="w-24">
          <label className={labelClass}>Currency</label>
          <select
            value={form.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className={inputClass}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cycle + Billing Day */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className={labelClass}>Billing Cycle</label>
          <select
            value={form.cycle}
            onChange={(e) => handleChange('cycle', e.target.value as BillingCycle)}
            className={inputClass}
          >
            {BILLING_CYCLES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        {form.cycle !== 'weekly' && form.cycle !== 'one-time' && (
          <div className="w-24">
            <label className={labelClass}>Billing Day</label>
            <input
              type="number"
              value={form.billingDay}
              onChange={(e) => handleChange('billingDay', Math.min(31, Math.max(1, parseInt(e.target.value) || 1)))}
              min={1}
              max={31}
              className={inputClass}
            />
          </div>
        )}
      </div>

      {/* Start Date */}
      <div>
        <label className={labelClass}>Start Date</label>
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Category + Status */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className={labelClass}>Category</label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className={labelClass}>Status</label>
          <select
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value as SubscriptionStatus)}
            className={inputClass}
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="trial">Trial</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Trial End Date */}
      {form.status === 'trial' && (
        <div>
          <label className={labelClass}>Trial Ends</label>
          <input
            type="date"
            value={form.trialEndDate || ''}
            onChange={(e) => handleChange('trialEndDate', e.target.value || null)}
            className={inputClass}
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          value={form.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value || null)}
          placeholder="Optional notes..."
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-sm rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors cursor-pointer"
          >
            Delete
          </button>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-lg bg-bg-secondary text-text-secondary hover:bg-border-color transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-lg bg-text-primary text-bg-primary font-medium hover:opacity-90 transition-opacity cursor-pointer"
        >
          {mode === 'edit' ? 'Save' : 'Add'}
        </button>
      </div>
    </form>
  )
}
