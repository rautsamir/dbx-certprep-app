export const moduleQuestions = {
  'data-lakehouse-architecture': [
    {
      question: 'What is a key advantage of the Data Lakehouse architecture?',
      options: [
        'It only supports structured data',
        'It combines the best features of data lakes and data warehouses',
        'It requires more storage than traditional data warehouses',
        'It only works with SQL queries'
      ],
      correctAnswer: 1,
      explanation: 'Data Lakehouse combines the flexibility of data lakes with the reliability and performance of data warehouses.'
    },
    {
      question: 'Which feature is NOT typically associated with Data Lakehouse architecture?',
      options: [
        'ACID transactions',
        'Schema enforcement',
        'Proprietary file formats only',
        'Support for machine learning'
      ],
      correctAnswer: 2,
      explanation: 'Data Lakehouses typically support open file formats like Parquet and Delta, not just proprietary formats.'
    }
  ],
  'cluster-management': [
    {
      question: 'What is the main difference between all-purpose and job clusters?',
      options: [
        'All-purpose clusters are more expensive',
        'Job clusters terminate automatically after job completion',
        'All-purpose clusters can only run SQL',
        'Job clusters support more languages'
      ],
      correctAnswer: 1,
      explanation: 'Job clusters are designed to terminate automatically after job completion, making them more cost-effective for scheduled workloads.'
    },
    {
      question: 'Which statement about cluster auto-termination is correct?',
      options: [
        'It cannot be disabled',
        'It only works on job clusters',
        'It helps reduce costs by terminating inactive clusters',
        'It terminates clusters exactly after 1 hour'
      ],
      correctAnswer: 2,
      explanation: 'Auto-termination is a cost-saving feature that terminates clusters after a specified period of inactivity.'
    }
  ],
  'notebooks-and-development': [
    {
      question: 'What is a key feature of Databricks notebooks?',
      options: [
        'They only support Python',
        'They support multiple languages in the same notebook',
        'They cannot be scheduled',
        'They require separate clusters for each language'
      ],
      correctAnswer: 1,
      explanation: 'Databricks notebooks support multiple languages (Python, SQL, R, Scala) within the same notebook using magic commands.'
    },
    {
      question: 'How can you share notebook changes with team members?',
      options: [
        'Only through email',
        'Using Databricks Repos with Git integration',
        'By copying the notebook manually',
        'Sharing is not possible'
      ],
      correctAnswer: 1,
      explanation: 'Databricks Repos provides Git integration, allowing teams to collaborate and share notebook changes effectively.'
    }
  ],
  'data-extraction': [
    {
      question: 'Which format is commonly used for efficient big data storage in Databricks?',
      options: [
        'CSV',
        'Parquet',
        'Plain text',
        'Excel'
      ],
      correctAnswer: 1,
      explanation: 'Parquet is a columnar storage format optimized for big data processing with better compression and query performance.'
    },
    {
      question: 'What is the purpose of JDBC in Databricks?',
      options: [
        'To create visualizations',
        'To connect to external databases',
        'To manage clusters',
        'To schedule jobs'
      ],
      correctAnswer: 1,
      explanation: 'JDBC (Java Database Connectivity) is used to connect to and extract data from external databases.'
    }
  ],
  'data-transformation': [
    {
      question: 'What is the purpose of a CTE in SQL?',
      options: [
        'To create temporary tables',
        'To define complex transformations in a readable way',
        'To import external data',
        'To optimize query performance'
      ],
      correctAnswer: 1,
      explanation: 'Common Table Expressions (CTEs) help organize complex transformations into more readable and maintainable code.'
    },
    {
      question: 'Which function would you use to handle nested JSON data in Spark SQL?',
      options: [
        'CAST',
        'EXPLODE',
        'CONCAT',
        'TRIM'
      ],
      correctAnswer: 1,
      explanation: 'The EXPLODE function is commonly used to flatten nested arrays or structures in JSON data.'
    }
  ],
  'delta-lake-fundamentals': [
    {
      question: 'What does ACID stand for in Delta Lake transactions?',
      options: [
        'Asynchronous, Consistent, Isolated, Durable',
        'Atomic, Consistent, Isolated, Durable',
        'Atomic, Concurrent, Integrated, Distributed',
        'Asynchronous, Concurrent, Integrated, Distributed'
      ],
      correctAnswer: 1,
      explanation: 'ACID stands for Atomic, Consistent, Isolated, Durable - fundamental properties that guarantee database transactions are processed reliably.'
    },
    {
      question: 'What is the difference between managed and external tables?',
      options: [
        'Managed tables are faster',
        'External tables support more formats',
        'Managed tables are controlled by Delta Lake, including their data location',
        'External tables are more reliable'
      ],
      correctAnswer: 2,
      explanation: 'Managed tables have their data location controlled by Delta Lake, while external tables point to data in a specified location.'
    }
  ],
  'job-management': [
    {
      question: 'What is the purpose of task dependencies in Databricks jobs?',
      options: [
        'To increase job performance',
        'To define the execution order of tasks',
        'To reduce cluster costs',
        'To backup job data'
      ],
      correctAnswer: 1,
      explanation: 'Task dependencies define the sequence in which tasks should be executed, ensuring proper workflow orchestration.'
    },
    {
      question: 'Which scheduling format is used for Databricks jobs?',
      options: [
        'Simple text',
        'CRON expressions',
        'JSON only',
        'XML format'
      ],
      correctAnswer: 1,
      explanation: 'CRON expressions are used to define job schedules, providing flexible timing options for automated execution.'
    }
  ],
  'unity-catalog': [
    {
      question: 'What is the main purpose of Unity Catalog?',
      options: [
        'To store data',
        'To provide unified governance across workspaces',
        'To create visualizations',
        'To manage clusters'
      ],
      correctAnswer: 1,
      explanation: 'Unity Catalog provides unified data governance across Databricks workspaces, ensuring consistent security and access control.'
    },
    {
      question: 'What is a securable in Unity Catalog?',
      options: [
        'A type of cluster',
        'An object that can have permissions assigned to it',
        'A backup system',
        'A type of visualization'
      ],
      correctAnswer: 1,
      explanation: 'Securables are objects (like catalogs, schemas, tables) that can have access permissions assigned to them in Unity Catalog.'
    }
  ]
}; 