import React, { useState, useEffect } from 'react';
import Button from '../Button';
import Input from '../Input';
import ArticleTabs from './ArticleTabs';
import { ArticleDetails } from '../../types/article';

interface ArticleFormModalProps {
  article: ArticleDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: ArticleDetails) => void;
}

const ArticleFormModal: React.FC<ArticleFormModalProps> = ({
  article,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<ArticleDetails>({
    codeArticle: '',
    designationFr: '',
    designationEn: '',
    dureUtilisation: '',
    uniteDure: '',
    uom: '',
    yieldValue: '',
    unite: '',
    precisionValue: '',
    type: '',
    modeGestion: 'Par unité',
    alerteAvant: '',
    ficheSecuriteIds: [],
    mentionRisqueIds: [],
    prudenceIds: [],
    examens: [],
    automates: []
  });

  const [activeTab, setActiveTab] = useState('general');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (article) {
      setFormData(article);
    } else {
      setFormData({
        codeArticle: '',
        designationFr: '',
        designationEn: '',
        dureUtilisation: '',
        uniteDure: '',
        uom: '',
        yieldValue: '',
        unite: '',
        precisionValue: '',
        type: '',
        modeGestion: 'Par unité',
        alerteAvant: '',
        ficheSecuriteIds: [],
        mentionRisqueIds: [],
        prudenceIds: [],
        examens: [],
        automates: []
      });
    }
    setErrors({});
  }, [article, isOpen]);

  const handleChange = (field: keyof ArticleDetails, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.codeArticle.trim()) {
      newErrors.codeArticle = 'Le code article est requis';
    }
    if (!formData.designationFr.trim()) {
      newErrors.designationFr = 'La désignation française est requise';
    }
    if (!formData.unite.trim()) {
      newErrors.unite = 'L\'unité est requise';
    }
    if (!formData.type.trim()) {
      newErrors.type = 'Le type est requis';
    }
    if (formData.examens.length === 0) {
      newErrors.examens = 'Au moins un examen doit être sélectionné';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleMultiSelectChange = (field: keyof ArticleDetails, value: string, checked: boolean) => {
    const currentValues = formData[field] as string[];
    if (checked) {
      handleChange(field, [...currentValues, value]);
    } else {
      handleChange(field, currentValues.filter(v => v !== value));
    }
  };

  const handleIdArrayChange = (field: keyof ArticleDetails, id: number, checked: boolean) => {
    const currentValues = formData[field] as number[];
    if (checked) {
      handleChange(field, [...currentValues, id]);
    } else {
      handleChange(field, currentValues.filter(v => v !== id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{article ? 'Modifier l\'article' : 'Nouvel article'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <ArticleTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          formData={formData}
          onChange={handleChange}
          errors={errors}
        />

        <div className="modal-body">
          {activeTab === 'general' && (
            <div className="form-section">
              <Input
                label="Article"
                value={formData.codeArticle}
                onChange={(e) => handleChange('codeArticle', e.target.value)}
                error={errors.codeArticle}
              />
              <Input
                label="Désignation en français"
                value={formData.designationFr}
                onChange={(e) => handleChange('designationFr', e.target.value)}
                error={errors.designationFr}
              />
              <Input
                label="Désignation en anglais"
                value={formData.designationEn}
                onChange={(e) => handleChange('designationEn', e.target.value)}
              />
              <div className="form-row">
                <Input
                  label="Durée d'utilisation après ouverture"
                  value={formData.dureUtilisation}
                  onChange={(e) => handleChange('dureUtilisation', e.target.value)}
                />
                <Input
                  label="Unité durée"
                  value={formData.uniteDure}
                  onChange={(e) => handleChange('uniteDure', e.target.value)}
                />
              </div>
              <Input
                label="UOM"
                value={formData.uom}
                onChange={(e) => handleChange('uom', e.target.value)}
              />
              <Input
                label="Rendement"
                value={formData.yieldValue}
                onChange={(e) => handleChange('yieldValue', e.target.value)}
              />
              <Input
                label="Unité"
                value={formData.unite}
                onChange={(e) => handleChange('unite', e.target.value)}
                error={errors.unite}
              />
              <Input
                label="Précision"
                value={formData.precisionValue}
                onChange={(e) => handleChange('precisionValue', e.target.value)}
              />
              <Input
                label="Type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                error={errors.type}
              />
              <Input
                label="Mode de gestion"
                value={formData.modeGestion}
                onChange={(e) => handleChange('modeGestion', e.target.value)}
              />
              <Input
                label="Alerte avant péremption"
                value={formData.alerteAvant}
                onChange={(e) => handleChange('alerteAvant', e.target.value)}
              />
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="form-section">
              <div className="checkbox-group">
                <label className="group-label">Fiche de données de sécurité</label>
                <div className="checkbox-options">
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.ficheSecuriteIds.includes(1)}
                      onChange={(e) => handleIdArrayChange('ficheSecuriteIds', 1, e.target.checked)}
                    />
                    Fiche 1
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.ficheSecuriteIds.includes(2)}
                      onChange={(e) => handleIdArrayChange('ficheSecuriteIds', 2, e.target.checked)}
                    />
                    Fiche 2
                  </label>
                </div>
              </div>

              <div className="checkbox-group">
                <label className="group-label">Mention de risque</label>
                <div className="checkbox-options">
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.mentionRisqueIds.includes(1)}
                      onChange={(e) => handleIdArrayChange('mentionRisqueIds', 1, e.target.checked)}
                    />
                    Inflammable
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.mentionRisqueIds.includes(2)}
                      onChange={(e) => handleIdArrayChange('mentionRisqueIds', 2, e.target.checked)}
                    />
                    Toxique
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.mentionRisqueIds.includes(3)}
                      onChange={(e) => handleIdArrayChange('mentionRisqueIds', 3, e.target.checked)}
                    />
                    Corrosif
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.mentionRisqueIds.includes(4)}
                      onChange={(e) => handleIdArrayChange('mentionRisqueIds', 4, e.target.checked)}
                    />
                    Sensibilisant
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.mentionRisqueIds.includes(5)}
                      onChange={(e) => handleIdArrayChange('mentionRisqueIds', 5, e.target.checked)}
                    />
                    Dangereux pour l'environnement
                  </label>
                </div>
              </div>

              <div className="checkbox-group">
                <label className="group-label">Conseils de prudence</label>
                <div className="checkbox-options">
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.prudenceIds.includes(1)}
                      onChange={(e) => handleIdArrayChange('prudenceIds', 1, e.target.checked)}
                    />
                    Manipuler avec précaution
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.prudenceIds.includes(2)}
                      onChange={(e) => handleIdArrayChange('prudenceIds', 2, e.target.checked)}
                    />
                    Porter des gants
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.prudenceIds.includes(3)}
                      onChange={(e) => handleIdArrayChange('prudenceIds', 3, e.target.checked)}
                    />
                    Éviter le contact avec la peau
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.prudenceIds.includes(4)}
                      onChange={(e) => handleIdArrayChange('prudenceIds', 4, e.target.checked)}
                    />
                    Conserver au froid
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.prudenceIds.includes(5)}
                      onChange={(e) => handleIdArrayChange('prudenceIds', 5, e.target.checked)}
                    />
                    Stérilisé
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.prudenceIds.includes(6)}
                      onChange={(e) => handleIdArrayChange('prudenceIds', 6, e.target.checked)}
                    />
                    Manipuler sous hotte
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exam' && (
            <div className="form-section">
              <div className="checkbox-group">
                <label className="group-label">Examens associés</label>
                {errors.examens && <div className="error-message">{errors.examens}</div>}
                <div className="checkbox-options">
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.examens.includes('PSA Total')}
                      onChange={(e) => handleMultiSelectChange('examens', 'PSA Total', e.target.checked)}
                    />
                    PSA Total
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.examens.includes('PSA Libre')}
                      onChange={(e) => handleMultiSelectChange('examens', 'PSA Libre', e.target.checked)}
                    />
                    PSA Libre
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.examens.includes('Ferritine')}
                      onChange={(e) => handleMultiSelectChange('examens', 'Ferritine', e.target.checked)}
                    />
                    Ferritine
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.examens.includes('Ferritine VIDAS')}
                      onChange={(e) => handleMultiSelectChange('examens', 'Ferritine VIDAS', e.target.checked)}
                    />
                    Ferritine VIDAS
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.examens.includes('Hémogramme')}
                      onChange={(e) => handleMultiSelectChange('examens', 'Hémogramme', e.target.checked)}
                    />
                    Hémogramme
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.examens.includes('Glucose')}
                      onChange={(e) => handleMultiSelectChange('examens', 'Glucose', e.target.checked)}
                    />
                    Glucose
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'automate' && (
            <div className="form-section">
              <div className="checkbox-group">
                <label className="group-label">Automates compatibles</label>
                <div className="checkbox-options">
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.automates.includes('Hybritech')}
                      onChange={(e) => handleMultiSelectChange('automates', 'Hybritech', e.target.checked)}
                    />
                    Hybritech
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.automates.includes('Access')}
                      onChange={(e) => handleMultiSelectChange('automates', 'Access', e.target.checked)}
                    />
                    Access
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.automates.includes('VIDAS')}
                      onChange={(e) => handleMultiSelectChange('automates', 'VIDAS', e.target.checked)}
                    />
                    VIDAS
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.automates.includes('Sysmex')}
                      onChange={(e) => handleMultiSelectChange('automates', 'Sysmex', e.target.checked)}
                    />
                    Sysmex
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.automates.includes('Cobas')}
                      onChange={(e) => handleMultiSelectChange('automates', 'Cobas', e.target.checked)}
                    />
                    Cobas
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <Button onClick={handleSave}>Valider</Button>
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleFormModal;