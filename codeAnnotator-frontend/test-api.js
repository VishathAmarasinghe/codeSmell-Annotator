const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing snippet API...');
    const response = await axios.get('http://localhost:5500/snippets/next');
    console.log('Snippet API Response:', response.data);
    console.log('Response type:', typeof response.data);
    console.log('Languages field:', response.data.languages, 'Type:', typeof response.data.languages);
    
    // Test annotation submission
    console.log('\nTesting annotation submission...');
    const annotationData = {
      annotator: "test_user",
      type: "CODE_SMELL",
      languages: ["JavaScript"],
      startLine: 1,
      endLine: 10,
      code: "function test() { console.log('test'); }",
      status: "SUBMITTED",
      codeSnippetId: response.data.id,
      annotations: [
        {
          smellType: "LongMethod",
          category: "code-smell",
          suggestion: "Method is too long"
        }
      ]
    };
    
    const submitResponse = await axios.post('http://localhost:5500/annotations', annotationData);
    console.log('Annotation submission response:', submitResponse.data);
    
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI(); 
