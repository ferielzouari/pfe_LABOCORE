import React, { useState, useMemo } from 'react';
import ArticleFilters from './ArticleFilters';
import ArticleFormModal from './ArticleFormModal';
import Button from '../Button';
import { Article, ArticleDetails } from '../../types/article';
import { mockArticles } from '../../data/mockArticles';

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [selectedArticle, setSelectedArticle] = useState<ArticleDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    code: '',
    designation: ''
  });

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const codeMatch = article.code.toLowerCase().includes(filters.code.toLowerCase());
      const designationMatch = article.designationFr.toLowerCase().includes(filters.designation.toLowerCase()) ||
                              article.designationEn.toLowerCase().includes(filters.designation.toLowerCase());
      return codeMatch && designationMatch;
    });
  }, [articles, filters]);

  const handleSearch = () => {
    // Filters are applied in real-time via useMemo
  };

  const handleRowClick = (article: Article) => {
    setSelectedArticle(article.details || null);
  };

  const handleRowDoubleClick = (article: Article) => {
    setSelectedArticle(article.details || null);
    setIsModalOpen(true);
  };

  const handleAddArticle = () => {
    setSelectedArticle(null);
    setIsModalOpen(true);
  };

  const handleSaveArticle = (articleDetails: ArticleDetails) => {
    if (selectedArticle) {
      // Update existing
      setArticles(prev => prev.map(a =>
        a.details?.codeArticle === articleDetails.codeArticle
          ? { ...a, details: articleDetails, code: articleDetails.codeArticle, designationFr: articleDetails.designationFr, designationEn: articleDetails.designationEn }
          : a
      ));
    } else {
      // Add new
      const newArticle: Article = {
        id: Date.now().toString(),
        code: articleDetails.codeArticle,
        designationFr: articleDetails.designationFr,
        designationEn: articleDetails.designationEn,
        details: articleDetails
      };
      setArticles(prev => [...prev, newArticle]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="article-list-container">
      <div className="article-header">
        <h2>Liste des articles</h2>
      </div>

      <ArticleFilters
        code={filters.code}
        designation={filters.designation}
        onCodeChange={(value) => setFilters(prev => ({ ...prev, code: value }))}
        onDesignationChange={(value) => setFilters(prev => ({ ...prev, designation: value }))}
        onSearch={handleSearch}
      />

      <div className="article-content">
        <div className="article-table-container">
          <table className="article-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Désignation</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map(article => (
                <tr
                  key={article.id}
                  className={selectedArticle?.codeArticle === article.details?.codeArticle ? 'selected' : ''}
                  onClick={() => handleRowClick(article)}
                  onDoubleClick={() => handleRowDoubleClick(article)}
                >
                  <td>{article.code}</td>
                  <td>{article.designationFr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="article-actions-panel">
          <Button onClick={handleAddArticle}>Ajouter</Button>
          <Button onClick={() => setSelectedArticle(null)}>Fermer</Button>
        </div>
      </div>

      <ArticleFormModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveArticle}
      />
    </div>
  );
};

export default ArticleList;