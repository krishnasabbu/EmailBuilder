import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setTests } from '../store/slices/testsSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Plus, Download, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import testsData from '../data/tests.json';

const NotificationTestPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tests } = useAppSelector(state => state.tests);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  useEffect(() => {
    dispatch(setTests(testsData));
  }, [dispatch]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'InProgress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'InProgress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRunTypeColor = (runType: string) => {
    switch (runType) {
      case 'Functional':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'UAT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleSelectTest = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTests(
      selectedTests.length === tests.length 
        ? [] 
        : tests.map(test => test.id)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notification Testing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage template testing status
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Regression
          </Button>
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Test
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Test Results
          </h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTests.length === tests.length && tests.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Select All
              </span>
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedTests.length} of {tests.length} selected
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={selectedTests.length === tests.length && tests.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Message Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Message Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Run
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Run Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Report
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Initiated By
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Last Run Date
                </th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr
                  key={test.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(test.id)}
                      onChange={() => handleSelectTest(test.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                    {test.messageType}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {test.messageName}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      test.run 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {test.run ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRunTypeColor(test.runType)}`}>
                      {test.runType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(test.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {test.reportUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(test.reportUrl, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {test.initiatedBy}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {new Date(test.lastRunDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tests.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tests found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Start by adding test cases for your notification templates
            </p>
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              Add Test Case
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationTestPage;