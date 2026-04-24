import React from 'react';
import Input from '../Input';
import Button from '../Button';

interface ArticleFiltersProps {
  code: string;
  designation: string;
  onCodeChange: (value: string) => void;
  onDesignationChange: (value: string) => void;
  onSearch: () => void;
}

const ArticleFilters: React.FC<ArticleFiltersProps> = ({
  code,
  designation,
  onCodeChange,
  onDesignationChange,
  onSearch
}) => {
  return (
    <div className="article-filters">
      <div className="filters-row">
        <Input
          label="Code"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="Filtrer par code"
        />
        <Input
          label="Désignation"
          value={designation}
          onChange={(e) => onDesignationChange(e.target.value)}
          placeholder="Filtrer par désignation"
        />
        <div className="filter-actions">
          <Button onClick={onSearch}>Rechercher</Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleFilters;