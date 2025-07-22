import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { updateComponent, removeComponent, removeWidget, selectComponent } from '../../store/slices/emailEditorSlice';
import InputField from '../ui/InputField';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';
import { Trash2, Settings } from 'lucide-react';
import { ConditionBuilder } from './ConditionBuilder';

const PropertiesPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedComponent } = useAppSelector(state => state.emailEditor);
  const [showConditionModal, setShowConditionModal] = React.useState(false);

  if (!selectedComponent) {
    return (
      <div className="p-6 text-center">
        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Properties Panel
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Select a widget or component to edit its properties
        </p>
      </div>
    );
  }

  const isWidget = 'components' in selectedComponent;

  const handleContentChange = (content: string) => {
    if (!isWidget) {
      dispatch(updateComponent({
        ...selectedComponent,
        content,
      }));
    }
  };

  const handlePropertyChange = (property: string, value: any) => {
    if (!isWidget) {
      dispatch(updateComponent({
        ...selectedComponent,
        properties: {
          ...selectedComponent.properties,
          [property]: value,
        },
      }));
    }
  };

  const handleDelete = () => {
    if (isWidget) {
      dispatch(removeWidget(selectedComponent.id));
    } else {
      dispatch(removeComponent(selectedComponent.id));
    }
    dispatch(selectComponent(null));
  };

  const alignmentOptions = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ];

  const fontWeightOptions = [
    { value: 'normal', label: 'Normal' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semibold' },
    { value: 'bold', label: 'Bold' },
  ];

  const componentType = selectedComponent.type;

  if (isWidget) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Widget Properties
          </h3>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Widget Type
            </label>
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white">
              {componentType} Widget
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Components
            </label>
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white">
              {selectedComponent.components.length} component(s)
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Component Properties
        </h3>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Component Type
          </label>
          <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white">
            {componentType}
          </div>
        </div>

        {(componentType === 'IllustrationImage' || componentType === 'FooterIcons') ? (
          <InputField
            label={componentType === 'IllustrationImage' ? 'Image URL' : 'Content'}
            value={selectedComponent.content}
            onChange={handleContentChange}
            placeholder={componentType === 'IllustrationImage' ? 'Enter image URL' : 'Enter content'}
          />
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <textarea
              value={selectedComponent.content}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
              placeholder="Enter content..."
            />
          </div>
        )}

        {/* <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Font Size"
            value={selectedComponent.properties?.fontSize || ''}
            onChange={(value) => handlePropertyChange('fontSize', value)}
            placeholder="14px"
          />

          <Dropdown
            label="Font Weight"
            value={selectedComponent.properties?.fontWeight || 'normal'}
            onChange={(value) => handlePropertyChange('fontWeight', value)}
            options={fontWeightOptions}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Text Color"
            type="color"
            value={selectedComponent.properties?.color || '#000000'}
            onChange={(value) => handlePropertyChange('color', value)}
          />

          <InputField
            label="Background Color"
            type="color"
            value={selectedComponent.properties?.backgroundColor || '#ffffff'}
            onChange={(value) => handlePropertyChange('backgroundColor', value)}
          />
        </div>

        <Dropdown
          label="Alignment"
          value={selectedComponent.properties?.alignment || 'left'}
          onChange={(value) => handlePropertyChange('alignment', value)}
          options={alignmentOptions}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Padding"
            value={selectedComponent.properties?.padding || ''}
            onChange={(value) => handlePropertyChange('padding', value)}
            placeholder="10px"
          />

          <InputField
            label="Margin"
            value={selectedComponent.properties?.margin || ''}
            onChange={(value) => handlePropertyChange('margin', value)}
            placeholder="10px 0"
          />
        </div> */}

        {/* {componentType === 'CTA' && (
          <InputField
            label="Border Radius"
            value={selectedComponent.properties?.borderRadius || ''}
            onChange={(value) => handlePropertyChange('borderRadius', value)}
            placeholder="6px"
          />
        )}

        {componentType === 'IllustrationImage' && (
          <InputField
            label="Width"
            value={selectedComponent.properties?.width || ''}
            onChange={(value) => handlePropertyChange('width', value)}
            placeholder="100%"
          />
        )}

        {['BodyText', 'FooterText', 'ContactDetails'].includes(componentType) && (
          <InputField
            label="Line Height"
            value={selectedComponent.properties?.lineHeight || ''}
            onChange={(value) => handlePropertyChange('lineHeight', value)}
            placeholder="1.5"
          />
        )} */}

        {componentType === 'Conditions' && (
          <>
            <Button onClick={() => setShowConditionModal(true)} variant="outline">
              Add Condition
            </Button>

            {showConditionModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Define Conditions</h3>
                  <ConditionBuilder
                    groups={selectedComponent.properties?.conditionRules || []}
                    onChange={(rules) => handlePropertyChange('conditionRules', rules)}
                  />
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="secondary" onClick={() => setShowConditionModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowConditionModal(false)}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;