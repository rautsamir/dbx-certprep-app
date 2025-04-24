import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
  Collapse,
  Divider
} from '@mui/material';
import {
  School as SchoolIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Code as CodeIcon
} from '@mui/icons-material';

const moduleContent = {
  'data-lakehouse-architecture': {
    introduction: {
      title: "Introduction to Data Lakehouse Architecture",
      content: `The Data Lakehouse combines the best features of data lakes and data warehouses. 
      It provides data structure and management features similar to data warehouses, directly 
      on the low-cost storage used for data lakes.

      Key Features:
      • ACID transactions
      • Schema enforcement and governance
      • BI support
      • Open storage formats
      • Support for diverse data types
      • Direct data lake access`
    },
    codeExamples: {
      title: "Code Examples",
      examples: [
        {
          title: "Creating a Delta Table",
          code: `# Create a new Delta table
spark.sql("""
CREATE TABLE customer_data (
  id LONG,
  name STRING,
  email STRING,
  signup_date DATE
)
USING DELTA
""")`
        },
        {
          title: "Reading and Writing Data",
          code: `# Write data to Delta table
df.write.format("delta").saveAsTable("customer_data")

# Read data from Delta table
df = spark.table("customer_data")`
        }
      ]
    }
  },
  'cluster-management': {
    introduction: {
      title: "Introduction to Cluster Management",
      content: `Databricks clusters are groups of computers that process your data. Understanding cluster types
      and configurations is crucial for optimal performance and cost management.

      Key Concepts:
      • All-purpose vs Job clusters
      • Cluster configurations and policies
      • Auto-scaling and auto-termination
      • Runtime versions
      • Cluster security and access control`
    },
    codeExamples: {
      title: "Cluster Configuration Examples",
      examples: [
        {
          title: "Cluster Configuration JSON",
          code: `{
  "cluster_name": "my-cluster",
  "spark_version": "13.3.x-scala2.12",
  "node_type_id": "Standard_DS3_v2",
  "spark_conf": {
    "spark.speculation": true
  },
  "num_workers": 2,
  "autotermination_minutes": 120
}`
        },
        {
          title: "Cluster API Example",
          code: `# Python example using Databricks CLI
from databricks_cli.sdk.api_client import ApiClient
from databricks_cli.clusters.api import ClusterApi

api_client = ApiClient(
  host = "https://<databricks-instance>",
  token = "<your-token>"
)

clusters_api = ClusterApi(api_client)
clusters_api.start_cluster("<cluster-id>")`
        }
      ]
    }
  },
  'notebooks-and-development': {
    introduction: {
      title: "Introduction to Notebooks and Development",
      content: `Databricks notebooks provide an interactive environment for data exploration,
      analysis, and collaboration. They support multiple languages and offer various
      features for development and sharing.

      Key Features:
      • Multi-language support (Python, SQL, R, Scala)
      • Magic commands
      • Notebook workflows
      • Version control integration
      • Collaboration features
      • Job scheduling`
    },
    codeExamples: {
      title: "Notebook Examples",
      examples: [
        {
          title: "Magic Commands",
          code: `%sql
-- SQL cell
SELECT * FROM my_table

%python
# Python cell
from pyspark.sql.functions import *
df = spark.table("my_table")

%r
# R cell
library(SparkR)
df <- sql("SELECT * FROM my_table")`
        },
        {
          title: "Notebook Widgets",
          code: `# Create widgets
dbutils.widgets.text("input_path", "", "Input Path")
dbutils.widgets.dropdown("env", "dev", ["dev", "staging", "prod"])

# Get widget values
input_path = dbutils.widgets.get("input_path")
env = dbutils.widgets.get("env")`
        }
      ]
    }
  },
  'data-extraction': {
    introduction: {
      title: "Introduction to Data Extraction",
      content: `Data extraction in Databricks involves reading data from various sources
      into your lakehouse. Understanding different extraction methods and best practices
      is crucial for building reliable data pipelines.

      Key Concepts:
      • File formats (Parquet, Delta, CSV, JSON)
      • Batch vs. Streaming extraction
      • Schema inference and evolution
      • Auto Loader
      • External sources (JDBC, APIs)`
    },
    codeExamples: {
      title: "Data Extraction Examples",
      examples: [
        {
          title: "Auto Loader",
          code: `# Using Auto Loader for incremental ingestion
df = spark.readStream.format("cloudFiles")
  .option("cloudFiles.format", "json")
  .option("cloudFiles.schemaLocation", "/path/to/schema")
  .load("/path/to/input")`
        },
        {
          title: "JDBC Extraction",
          code: `# Reading from external database
df = spark.read
  .format("jdbc")
  .option("url", "jdbc:postgresql://host:port/db")
  .option("dbtable", "schema.table")
  .option("user", "username")
  .option("password", "password")
  .load()`
        }
      ]
    }
  },
  'data-transformation': {
    introduction: {
      title: "Introduction to Data Transformation",
      content: `Data transformation in Databricks involves cleaning, enriching, and
      preparing data for analysis. Understanding transformation patterns and best
      practices is essential for building efficient data pipelines.

      Key Concepts:
      • SQL transformations
      • DataFrame operations
      • Window functions
      • UDFs
      • Complex data types
      • Performance optimization`
    },
    codeExamples: {
      title: "Transformation Examples",
      examples: [
        {
          title: "Window Functions",
          code: `from pyspark.sql.window import Window
from pyspark.sql.functions import *

# Define window spec
windowSpec = Window.partitionBy("category").orderBy("timestamp")

# Apply window functions
df = df.withColumn("running_total", 
    sum("amount").over(windowSpec))`
        },
        {
          title: "Complex Transformations",
          code: `# Handle nested structures
df = df.select(
    "id",
    "timestamp",
    col("details.name").alias("customer_name"),
    explode("items").alias("item"),
    json_tuple(col("metadata"), "source", "version")
)`
        }
      ]
    }
  },
  'sql-operations': {
    introduction: {
      title: "Introduction to SQL Operations",
      content: `SQL operations in Databricks provide powerful data manipulation capabilities.
      Understanding these operations is crucial for effective data transformation and analysis.

      Key Concepts:
      • JOIN operations and types
      • PIVOT and UNPIVOT
      • Window functions
      • Common Table Expressions (CTEs)
      • User-Defined Functions (UDFs)`
    },
    codeExamples: {
      title: "SQL Operations Examples",
      examples: [
        {
          title: "JOIN Operations",
          code: `-- Example of different JOIN types
-- INNER JOIN
SELECT a.*, b.*
FROM table_a a
INNER JOIN table_b b
  ON a.id = b.id;

-- LEFT JOIN with multiple conditions
SELECT a.*, b.*
FROM table_a a
LEFT JOIN table_b b
  ON a.id = b.id
  AND a.date = b.date;`
        },
        {
          title: "PIVOT Operation",
          code: `-- PIVOT example
SELECT *
FROM (
  SELECT product, category, amount
  FROM sales
)
PIVOT (
  sum(amount)
  FOR category IN ('Electronics', 'Clothing', 'Food')
);`
        }
      ]
    }
  },
  'delta-lake-fundamentals': {
    introduction: {
      title: "Introduction to Delta Lake Fundamentals",
      content: `Delta Lake is an open-source storage layer that brings reliability to data lakes.
      Understanding its fundamentals is essential for building reliable data pipelines.

      Key Concepts:
      • ACID transactions
      • Schema enforcement and evolution
      • Time travel capabilities
      • Audit history
      • Unified batch and streaming`
    },
    codeExamples: {
      title: "Delta Lake Examples",
      examples: [
        {
          title: "Basic Delta Operations",
          code: `# Create a Delta table
spark.sql("""
CREATE TABLE events (
  id LONG,
  timestamp TIMESTAMP,
  action STRING
)
USING DELTA
""")

# Time travel query
spark.sql("""
SELECT * FROM events
TIMESTAMP AS OF '2023-01-01'
""")`
        },
        {
          title: "Schema Evolution",
          code: `# Add new column
spark.sql("""
ALTER TABLE events
ADD COLUMN user_id STRING
""")

# Merge schema during write
df.write.option("mergeSchema", "true")
  .format("delta")
  .mode("append")
  .saveAsTable("events")`
        }
      ]
    }
  },
  'delta-lake-operations': {
    introduction: {
      title: "Delta Lake Operations",
      content: `Delta Lake provides various operations for data management and optimization.
      These operations help maintain data quality and improve query performance.

      Key Operations:
      • MERGE for upserts
      • VACUUM for file management
      • OPTIMIZE for compaction
      • Z-ORDER for clustering
      • RESTORE for point-in-time recovery`
    },
    codeExamples: {
      title: "Operation Examples",
      examples: [
        {
          title: "MERGE Operation",
          code: `-- Upsert example
MERGE INTO target t
USING source s
ON t.id = s.id
WHEN MATCHED THEN
  UPDATE SET *
WHEN NOT MATCHED THEN
  INSERT *`
        },
        {
          title: "Optimization Commands",
          code: `-- Optimize table
OPTIMIZE events
ZORDER BY (timestamp);

-- Clean up old files
VACUUM events
RETAIN 168 HOURS;`
        }
      ]
    }
  },
  'delta-live-tables': {
    introduction: {
      title: "Delta Live Tables",
      content: `Delta Live Tables (DLT) provides a declarative framework for building
      reliable data pipelines. It simplifies ETL development with automatic dependency management
      and data quality controls.

      Key Features:
      • Declarative pipeline definitions
      • Automatic data quality controls
      • Built-in error handling
      • Incremental processing
      • Pipeline monitoring and metrics`
    },
    codeExamples: {
      title: "DLT Examples",
      examples: [
        {
          title: "Python DLT Pipeline",
          code: `import dlt
from pyspark.sql.functions import *

@dlt.table
def bronze_events():
  return (
    spark.readStream
      .format("cloudFiles")
      .option("cloudFiles.format", "json")
      .load("/data/events")
  )

@dlt.table
def silver_events():
  return (
    dlt.read("bronze_events")
      .withColumn("processed_timestamp", current_timestamp())
      .dropDuplicates(["event_id"])
  )`
        },
        {
          title: "SQL DLT Pipeline",
          code: `CREATE OR REFRESH STREAMING LIVE TABLE bronze_events
AS SELECT * FROM cloud_files('/data/events', 'json');

CREATE OR REFRESH STREAMING LIVE TABLE silver_events
AS SELECT *,
  current_timestamp() as processed_timestamp
FROM STREAM(LIVE.bronze_events);`
        }
      ]
    }
  },
  'job-management': {
    introduction: {
      title: "Job Management",
      content: `Job management in Databricks involves configuring, scheduling, and monitoring automated workflows.
      Understanding job management is crucial for production deployments.

      Key Concepts:
      • Job configuration
      • Task dependencies
      • Schedule management
      • Monitoring and alerts
      • Resource management`
    },
    codeExamples: {
      title: "Job Configuration Examples",
      examples: [
        {
          title: "Job JSON Configuration",
          code: `{
  "name": "Daily ETL Job",
  "email_notifications": {
    "on_failure": ["team@company.com"]
  },
  "schedule": {
    "quartz_cron_expression": "0 0 1 * * ?",
    "timezone_id": "UTC"
  },
  "tasks": [
    {
      "task_key": "ingest",
      "notebook_task": {
        "notebook_path": "/ETL/ingest",
        "base_parameters": {
          "date": "{{date}}"
        }
      },
      "job_cluster_key": "etl_cluster"
    }
  ]
}`
        },
        {
          title: "Job API Example",
          code: `from databricks_cli.jobs.api import JobsApi

jobs_api = JobsApi(api_client)
job_config = {
  "name": "Scheduled ETL",
  "schedule": {
    "quartz_cron_expression": "0 0 * * * ?"
  }
}

job_id = jobs_api.create_job(job_config)
jobs_api.run_now(job_id)`
        }
      ]
    }
  },
  'error-handling': {
    introduction: {
      title: "Error Handling",
      content: `Proper error handling is crucial for building reliable data pipelines.
      This includes implementing retry logic, monitoring, and alerting mechanisms.

      Key Concepts:
      • Error types and classification
      • Retry policies
      • Alert configuration
      • Error logging
      • Recovery procedures`
    },
    codeExamples: {
      title: "Error Handling Examples",
      examples: [
        {
          title: "Try-Except Pattern",
          code: `def process_data():
  try:
    df = spark.read.table("source")
    # Processing logic
    df.write.mode("append").saveAsTable("target")
  except Exception as e:
    log_error(e)
    send_alert("Data processing failed", str(e))
    raise`
        },
        {
          title: "Alert Configuration",
          code: `{
  "job_id": 123,
  "alert_settings": {
    "alert_on_last_attempt": true,
    "min_failure_duration_min": 30,
    "notification_settings": {
      "email_recipients": ["team@company.com"],
      "slack_recipients": ["#alerts"]
    }
  }
}`
        }
      ]
    }
  }
};

const LearningModule = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  // Track study time
  useEffect(() => {
    setStartTime(Date.now());

    return () => {
      const endTime = Date.now();
      const studyTime = Math.round((endTime - startTime) / 1000 / 60); // Convert to minutes

      // Only record if spent more than 1 minute
      if (studyTime >= 1) {
        const today = new Date().toISOString().split('T')[0];
        const studyStreak = JSON.parse(localStorage.getItem('study_streak') || '[]');
        
        const todayIndex = studyStreak.findIndex(day => day.date === today);
        if (todayIndex >= 0) {
          studyStreak[todayIndex].minutes += studyTime;
        } else {
          studyStreak.push({
            date: today,
            minutes: studyTime
          });
        }

        // Keep only last 30 days
        const recentStreak = studyStreak
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 30);

        localStorage.setItem('study_streak', JSON.stringify(recentStreak));

        // Update activity timestamps
        const activityTimestamps = JSON.parse(localStorage.getItem('activity_timestamps') || '{}');
        activityTimestamps[`${moduleId}_study`] = Date.now();
        localStorage.setItem('activity_timestamps', JSON.stringify(activityTimestamps));
      }
    };
  }, [moduleId]);

  const handleQuizClick = () => {
    navigate(`/module/${moduleId}/quiz`);
  };

  const handleSectionClick = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handlePracticeExercise = (exerciseId) => {
    navigate(`/practice/${moduleId}/${exerciseId}`);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Typography variant="h4">{moduleId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Typography>
        <Chip icon={<SchoolIcon />} label="Learning" color="primary" />
        <Chip 
          icon={<QuizIcon />} 
          label="Take Quiz" 
          color="secondary"
          onClick={handleQuizClick}
          sx={{ 
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'secondary.dark'
            }
          }}
        />
      </Box>

      <List sx={{ mb: 3 }}>
        <ListItem 
          button 
          onClick={() => handleSectionClick('introduction')}
          sx={{ mb: 1 }}
        >
          <ListItemIcon>
            <CheckCircleIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Introduction" />
          {expandedSection === 'introduction' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={expandedSection === 'introduction'} timeout="auto" unmountOnExit>
          <Paper sx={{ p: 3, ml: 4, mr: 2, my: 1, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              {moduleContent[moduleId].introduction.title}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {moduleContent[moduleId].introduction.content}
            </Typography>
          </Paper>
        </Collapse>

        <ListItem 
          button 
          onClick={() => handleSectionClick('codeExamples')}
          sx={{ mb: 1 }}
        >
          <ListItemIcon>
            <CheckCircleIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Code Examples" />
          {expandedSection === 'codeExamples' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={expandedSection === 'codeExamples'} timeout="auto" unmountOnExit>
          <Paper sx={{ p: 3, ml: 4, mr: 2, my: 1, bgcolor: 'background.default' }}>
            {moduleContent[moduleId].codeExamples.examples.map((example, index) => (
              <Box key={index} sx={{ mb: index < moduleContent[moduleId].codeExamples.examples.length - 1 ? 3 : 0 }}>
                <Typography variant="h6" gutterBottom>
                  {example.title}
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.900' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      color: 'common.white',
                      whiteSpace: 'pre',
                      overflowX: 'auto'
                    }}
                  >
                    {example.code}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Paper>
        </Collapse>

        <ListItem 
          button 
          onClick={handleQuizClick}
          sx={{ 
            '&:hover': {
              backgroundColor: 'primary.light',
              '& .MuiListItemIcon-root': {
                color: 'primary.main'
              }
            }
          }}
        >
          <ListItemIcon>
            <QuizIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Quiz" 
            primaryTypographyProps={{
              color: 'primary'
            }}
          />
        </ListItem>
      </List>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Practice Exercises
        </Typography>
        <List>
          <ListItem 
            button 
            onClick={() => handlePracticeExercise('compare-warehouse')}
            sx={{ mb: 1 }}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Compare traditional data warehouse vs lakehouse architecture" />
          </ListItem>
          <ListItem 
            button 
            onClick={() => handlePracticeExercise('use-cases')}
            sx={{ mb: 1 }}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Identify use cases for data lakehouse" />
          </ListItem>
          <ListItem 
            button 
            onClick={() => handlePracticeExercise('delta-lake')}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Explain Delta Lake benefits" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default LearningModule; 