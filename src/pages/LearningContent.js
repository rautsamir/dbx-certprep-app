import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton,
} from '@mui/material';
import {
  Code as CodeIcon,
  Description as DescriptionIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Comprehensive learning content for all topics
const learningContent = {
  'Data Lakehouse Architecture': {
    overview: 'The Databricks Lakehouse Platform combines the best elements of data lakes and data warehouses to provide a unified platform for data storage, processing, and analytics.',
    sections: [
      {
        title: 'Data Lakehouse vs Data Warehouse',
        content: [
          'A data lakehouse is a new, open data management architecture that combines the flexibility, cost-efficiency, and scale of data lakes with the data management and ACID transactions of data warehouses.',
          {
            title: 'Key differences:',
            points: [
              'Data lakes store raw data in its original format',
              'Data warehouses store processed data in a structured format',
              'Lakehouses combine both approaches with ACID transactions',
              'Lakehouses support both structured and unstructured data'
            ]
          },
          {
            title: 'Benefits:',
            points: [
              'Reduced data redundancy',
              'Lower storage costs',
              'Simplified architecture',
              'Enhanced data quality',
              'Improved query performance'
            ]
          }
        ],
        codeExample: `
-- Example: Creating a table in a lakehouse
CREATE TABLE IF NOT EXISTS my_table (
  id INT,
  name STRING,
  created_at TIMESTAMP
)
USING DELTA
LOCATION '/mnt/data/my_table'`,
        quiz: [
          {
            question: 'What is the main advantage of a lakehouse over a traditional data warehouse?',
            options: [
              'Lower storage costs',
              'Support for both structured and unstructured data',
              'Better query performance',
              'Simpler architecture'
            ],
            correctAnswer: 1
          }
        ]
      },
      {
        title: 'Data Quality Improvements',
        content: [
          'Data quality in a lakehouse is improved through:',
          {
            title: 'Key Features:',
            points: [
              {
                name: 'Schema Enforcement',
                details: [
                  'Ensures data consistency',
                  'Prevents invalid data',
                  'Maintains data structure'
                ]
              },
              {
                name: 'Data Validation',
                details: [
                  'Checks for data accuracy',
                  'Validates business rules',
                  'Ensures referential integrity'
                ]
              },
              {
                name: 'Quality Monitoring',
                details: [
                  'Real-time quality checks',
                  'Automated alerts',
                  'Performance metrics'
                ]
              }
            ]
          }
        ],
        codeExample: `
-- Example: Adding data quality constraints
ALTER TABLE my_table
ADD CONSTRAINT valid_id CHECK (id > 0);

-- Example: Data quality check
SELECT COUNT(*) as invalid_records
FROM my_table
WHERE id <= 0;

-- Example: Setting up quality monitoring
CREATE OR REPLACE VIEW data_quality_metrics AS
SELECT
  date_trunc('day', created_at) as check_date,
  COUNT(*) as total_records,
  COUNT(CASE WHEN id <= 0 THEN 1 END) as invalid_ids,
  COUNT(CASE WHEN name IS NULL THEN 1 END) as null_names
FROM my_table
GROUP BY 1
ORDER BY 1 DESC;`,
        quiz: [
          {
            question: 'Which of the following is NOT a data quality improvement feature in Databricks?',
            options: [
              'Schema enforcement',
              'Data validation',
              'Automatic data cleaning',
              'Data lineage tracking'
            ],
            correctAnswer: 2
          }
        ]
      }
    ]
  },
  'Cluster Management': {
    overview: 'Databricks clusters provide the compute resources needed to process data and run analytics. Understanding cluster management is crucial for optimizing performance and costs.',
    sections: [
      {
        title: 'All-purpose vs Jobs Clusters',
        content: [
          'Databricks offers two main types of clusters:',
          {
            title: '1. All-purpose clusters:',
            points: [
              'Used for interactive development',
              'Support multiple users',
              'Can run notebooks and jobs',
              'Ideal for development and testing',
              'Auto-termination for cost savings'
            ]
          },
          {
            title: '2. Jobs clusters:',
            points: [
              'Used for production workloads',
              'Single-user mode',
              'Optimized for reliability',
              'Cost-effective for scheduled jobs',
              'Automatic job-based scaling'
            ]
          },
          {
            title: 'Key Considerations:',
            points: [
              'Cost optimization',
              'Performance requirements',
              'User access patterns',
              'Workload patterns',
              'Security requirements'
            ]
          }
        ],
        codeExample: `
# Example: Creating a cluster using Databricks CLI
databricks clusters create \\
  --cluster-name "My Cluster" \\
  --spark-version "7.3.x-scala2.12" \\
  --node-type-id "Standard_DS3_v2" \\
  --num-workers 2 \\
  --autoscale \\
  --min-workers 1 \\
  --max-workers 4

# Example: Configuring auto-termination
databricks clusters configure \\
  --cluster-id "0123-456789-abc123" \\
  --auto-termination-minutes 120`,
        quiz: [
          {
            question: 'Which type of cluster is best suited for interactive development?',
            options: [
              'Jobs cluster',
              'All-purpose cluster',
              'High-concurrency cluster',
              'Single-node cluster'
            ],
            correctAnswer: 1
          }
        ]
      }
    ]
  },
  'Delta Lake Fundamentals': {
    overview: 'Delta Lake is an open-source storage layer that brings ACID transactions, scalable metadata handling, and unified streaming and batch data processing to data lakes.',
    sections: [
      {
        title: 'ACID Transactions',
        content: `
          Delta Lake provides ACID transactions, which ensure data consistency and reliability:
          
          1. Atomicity:
          - All operations succeed or fail together
          - No partial updates
          - Transaction rollback on failure
          
          2. Consistency:
          - Data remains valid
          - Constraints maintained
          - Referential integrity preserved
          
          3. Isolation:
          - Concurrent transactions don't interfere
          - Serializable isolation level
          - Snapshot isolation
          
          4. Durability:
          - Committed changes are permanent
          - Transaction logging
          - Fault tolerance
        `,
        codeExample: `
          -- Example: Creating a Delta table with ACID transactions
          CREATE TABLE IF NOT EXISTS events (
            event_id STRING,
            event_time TIMESTAMP,
            event_type STRING,
            user_id STRING
          )
          USING DELTA
          PARTITIONED BY (date(event_time));
          
          -- Example: Performing an ACID transaction
          BEGIN TRANSACTION;
          
          INSERT INTO events
          SELECT * FROM new_events;
          
          UPDATE events
          SET event_type = 'corrected_type'
          WHERE event_type = 'incorrect_type';
          
          COMMIT;

          -- Example: Concurrent operations
          -- Transaction 1
          BEGIN TRANSACTION;
          UPDATE events
          SET event_type = 'type_1'
          WHERE event_id = '123';
          COMMIT;

          -- Transaction 2 (runs concurrently)
          BEGIN TRANSACTION;
          UPDATE events
          SET event_type = 'type_2'
          WHERE event_id = '456';
          COMMIT;
        `,
        quiz: [
          {
            question: 'What does the "I" in ACID transactions stand for?',
            options: [
              'Independent',
              'Isolation',
              'Integrity',
              'Immediate',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        title: 'Time Travel',
        content: `
          Delta Lake Time Travel capabilities:
          
          1. Version History:
          - Track all changes
          - Query previous versions
          - Audit trail
          
          2. Time Travel Operations:
          - Query by version number
          - Query by timestamp
          - Restore to previous versions
          
          3. Use Cases:
          - Audit compliance
          - Error recovery
          - Reproducible reports
          - Historical analysis
        `,
        codeExample: `
          -- Example: Query data at a specific version
          SELECT * FROM events VERSION AS OF 123;
          
          -- Example: Query data at a specific timestamp
          SELECT * FROM events TIMESTAMP AS OF '2024-03-01 12:00:00';
          
          -- Example: Restore table to previous version
          RESTORE TABLE events TO VERSION AS OF 123;
          
          -- Example: View table history
          DESCRIBE HISTORY events;
        `,
        quiz: [
          {
            question: 'Which of the following is NOT a valid way to query historical data in Delta Lake?',
            options: [
              'Using VERSION AS OF',
              'Using TIMESTAMP AS OF',
              'Using DATE AS OF',
              'Using RESTORE TO VERSION',
            ],
            correctAnswer: 2,
          },
        ],
      },
    ],
  },
  'Delta Live Tables': {
    overview: 'Delta Live Tables (DLT) is a declarative framework for building reliable, maintainable, and testable data processing pipelines.',
    sections: [
      {
        title: 'Pipeline Development',
        content: `
          Delta Live Tables Pipeline Components:
          
          1. Tables and Views:
          - Live Tables: Materialized views
          - Streaming Live Tables: Real-time data
          - Live Views: Non-materialized views
          
          2. Quality Control:
          - Expectations: Data quality rules
          - Constraints: Data validation
          - Quality monitoring
          
          3. Pipeline Configuration:
          - Development mode
          - Production mode
          - Scheduling options
          - Resource allocation
        `,
        codeExample: `
          -- Example: Creating a streaming live table
          CREATE OR REFRESH STREAMING LIVE TABLE raw_events
          COMMENT "Raw events from source"
          AS SELECT * FROM cloud_files("/data/events", "json");

          -- Example: Creating a live table with expectations
          CREATE OR REFRESH LIVE TABLE validated_events (
            CONSTRAINT valid_event_id EXPECT (event_id IS NOT NULL),
            CONSTRAINT valid_timestamp EXPECT (event_time > '2020-01-01')
          ) AS
          SELECT *
          FROM STREAM(LIVE.raw_events);

          -- Example: Creating a live view
          CREATE OR REFRESH LIVE VIEW daily_metrics
          AS SELECT
            date_trunc('day', event_time) as event_date,
            COUNT(*) as event_count,
            COUNT(DISTINCT user_id) as unique_users
          FROM LIVE.validated_events
          GROUP BY 1;
        `,
        quiz: [
          {
            question: 'What is the main difference between a Live Table and a Live View in DLT?',
            options: [
              'Live Tables support streaming data',
              'Live Tables are materialized while Live Views are not',
              'Live Tables support data quality rules',
              'Live Tables are faster to query',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        title: 'Pipeline Monitoring',
        content: `
          Monitoring Features in DLT:
          
          1. Data Quality Metrics:
          - Expectation pass/fail rates
          - Record counts
          - Processing latency
          
          2. Pipeline Health:
          - Cluster utilization
          - Processing throughput
          - Error tracking
          
          3. Operational Metrics:
          - Pipeline lineage
          - Resource consumption
          - Cost analysis
        `,
        codeExample: `
          -- Example: Querying pipeline metrics
          SELECT *
          FROM system.pipeline_metrics
          WHERE pipeline_id = current_pipeline()
          ORDER BY timestamp DESC;

          -- Example: Monitoring data quality
          SELECT
            expectation_name,
            COUNT(*) as total_checks,
            SUM(CASE WHEN passed THEN 1 ELSE 0 END) as passed_checks,
            SUM(CASE WHEN passed THEN 0 ELSE 1 END) as failed_checks
          FROM system.expectations
          GROUP BY expectation_name;

          -- Example: Analyzing pipeline performance
          SELECT
            operation_type,
            AVG(duration_ms) as avg_duration,
            MAX(duration_ms) as max_duration,
            COUNT(*) as operation_count
          FROM system.pipeline_events
          GROUP BY operation_type;
        `,
        quiz: [
          {
            question: 'Which system table provides information about data quality expectations in DLT?',
            options: [
              'system.pipeline_metrics',
              'system.expectations',
              'system.pipeline_events',
              'system.quality_metrics',
            ],
            correctAnswer: 1,
          },
        ],
      },
    ],
  },
  'Unity Catalog': {
    overview: 'Unity Catalog provides centralized governance for data, analytics, and AI assets across all workspaces in a Databricks account.',
    sections: [
      {
        title: 'Three-Level Namespace',
        content: `
          Unity Catalog Namespace Structure:
          
          1. Catalog Level:
          - Top-level container
          - Organizational boundary
          - Cross-workspace access
          
          2. Schema Level:
          - Logical grouping
          - Access control boundary
          - Data organization
          
          3. Object Level:
          - Tables
          - Views
          - Functions
          - External locations
        `,
        codeExample: `
          -- Example: Creating and using catalogs
          CREATE CATALOG IF NOT EXISTS production;
          USE CATALOG production;

          -- Example: Creating and using schemas
          CREATE SCHEMA IF NOT EXISTS sales;
          USE SCHEMA sales;

          -- Example: Creating managed tables
          CREATE TABLE IF NOT EXISTS customers (
            customer_id BIGINT,
            name STRING,
            email STRING,
            created_at TIMESTAMP
          );

          -- Example: Cross-catalog queries
          SELECT *
          FROM production.sales.customers c
          JOIN analytics.reporting.customer_metrics m
          ON c.customer_id = m.customer_id;
        `,
        quiz: [
          {
            question: 'What is the correct order of the three-level namespace in Unity Catalog?',
            options: [
              'Schema > Catalog > Table',
              'Catalog > Schema > Table',
              'Table > Schema > Catalog',
              'Schema > Table > Catalog',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        title: 'Access Control',
        content: `
          Unity Catalog Access Control Features:
          
          1. Fine-grained Access Control:
          - Table-level permissions
          - Column-level security
          - Row-level security
          
          2. Identity Management:
          - User authentication
          - Service principals
          - Group management
          
          3. Audit Logging:
          - Access patterns
          - Permission changes
          - Data access history
        `,
        codeExample: `
          -- Example: Granting permissions
          GRANT SELECT ON TABLE customers TO group data_analysts;
          GRANT MODIFY ON SCHEMA sales TO user jane@company.com;

          -- Example: Column-level security
          GRANT SELECT ON TABLE customers (customer_id, name)
          TO group customer_service;

          -- Example: Row-level security
          CREATE ROW FILTER region_filter ON sales.transactions
          AS region = current_user_region();

          -- Example: Auditing access
          SELECT *
          FROM system.access_history
          WHERE table_name = 'customers'
          AND timestamp > current_timestamp() - INTERVAL 7 DAYS;
        `,
        quiz: [
          {
            question: 'Which type of security is NOT supported by Unity Catalog?',
            options: [
              'Table-level security',
              'Column-level security',
              'Row-level security',
              'Cell-level security',
            ],
            correctAnswer: 3,
          },
        ],
      },
    ],
  },
  'Production Pipelines': {
    overview: 'Production pipelines in Databricks ensure reliable, scalable, and maintainable data processing workflows.',
    sections: [
      {
        title: 'Workflow Orchestration',
        content: `
          Databricks Workflow Components:
          
          1. Jobs:
          - Scheduled execution
          - Task dependencies
          - Resource management
          
          2. Tasks:
          - Notebooks
          - Python scripts
          - SQL queries
          - DLT pipelines
          
          3. Job Clusters:
          - Automated provisioning
          - Job-specific configs
          - Cost optimization
        `,
        codeExample: `
          # Example: Creating a job using the Jobs API
          job_json = {
            "name": "Daily ETL Pipeline",
            "tasks": [
              {
                "task_key": "ingest_data",
                "notebook_task": {
                  "notebook_path": "/ETL/ingest",
                  "base_parameters": {
                    "date": "{{date}}"
                  }
                },
                "job_cluster_key": "etl_cluster"
              },
              {
                "task_key": "transform_data",
                "depends_on": [
                  {"task_key": "ingest_data"}
                ],
                "notebook_task": {
                  "notebook_path": "/ETL/transform"
                },
                "job_cluster_key": "etl_cluster"
              }
            ],
            "job_clusters": [
              {
                "job_cluster_key": "etl_cluster",
                "new_cluster": {
                  "spark_version": "11.3.x-scala2.12",
                  "node_type_id": "Standard_DS3_v2",
                  "num_workers": 2
                }
              }
            ],
            "schedule": {
              "quartz_cron_expression": "0 0 1 * * ?",
              "timezone_id": "UTC"
            }
          }
        `,
        quiz: [
          {
            question: 'Which of the following is NOT a valid task type in Databricks Workflows?',
            options: [
              'Notebook task',
              'Python script task',
              'SQL task',
              'Shell script task',
            ],
            correctAnswer: 3,
          },
        ],
      },
      {
        title: 'Monitoring and Alerting',
        content: `
          Production Monitoring Features:
          
          1. Job Monitoring:
          - Execution status
          - Runtime metrics
          - Resource utilization
          
          2. Alerting:
          - Job failures
          - SLA violations
          - Resource constraints
          
          3. Logging:
          - Execution logs
          - Error tracking
          - Performance metrics
        `,
        codeExample: `
          # Example: Setting up email notifications
          notification_settings = {
            "on_failure": [
              {
                "email_notifications": {
                  "addresses": [
                    "team@company.com"
                  ]
                }
              }
            ],
            "on_success": [
              {
                "email_notifications": {
                  "addresses": [
                    "reports@company.com"
                  ]
                }
              }
            ]
          }

          # Example: Querying job runs
          runs_df = spark.sql("""
            SELECT
              job_id,
              run_id,
              start_time,
              end_time,
              state,
              trigger_type
            FROM system.job_runs
            WHERE start_time > current_timestamp() - INTERVAL 24 HOURS
            ORDER BY start_time DESC
          """)

          # Example: Setting up webhook notifications
          webhook_settings = {
            "webhook_notifications": {
              "on_failure": [
                {
                  "url": "https://api.pagerduty.com/incidents",
                  "headers": {"Authorization": "Bearer {{secrets/pagerduty_token}}"}
                }
              ]
            }
          }
        `,
        quiz: [
          {
            question: 'What is the best way to monitor job execution times in Databricks?',
            options: [
              'Check the job logs manually',
              'Query the system.job_runs table',
              'Use print statements in the code',
              'Monitor cluster metrics',
            ],
            correctAnswer: 1,
          },
        ],
      },
    ],
  },
  // Add more topics here...
};

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function LearningContent() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/learning-modules');
  };

  if (!learningContent[topic]) {
    return (
      <Container>
        <Typography variant="h4">Topic not found</Typography>
        <Button onClick={handleBack}>Back to Learning Modules</Button>
      </Container>
    );
  }

  const content = learningContent[topic];

  return (
    <Container>
      <Box mb={3}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {topic}
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Typography variant="body1" p={3}>
          {content.overview}
        </Typography>
      </Paper>

      {content.sections.map((section, index) => (
        <Paper key={index} sx={{ mb: 3 }}>
          <Box p={3}>
            <Typography variant="h5" gutterBottom>
              {section.title}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab icon={<DescriptionIcon />} label="Content" />
              <Tab icon={<CodeIcon />} label="Code Example" />
              <Tab icon={<QuizIcon />} label="Quiz" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              {Array.isArray(section.content) ? (
                section.content.map((item, i) => (
                  typeof item === 'string' ? (
                    <Typography key={i} paragraph>
                      {item}
                    </Typography>
                  ) : (
                    <Box key={i} mb={2}>
                      <Typography variant="h6">{item.title}</Typography>
                      <List>
                        {item.points.map((point, j) => (
                          <ListItem key={j}>
                            <ListItemIcon>
                              <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText 
                              primary={typeof point === 'string' ? point : point.name}
                              secondary={point.details && point.details.join(', ')}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )
                ))
              ) : (
                <Typography>{section.content}</Typography>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box
                component="pre"
                sx={{
                  p: 2,
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  overflow: 'auto'
                }}
              >
                <code>{section.codeExample}</code>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              {section.quiz.map((quizItem, i) => (
                <Box key={i} mb={3}>
                  <Typography variant="h6" gutterBottom>
                    {quizItem.question}
                  </Typography>
                  <List>
                    {quizItem.options.map((option, j) => (
                      <ListItem key={j} button>
                        <ListItemIcon>
                          {j === quizItem.correctAnswer ? (
                            <QuizIcon color="primary" />
                          ) : (
                            <QuizIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText primary={option} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </TabPanel>
          </Box>
        </Paper>
      ))}
    </Container>
  );
}

export default LearningContent; 