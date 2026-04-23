/**
 * FAQ Page
 * Searchable FAQ system with category filters and accordion display
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';
import { logAnalyticsEvent } from '../services/firebase';
import { FAQ_CATEGORIES, ANALYTICS_EVENTS, ROUTES } from '../utils/constants';
import './Faq.css';

/**
 * FAQ page with search, category filtering, and accordion
 */
export default function Faq() {
  const { data: faqs, loading } = useFirestore('faqs');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  /** Filter FAQs based on search and category */
  const filteredFaqs = useMemo(() => {
    let result = faqs;

    if (activeCategory !== 'all') {
      result = result.filter((faq) => faq.category === activeCategory);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          (faq.tags && faq.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    return result;
  }, [faqs, search, activeCategory]);

  const toggleExpanded = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    logAnalyticsEvent(ANALYTICS_EVENTS.FAQ_VIEWED, { faq_id: id });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value.length > 2) {
      logAnalyticsEvent(ANALYTICS_EVENTS.FAQ_SEARCHED, { query: e.target.value });
    }
  };

  if (loading) {
    return (
      <div className="faq-page page-container" style={{ marginTop: 'var(--nav-height)' }}>
        <div className="page-header">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" style={{ width: '50%' }} />
        </div>
        <div className="skeleton" style={{ height: '48px', marginBottom: '16px' }} />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: '64px', marginBottom: '12px' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="faq-page page-container" style={{ marginTop: 'var(--nav-height)' }}>
      <div className="page-header animate-fadeInDown">
        <h1 className="page-title">Frequently Asked Questions</h1>
        <p className="page-subtitle">
          Find quick answers to common election questions
        </p>
      </div>

      {/* Search */}
      <div className="faq-search-container animate-fadeIn">
        <div className="faq-search-input-wrapper">
          <svg className="faq-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="search"
            className="faq-search-input"
            placeholder="Search questions, topics, or keywords..."
            value={search}
            onChange={handleSearch}
            aria-label="Search FAQs"
            id="faq-search"
          />
          {search && (
            <button
              className="faq-search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="faq-categories" role="tablist" aria-label="FAQ categories">
        {FAQ_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`faq-category ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            role="tab"
            aria-selected={activeCategory === cat.id}
            id={`faq-cat-${cat.id}`}
          >
            {cat.label}
            {activeCategory === cat.id && cat.id !== 'all' && (
              <span className="faq-category-count">
                {filteredFaqs.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="faq-list stagger-children" role="list">
        {filteredFaqs.length === 0 ? (
          <div className="faq-empty animate-fadeIn">
            <span className="faq-empty-icon" aria-hidden="true">🔍</span>
            <p className="faq-empty-text">No matching questions found.</p>
            <p className="faq-empty-hint">Try different keywords or browse all categories.</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className={`faq-item card ${expandedId === faq.id ? 'expanded' : ''}`}
              role="listitem"
            >
              <button
                className="faq-question"
                onClick={() => toggleExpanded(faq.id)}
                aria-expanded={expandedId === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
                id={`faq-q-${faq.id}`}
              >
                <span className="faq-question-text">{faq.question}</span>
                <span className={`faq-chevron ${expandedId === faq.id ? 'rotated' : ''}`} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>

              <div
                id={`faq-answer-${faq.id}`}
                className="faq-answer"
                role="region"
                aria-labelledby={`faq-q-${faq.id}`}
                hidden={expandedId !== faq.id}
              >
                <p className="faq-answer-text">{faq.answer}</p>
                {faq.tags && (
                  <div className="faq-tags">
                    {faq.tags.map((tag) => (
                      <span key={tag} className="faq-tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chatbot CTA */}
      <div className="faq-cta card card-glass animate-fadeInUp">
        <span className="faq-cta-icon" aria-hidden="true">💬</span>
        <div>
          <h3 className="faq-cta-title">Still have questions?</h3>
          <p className="faq-cta-text">Chat with our AI assistant for personalized answers.</p>
        </div>
        <Link to={ROUTES.CHAT} className="btn btn-primary" id="faq-ask-chatbot">
          Ask the Chatbot →
        </Link>
      </div>
    </div>
  );
}
