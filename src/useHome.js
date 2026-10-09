import { useEffect, useState } from 'react'

export const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

const STRINGS = [
  'logo_text','logo_tagline','logo_image','header_cta_label','header_cta_url',
  'hero_eyebrow','hero_title','hero_subtitle','hero_video','hero_poster','hero_cta_label','hero_cta_url','hero_secondary_label','hero_secondary_url',
  'trusted_title','stats_heading','stats_subheading',
  'ai_eyebrow','ai_title','ai_highlight','ai_text',
  'leaks_eyebrow','leaks_title','leaks_highlight','leaks_banner_text','leaks_banner_label','leaks_banner_url',
  'industries_eyebrow','industries_title','industries_highlight',
  'cases_eyebrow','cases_title','cases_highlight',
  'why_eyebrow','why_title','why_text',
  'faq_eyebrow','faq_title','faq_card_title','faq_card_text','faq_card_label','faq_card_url',
  'blog_eyebrow','blog_title','blog_all_label','blog_all_url',
  'contact_eyebrow','contact_title','contact_big','contact_text','contact_launch_options','contact_submit_label',
  'footer_text','footer_copyright',
]
const ARRAYS = [
  'nav','trusted_logos','stats','ai_cards','leaks','industries','cases','why_cards','faqs','posts','footer_badges','footer_columns',
]

// Only API data is used. Missing values become '' or [] so the page never crashes.
function normalize(api) {
  const out = {}
  STRINGS.forEach((k) => (out[k] = typeof api?.[k] === 'string' ? api[k] : ''))
  ARRAYS.forEach((k) => (out[k] = Array.isArray(api?.[k]) ? api[k] : []))
  return out
}

export default function useHome() {
  const [state, setState] = useState(() => API
    ? { status: 'loading', data: null, error: '' }
    : { status: 'error', data: null, error: 'VITE_API_URL is not set in .env' })

  useEffect(() => {
    if (!API) return
    const ctrl = new AbortController()
    fetch(`${API}/home`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error('API error ' + r.status)
        return r.json()
      })
      .then((d) => setState({ status: 'ready', data: normalize(d), error: '' }))
      .catch((e) => {
        if (e.name !== 'AbortError') setState({ status: 'error', data: null, error: e.message })
      })
    return () => ctrl.abort()
  }, [])

  return state
}
