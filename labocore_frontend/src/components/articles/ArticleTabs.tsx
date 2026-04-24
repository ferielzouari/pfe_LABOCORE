import React from 'react';
import { ArticleDetails } from '../../types/article';

interface ArticleTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  formData: ArticleDetails;
  onChange: (field: keyof ArticleDetails, value: any) => void;
  errors: Record<string, string>;
}

const ArticleTabs: React.FC<ArticleTabsProps> = ({
  activeTab,
  onTabChange,
  formData,
  onChange,
  errors
}) => {
  const handleMultiSelectChange = (field: keyof ArticleDetails, value: string, checked: boolean) => {
    const currentValues = formData[field] as string[];
    if (checked) {
      onChange(field, [...currentValues, value]);
    } else {
      onChange(field, currentValues.filter(v => v !== value));
    }
  };

  const handleIdArrayChange = (field: keyof ArticleDetails, id: number, checked: boolean) => {
    const currentValues = formData[field] as number[];
    if (checked) {
      onChange(field, [...currentValues, id]);
    } else {
      onChange(field, currentValues.filter(v => v !== id));
    }
  };

  return (
    <div className="modal-tabs">
      <button
        className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
        onClick={() => onTabChange('general')}
      >
        Général
      </button>
      <button
        className={`tab-button ${activeTab === 'safety' ? 'active' : ''}`}
        onClick={() => onTabChange('safety')}
      >
        Fiche de données de sécurité
      </button>
      <button
        className={`tab-button ${activeTab === 'exam' ? 'active' : ''}`}
        onClick={() => onTabChange('exam')}
      >
        Examen
      </button>
      <button
        className={`tab-button ${activeTab === 'automate' ? 'active' : ''}`}
        onClick={() => onTabChange('automate')}
      >
        Automate
      </button>
    </div>
  );
};

export default ArticleTabs;