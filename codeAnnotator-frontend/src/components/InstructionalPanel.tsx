import React, { useState } from 'react';

export const InstructionalPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'code-smells' | 'anti-patterns'>('code-smells');

  const codeSmellsData = [
    {
      name: 'Feature Envy',
      definition: 'A function or method that accesses another object’s properties or methods more than its own.',
      symptoms: 'Frequent access to external object properties, especially deep chaining.',
      refactoringTip: 'Move logic to the object being accessed or extract into a helper.',
      before: `function calculateTotal(order) {
    return order.customer.discount * 
           order.customer.points * 
           order.amount;
  }`,
      after: `function getTotal() {
    return this.discount * this.points * this.orderAmount;
  }`,
    },
    {
      name: 'Long Method',
      definition: 'A function that tries to handle too many tasks, reducing readability and maintainability.',
      symptoms: 'Dozens of lines, multiple responsibilities, deeply nested logic.',
      refactoringTip: 'Split into smaller, single-purpose functions.',
      before: `useEffect(() => {
    if (!user) return;
    if (user.role === 'Admin') {
      // navigate to admin
    } else {
      // check employee role, validate data, handle errors, etc.
      // 40+ lines
    }
  }, [user]);`,
      after: `useEffect(() => {
    if (!user) return;
    handleUserRedirect(user);
  }, [user]);`
    },
    {
      name: 'Blob',
      definition: 'A module or class with too many unrelated responsibilities and data.',
      symptoms: 'Centralized object managing state, API, rendering, and logic.',
      refactoringTip: 'Split into smaller modules/components based on responsibility.',
      before: `class UserService {
    constructor() {
      this.user = {};
    }
    fetchUser() {...}
    validateForm() {...}
    renderUserProfile() {...}
    updateTheme() {...}
  }`,
      after: `class UserAPI { fetchUser() {...} }
  class UserValidator { validateForm() {...} }
  class UserUI { renderUserProfile() {...} }`
    },
    {
      name: 'Data Class',
      definition: 'A class or interface that only holds data with no behavior or logic.',
      symptoms: 'Only fields and simple getters/setters, logic is handled externally.',
      refactoringTip: 'Encapsulate behavior inside the class or simplify to a plain object.',
      before: `interface User {
    name: string;
    age: number;
  }`,
      after: `class User {
    constructor(public name, public age) {}
    isAdult() {
      return this.age >= 18;
    }
  }`
    }
  ];
  

  const antiPatternsData = [
    {
      name: 'God Class',
      definition: 'A component or service that handles multiple unrelated concerns.',
      symptoms: 'Huge files, many hooks or functions, does fetching, rendering, and business logic.',
      refactoringTip: 'Split into smaller, focused components or services.',
      before: `function Dashboard() {
    useAuth();
    fetchData();
    renderChart();
    handleExport();
    sendEmailReport();
    // hundreds of lines
  }`,
      after: `function Dashboard() {
    useAuth();
    return (
      <>
        <Chart />
        <ExportButton />
        <EmailReport />
      </>
    );
  }`
    },
    {
      name: 'Spaghetti Code',
      definition: 'Code with messy, deeply nested or interdependent logic.',
      symptoms: 'Nested conditionals, poor separation of concerns, hard to follow flow.',
      refactoringTip: 'Use early returns, modularize logic, and flatten structure.',
      before: `if (user) {
    if (user.loggedIn) {
      if (user.role === 'Admin') {
        if (route === '/dashboard') {
          // do something
        }
      }
    }
  }`,
      after: `if (!user?.loggedIn) return;
  if (user.role !== 'Admin') return;
  if (route !== '/dashboard') return;
  // clean logic`
    },
    {
      name: 'Swiss Army Knife',
      definition: 'A module or utility that tries to do too many unrelated things.',
      symptoms: 'Many unrelated methods in one file or class.',
      refactoringTip: 'Split into single-purpose modules.',
      before: `export const Utils = {
    formatDate() {},
    validateEmail() {},
    encryptData() {},
    generateUUID() {},
    renderChart() {}
  }`,
      after: `export const EmailUtils = { validateEmail() {} };
  export const CryptoUtils = { encryptData() {} };
  export const DateUtils = { formatDate() {} };`
    },
    {
      name: 'Magic Numbers/Strings',
      definition: 'Hardcoded values in code with no explanation or naming.',
      symptoms: 'Direct string/number comparisons instead of constants or enums.',
      refactoringTip: 'Use named constants or enums.',
      before: `if (user.role === 'Admin' && score > 70) {
    grantAccess();
  }`,
      after: `const ADMIN_ROLE = 'Admin';
  const MIN_SCORE = 70;
  
  if (user.role === ADMIN_ROLE && score > MIN_SCORE) {
    grantAccess();
  }`
    }
  ];
  

  const currentData = activeTab === 'code-smells' ? codeSmellsData : antiPatternsData;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 flex-shrink-0">
        <button
          onClick={() => setActiveTab('code-smells')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'code-smells'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Code Smells
        </button>
        <button
          onClick={() => setActiveTab('anti-patterns')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'anti-patterns'
              ? 'border-red-500 text-red-600 bg-red-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Anti-Patterns
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {currentData.map((item, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">{item.name}</h4>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Definition: </span>
                  <span className="text-gray-600">{item.definition}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Symptoms: </span>
                  <span className="text-gray-600">{item.symptoms}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Refactoring: </span>
                  <span className="text-gray-600">{item.refactoringTip}</span>
                </div>
                
                <div className="mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="font-medium text-red-700 mb-2">Before</div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 overflow-auto">
                        <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                          <code>{item.before}</code>
                        </pre>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-green-700 mb-2">After</div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 overflow-auto">
                        <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                          <code>{item.after}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
