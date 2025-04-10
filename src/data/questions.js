export const moduleQuestions = {
  'data-lakehouse-architecture': {
    questions: [
      {
        question: 'What is a key characteristic of a data lakehouse architecture?',
        options: [
          'It only supports structured data',
          'It combines the best features of data lakes and data warehouses',
          'It requires proprietary file formats',
          'It cannot handle real-time data'
        ],
        correctAnswer: 'It combines the best features of data lakes and data warehouses',
        explanation: 'A data lakehouse combines the flexibility of data lakes with the data management features of data warehouses.'
      },
      {
        question: 'Which feature is essential to data lakehouse architecture?',
        options: [
          'ACID transactions',
          'Limited storage capacity',
          'Single data format support',
          'Batch processing only'
        ],
        correctAnswer: 'ACID transactions',
        explanation: 'ACID transactions are essential for ensuring data consistency and reliability in a data lakehouse.'
      },
      {
        question: 'What is Delta Lake?',
        options: [
          'A proprietary database system',
          'An open-source storage layer that brings reliability to data lakes',
          'A cloud-only storage solution',
          'A replacement for traditional databases'
        ],
        correctAnswer: 'An open-source storage layer that brings reliability to data lakes',
        explanation: 'Delta Lake is an open-source storage layer that provides ACID transactions and reliability to data lakes.'
      }
    ]
  },
  'cluster-management': {
    questions: [
      {
        question: 'What is the main difference between all-purpose and jobs clusters?',
        options: [
          'All-purpose clusters are more expensive',
          'Jobs clusters automatically terminate after job completion',
          'All-purpose clusters can only run notebooks',
          'Jobs clusters are always more powerful'
        ],
        correctAnswer: 'Jobs clusters automatically terminate after job completion',
        explanation: 'Jobs clusters are designed to automatically terminate after completing their assigned jobs, while all-purpose clusters remain running until manually terminated.'
      }
    ]
  },
  'notebooks-and-development': {
    questions: [
      {
        question: 'Which languages are supported in Databricks notebooks?',
        options: [
          'Only Python',
          'Python and SQL',
          'Python, R, SQL, and Scala',
          'Python and Java'
        ],
        correctAnswer: 'Python, R, SQL, and Scala',
        explanation: 'Databricks notebooks support multiple languages including Python, R, SQL, and Scala, allowing for flexible development.'
      }
    ]
  }
}; 