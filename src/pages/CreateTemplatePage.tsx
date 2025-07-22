import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { useGetTemplateQuery, useCreateTemplateMutation, useUpdateTemplateMutation } from '../services/api';
import { setCurrentTemplate, saveTemplate } from '../store/slices/emailEditorSlice';
import Tabs from '../components/ui/Tabs';
import TemplateDesignStep from './TemplateDesignStep';
import TemplateCreationForm from './TemplateCreationForm';
import Button from '../components/ui/Button';
import { Download, Eye, Languages, Save, X } from 'lucide-react';

const CreateTemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentTemplate } = useAppSelector(state => state.emailEditor);
  const { permissions } = useAppSelector(state => state.auth);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('creation');
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: existingTemplate, isLoading: isLoadingTemplate } = useGetTemplateQuery(templateId!, {
    skip: !templateId,
  });
  
  const [createTemplate, { isLoading: isCreating }] = useCreateTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateMutation();
  
  const [formData, setFormData] = useState({
    messageTypeId: '',
    messageName: '',
    channel: '',
    language: '',
  });
  

  // Check if we're editing an existing template
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
      setTemplateId(id);
      setIsEditing(true);
    }
  }, []);

  // Load existing template data
  React.useEffect(() => {
    if (existingTemplate) {
      setFormData({
        messageTypeId: existingTemplate.messageTypeId,
        messageName: existingTemplate.messageName,
        channel: existingTemplate.channel,
        language: existingTemplate.language,
      });
      dispatch(setCurrentTemplate(existingTemplate));
    }
  }, [existingTemplate, dispatch]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    console.log("formData === "+JSON.stringify(formData));
    
    if (!formData.messageTypeId.trim()) {
      newErrors.messageTypeId = 'Message Type ID is required';
    }
    
    if (!formData.messageName.trim()) {
      newErrors.messageName = 'Message Name is required';
    }
    
    if (!formData.channel) {
      newErrors.channels = 'channel must be selected';
    }
    
    if (!formData.language) {
      newErrors.language = 'Language is required';
    }
    
    setErrors(newErrors);
    console.log("error === "+JSON.stringify(newErrors));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const templateData = {
      id: isEditing ? templateId! : Date.now().toString(),
      messageTypeId: formData.messageTypeId.trim(),
      messageName: formData.messageName.trim(),
      channel: formData.channel,
      language: formData.language,
      status: 'draft' as const,
      content: '',
      createdAt: existingTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: formData.channel.includes('External Email') || formData.channel.includes('Secure Inbox') ? 'Email' : 'Push',
      widgets: existingTemplate?.widgets || [],
    };
    
    dispatch(setCurrentTemplate(templateData));
    setActiveTab('design');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSaveTemplate = async () => {
    if (currentTemplate) {
      try {
        if (isEditing) {
          await updateTemplate(currentTemplate).unwrap();
        } else {
          await createTemplate(currentTemplate).unwrap();
        }
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to save template:', error);
        alert('Failed to save template. Please try again.');
      }
    }
  };

  const hasPermission = (permission: string) => {
    return permissions.includes(permission as any);
  };

  if (isLoadingTemplate) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isEmailTemplate = formData.channel === 'External Email' || formData.channel?.includes('Secure Inbox');

  const tabs = [
    {
      id: 'creation',
      label: 'Template Creation',
      content: <TemplateCreationForm
                  formData={formData}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  setFormData={setFormData}
                  handleCancel={handleCancel}
                  handleNext={handleNext}
                />,
    },
    {
      id: 'design',
      label: !formData.channel
                  ? 'Template Design'
                  : isEmailTemplate
                    ? 'Email Template Design'
                    : 'Push/SMS Template Design',
      content: <TemplateDesignStep
                  isEmailTemplate={isEmailTemplate}
                />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {formData.messageName ? formData.messageName : 'Create New Template'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {activeTab === 'creation' ? 'Set up template metadata' : 'Design your template layout'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 ml-4">
          {(hasPermission('create') || hasPermission('update')) && (
            <Button variant="primary" onClick={handleSaveTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
          )}

          {(activeTab === 'design') && (
            <>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              <Button variant="outline">
                <Languages className="h-4 w-4 mr-2" />
                Translate to Spanish
              </Button>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Format Requirements
              </Button>

              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default CreateTemplatePage;
