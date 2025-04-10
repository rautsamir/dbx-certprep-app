import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  Chip,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Timer as TimerIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  Launch as LaunchIcon,
  Quiz as QuizIcon,
  Grade as GradeIcon,
  Block as BlockIcon,
  PlayArrow as PlayArrowIcon,
  History as HistoryIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useUser } from '../context/UserContext';

const EXAM_CONFIGS = {
  custom: {
    duration: 7200, // 2 hours in seconds
    totalQuestions: 60,
    passingScore: 70,
    name: 'Custom Mock Exam'
  },
  official: {
    duration: 5400, // 90 minutes in seconds
    totalQuestions: 45,
    passingScore: 70,
    name: 'Official Practice Exam'
  }
};

const officialMockExam = {
  questions: [
    {
      id: 1,
      category: "Databricks Lakehouse Platform",
      question: "Which of the following describes a benefit of a data lakehouse that is unavailable in a traditional data warehouse?",
      options: [
        "A data lakehouse provides a relational system of data management.",
        "A data lakehouse captures snapshots of data for version control purposes.",
        "A data lakehouse couples storage and compute for complete control.",
        "A data lakehouse utilizes proprietary storage formats for data.",
        "A data lakehouse enables both batch and streaming analytics."
      ],
      correctAnswer: 4,
      explanation: "A data lakehouse enables both batch and streaming analytics, which is not available in traditional data warehouses."
    },
    {
      id: 2,
      category: "Databricks Lakehouse Platform",
      question: "Which of the following locations hosts the driver and worker nodes of a Databricks-managed cluster?",
      options: [
        "Data plane",
        "Control plane",
        "Databricks Filesystem",
        "JDBC data source",
        "Databricks web application"
      ],
      correctAnswer: 0,
      explanation: "The data plane hosts the driver and worker nodes of a Databricks-managed cluster."
    },
    {
      id: 3,
      category: "Databricks Lakehouse Platform",
      question: "A data architect is designing a data model that works for both video-based machine learning workloads and highly audited batch ETL/ELT workloads. Which of the following describes how using a data lakehouse can help the data architect meet the needs of both workloads?",
      options: [
        "A data lakehouse requires very little data modeling.",
        "A data lakehouse combines compute and storage for simple governance.",
        "A data lakehouse provides autoscaling for compute clusters.",
        "A data lakehouse stores unstructured data and is ACID-compliant.",
        "A data lakehouse fully exists in the cloud."
      ],
      correctAnswer: 3,
      explanation: "A data lakehouse stores unstructured data and is ACID-compliant, making it suitable for both ML workloads and ETL/ELT workloads."
    },
    {
      id: 4,
      category: "Databricks Lakehouse Platform",
      question: "Which of the following describes a scenario in which a data engineer will want to use a Job cluster instead of an all-purpose cluster?",
      options: [
        "An ad-hoc analytics report needs to be developed while minimizing compute costs.",
        "A data team needs to collaborate on the development of a machine learning model.",
        "An automated workflow needs to be run every 30 minutes.",
        "A Databricks SQL query needs to be scheduled for upward reporting.",
        "A data engineer needs to manually investigate a production error."
      ],
      correctAnswer: 2,
      explanation: "Job clusters are ideal for automated workflows that run on a schedule, such as every 30 minutes."
    },
    {
      id: 5,
      category: "Databricks Lakehouse Platform",
      question: "A data engineer has created a Delta table as part of a data pipeline. Downstream data analysts now need SELECT permission on the Delta table. Assuming the data engineer is the Delta table owner, which part of the Databricks Lakehouse Platform can the data engineer use to grant the data analysts the appropriate access?",
      options: [
        "Repos",
        "Jobs",
        "Data Explorer",
        "Databricks Filesystem",
        "Dashboards"
      ],
      correctAnswer: 2,
      explanation: "Data Explorer can be used to grant SELECT permissions on Delta tables to data analysts."
    },
    {
      id: 6,
      category: "Databricks Lakehouse Platform",
      question: "Two junior data engineers are authoring separate parts of a single data pipeline notebook. They are working on separate Git branches so they can pair program on the same notebook simultaneously. A senior data engineer experienced in Databricks suggests there is a better alternative for this type of collaboration. Which of the following supports the senior data engineer's claim?",
      options: [
        "Databricks Notebooks support automatic change-tracking and versioning",
        "Databricks Notebooks support real-time coauthoring on a single notebook",
        "Databricks Notebooks support commenting and notification comments",
        "Databricks Notebooks support the use of multiple languages in the same notebook",
        "Databricks Notebooks support the creation of interactive data visualizations"
      ],
      correctAnswer: 1,
      explanation: "Databricks Notebooks support real-time coauthoring on a single notebook, making it easier for multiple engineers to work together."
    },
    {
      id: 7,
      category: "Databricks Lakehouse Platform",
      question: "Which of the following describes how Databricks Repos can help facilitate CI/CD workflows on the Databricks Lakehouse Platform?",
      options: [
        "Databricks Repos can facilitate the pull request, review, and approval process before merging branches",
        "Databricks Repos can merge changes from a secondary Git branch into a main Git branch",
        "Databricks Repos can be used to design, develop, and trigger Git automation pipelines",
        "Databricks Repos can store the single-source-of-truth Git repository",
        "Databricks Repos can commit or push code changes to trigger a CI/CD process"
      ],
      correctAnswer: 4,
      explanation: "Databricks Repos can commit or push code changes to trigger a CI/CD process, enabling automated workflows."
    },
    {
      id: 8,
      category: "Delta Lake",
      question: "Which of the following statements describes Delta Lake?",
      options: [
        "Delta Lake is an open source analytics engine used for big data workloads.",
        "Delta Lake is an open format storage layer that delivers reliability, security, and performance.",
        "Delta Lake is an open source platform to help manage the complete machine learning lifecycle.",
        "Delta Lake is an open source data storage format for distributed data.",
        "Delta Lake is an open format storage layer that processes data."
      ],
      correctAnswer: 1,
      explanation: "Delta Lake is an open format storage layer that delivers reliability, security, and performance for data lakes."
    },
    {
      id: 9,
      category: "Delta Lake",
      question: "A data architect has determined that a table of the following format is necessary: id, a1, birthDate, 1990-01-06, avgRating, 5.5, a2, …, 1974-11-21, …, 7.1, … Which of the following code blocks uses SQL DDL commands to create an empty Delta table in the above format regardless of whether a table already exists with this name?",
      options: [
        "CREATE OR REPLACE TABLE table_name AS SELECT id STRING, birthDate DATE, avgRating FLOAT USING DELTA",
        "CREATE OR REPLACE TABLE table_name (id STRING, birthDate DATE, avgRating FLOAT)",
        "CREATE TABLE IF NOT EXISTS table_name (id STRING, birthDate DATE, avgRating FLOAT)",
        "CREATE TABLE table_name AS SELECT id STRING, birthDate DATE, avgRating FLOAT",
        "CREATE OR REPLACE TABLE table_name WITH COLUMNS (id STRING, birthDate DATE, avgRating FLOAT) USING DELTA"
      ],
      correctAnswer: 1,
      explanation: "CREATE OR REPLACE TABLE with column definitions is the correct way to create an empty Delta table regardless of whether it exists."
    },
    {
      id: 10,
      category: "Delta Lake",
      question: "Which of the following SQL keywords can be used to append new rows to an existing Delta table?",
      options: [
        "UPDATE",
        "COPY",
        "INSERT INTO",
        "DELETE",
        "UNION"
      ],
      correctAnswer: 2,
      explanation: "INSERT INTO is the SQL keyword used to append new rows to an existing Delta table."
    },
    {
      id: 11,
      category: "Delta Lake",
      question: "A data engineering team needs to query a Delta table to extract rows that all meet the same condition. However, the team has noticed that the query is running slowly. The team has already tuned the size of the data files. Upon investigating, the team has concluded that the rows meeting the condition are sparsely located throughout each of the data files. Based on the scenario, which of the following optimization techniques could speed up the query?",
      options: [
        "Data skipping",
        "Z-Ordering",
        "Bin-packing",
        "Write as a Parquet file",
        "Tuning the file size"
      ],
      correctAnswer: 1,
      explanation: "Z-Ordering is the appropriate optimization technique when rows meeting a condition are sparsely located throughout data files."
    },
    {
      id: 12,
      category: "Delta Lake",
      question: "A data engineer needs to create a database called customer360 at the location /customer/customer360. The data engineer is unsure if one of their colleagues has already created the database. Which of the following commands should the data engineer run to complete this task?",
      options: [
        "CREATE DATABASE customer360 LOCATION '/customer/customer360';",
        "CREATE DATABASE IF NOT EXISTS customer360;",
        "CREATE DATABASE IF NOT EXISTS customer360 LOCATION '/customer/customer360';",
        "CREATE DATABASE IF NOT EXISTS customer360 DELTA LOCATION '/customer/customer360';",
        "CREATE DATABASE customer360 DELTA LOCATION '/customer/customer360';"
      ],
      correctAnswer: 2,
      explanation: "CREATE DATABASE IF NOT EXISTS with LOCATION is the correct command to create a database at a specific location if it doesn't already exist."
    },
    {
      id: 13,
      category: "Delta Lake",
      question: "A junior data engineer needs to create a Spark SQL table my_table for which Spark manages both the data and the metadata. The metadata and data should also be stored in the Databricks Filesystem (DBFS). Which of the following commands should a senior data engineer share with the junior data engineer to complete this task?",
      options: [
        "CREATE TABLE my_table (id STRING, value STRING) USING org.apache.spark.sql.parquet OPTIONS (PATH 'storage-path');",
        "CREATE MANAGED TABLE my_table (id STRING, value STRING) USING org.apache.spark.sql.parquet OPTIONS (PATH 'storage-path');",
        "CREATE MANAGED TABLE my_table (id STRING, value STRING);",
        "CREATE TABLE my_table (id STRING, value STRING) USING DBFS;",
        "CREATE TABLE my_table (id STRING, value STRING);"
      ],
      correctAnswer: 4,
      explanation: "CREATE TABLE without additional options creates a managed table where Spark manages both data and metadata in DBFS."
    },
    {
      id: 14,
      category: "Delta Lake",
      question: "A data engineer wants to create a relational object by pulling data from two tables. The relational object must be used by other data engineers in other sessions. In order to save on storage costs, the data engineer wants to avoid copying and storing physical data. Which of the following relational objects should the data engineer create?",
      options: [
        "View",
        "Temporary view",
        "Delta Table",
        "Database",
        "Spark SQL Table"
      ],
      correctAnswer: 0,
      explanation: "A View is the appropriate relational object when you want to avoid storing physical data while making the data available to other sessions."
    },
    {
      id: 15,
      category: "Delta Lake",
      question: "A data engineering team has created a series of tables using Parquet data stored in an external system. The team is noticing that after appending new rows to the data in the external system, their queries within Databricks are not returning the new rows. They identify the caching of the previous data as the cause of this issue. Which of the following approaches will ensure that the data returned by queries is always up-to-date?",
      options: [
        "The tables should be converted to the Delta format",
        "The tables should be stored in a cloud-based external system",
        "The tables should be refreshed in the writing cluster before the next query is run",
        "The tables should be altered to include metadata to not cache",
        "The tables should be updated before the next query is run"
      ],
      correctAnswer: 0,
      explanation: "Converting the tables to Delta format will ensure that queries always return up-to-date data."
    },
    {
      id: 16,
      category: "Delta Lake",
      question: "A table customerLocations exists with the following schema: id STRING, date STRING, city STRING, country STRING. A senior data engineer wants to create a new table from this table using the following command: CREATE TABLE customersPerCountry AS SELECT country, COUNT(*) AS customers FROM customerLocations GROUP BY country; A junior data engineer asks why the schema is not being declared for the new table. Which of the following responses explains why declaring the schema is not necessary?",
      options: [
        "CREATE TABLE AS SELECT statements adopt schema details from the source table and query.",
        "CREATE TABLE AS SELECT statements infer the schema by scanning the data.",
        "CREATE TABLE AS SELECT statements result in tables where schemas are optional.",
        "CREATE TABLE AS SELECT statements assign all columns the type STRING.",
        "CREATE TABLE AS SELECT statements result in tables that do not support schemas."
      ],
      correctAnswer: 0,
      explanation: "CREATE TABLE AS SELECT statements automatically adopt the schema details from the source table and query."
    },
    {
      id: 17,
      category: "Delta Lake",
      question: "A data engineer is overwriting data in a table by deleting the table and recreating the table. Another data engineer suggests that this is inefficient and the table should simply be overwritten instead. Which of the following reasons to overwrite the table instead of deleting and recreating the table is incorrect?",
      options: [
        "Overwriting a table is efficient because no files need to be deleted.",
        "Overwriting a table results in a clean table history for logging and audit purposes.",
        "Overwriting a table maintains the old version of the table for Time Travel.",
        "Overwriting a table is an atomic operation and will not leave the table in an unfinished state.",
        "Overwriting a table allows for concurrent queries to be completed while in progress."
      ],
      correctAnswer: 1,
      explanation: "Overwriting a table does not result in a clean table history - it actually maintains the history for Time Travel purposes."
    },
    {
      id: 18,
      category: "Delta Lake",
      question: "Which of the following commands will return records from an existing Delta table my_table where duplicates have been removed?",
      options: [
        "DROP DUPLICATES FROM my_table;",
        "SELECT * FROM my_table WHERE duplicate = False;",
        "SELECT DISTINCT * FROM my_table;",
        "MERGE INTO my_table a USING new_records b ON a.id = b.id WHEN NOT MATCHED THEN INSERT *;",
        "MERGE INTO my_table a USING new_records b;"
      ],
      correctAnswer: 2,
      explanation: "SELECT DISTINCT * is the correct command to remove duplicates from a Delta table."
    },
    {
      id: 19,
      category: "Delta Lake",
      question: "A data engineer wants to horizontally combine two tables as a part of a query. They want to use a shared column as a key column, and they only want the query result to contain rows whose value in the key column is present in both tables. Which of the following SQL commands can they use to accomplish this task?",
      options: [
        "INNER JOIN",
        "OUTER JOIN",
        "LEFT JOIN",
        "MERGE",
        "UNION"
      ],
      correctAnswer: 0,
      explanation: "INNER JOIN is the correct SQL command to combine tables and only keep rows where the key column exists in both tables."
    },
    {
      id: 20,
      category: "Delta Lake",
      question: "A junior data engineer has ingested a JSON file into a table raw_table with the following schema: cart_id STRING, items ARRAY<item_id:STRING> The junior data engineer would like to unnest the items column in raw_table to result in a new table with the following schema: cart_id STRING, item_id STRING Which of the following commands should the junior data engineer run to complete this task?",
      options: [
        "SELECT cart_id, filter(items) AS item_id FROM raw_table;",
        "SELECT cart_id, flatten(items) AS item_id FROM raw_table;",
        "SELECT cart_id, reduce(items) AS item_id FROM raw_table;",
        "SELECT cart_id, explode(items) AS item_id FROM raw_table;",
        "SELECT cart_id, slice(items) AS item_id FROM raw_table;"
      ],
      correctAnswer: 3,
      explanation: "The explode function is used to unnest array columns in Spark SQL."
    },
    {
      id: 21,
      category: "Delta Lake",
      question: "A data engineer has ingested a JSON file into a table raw_table with the following schema: transaction_id STRING, payload ARRAY<customer_id:STRING, date:TIMESTAMP, store_id:STRING> The data engineer wants to efficiently extract the date of each transaction into a table with the following schema: transaction_id STRING, date TIMESTAMP Which of the following commands should the data engineer run to complete this task?",
      options: [
        "SELECT transaction_id, explode(payload) FROM raw_table;",
        "SELECT transaction_id, payload.date FROM raw_table;",
        "SELECT transaction_id, date FROM raw_table;",
        "SELECT transaction_id, payload[date] FROM raw_table;",
        "SELECT transaction_id, date from payload FROM raw_table;"
      ],
      correctAnswer: 1,
      explanation: "Using dot notation (payload.date) is the correct way to access nested fields in a struct within an array."
    },
    {
      id: 22,
      category: "Delta Lake",
      question: "A data analyst has provided a data engineering team with the following Spark SQL query: SELECT district, avg(sales) FROM store_sales_20220101 GROUP BY district; The data analyst would like the data engineering team to run this query every day. The date at the end of the table name (20220101) should automatically be replaced with the current date each time the query is run. Which of the following approaches could be used by the data engineering team to efficiently automate this process?",
      options: [
        "They could wrap the query using PySpark and use Python's string variable system to automatically update the table name.",
        "They could manually replace the date within the table name with the current day's date.",
        "They could request that the data analyst rewrites the query to be run less frequently.",
        "They could replace the string-formatted date in the table with a timestamp-formatted date.",
        "They could pass the table into PySpark and develop a robustly tested module on the existing query."
      ],
      correctAnswer: 0,
      explanation: "Using PySpark with Python's string variable system is the most efficient way to automate the daily table name updates."
    },
    {
      id: 23,
      category: "Delta Lake",
      question: "A data engineer has ingested data from an external source into a PySpark DataFrame raw_df. They need to briefly make this data available in SQL for a data analyst to perform a quality assurance check on the data. Which of the following commands should the data engineer run to make this data available in SQL for only the remainder of the Spark session?",
      options: [
        "raw_df.createOrReplaceTempView('raw_df')",
        "raw_df.createTable('raw_df')",
        "raw_df.write.save('raw_df')",
        "raw_df.saveAsTable('raw_df')",
        "There is no way to share data between PySpark and SQL."
      ],
      correctAnswer: 0,
      explanation: "createOrReplaceTempView creates a temporary view that is only available for the current Spark session."
    },
    {
      id: 24,
      category: "Delta Lake",
      question: "A data engineer needs to dynamically create a table name string using three Python variables: region, store, and year. An example of a table name is below when region = 'nyc', store = '100', and year = '2021': nyc100_sales_2021 Which of the following commands should the data engineer use to construct the table name in Python?",
      options: [
        "'{region}+{store}+_sales_+{year}'",
        "f'{region}+{store}+_sales_+{year}'",
        "'{region}{store}_sales_{year}'",
        "f'{region}{store}_sales_{year}'",
        "{region}+{store}+'_sales_'+{year}"
      ],
      correctAnswer: 3,
      explanation: "Using an f-string with the correct format is the proper way to construct the table name string in Python."
    },
    {
      id: 25,
      category: "Delta Lake",
      question: "A data engineer has developed a code block to perform a streaming read on a data source. The code block is below: (spark.read.schema(schema).format('cloudFiles').option('cloudFiles.format', 'json').load(dataSource)) The code block is returning an error. Which of the following changes should be made to the code block to configure the block to successfully perform a streaming read?",
      options: [
        "The .read line should be replaced with .readStream.",
        "A new .stream line should be added after the .read line.",
        "The .format('cloudFiles') line should be replaced with .format('stream').",
        "A new .stream line should be added after the spark line.",
        "A new .stream line should be added after the .load(dataSource) line."
      ],
      correctAnswer: 0,
      explanation: "For streaming reads, .read should be replaced with .readStream."
    },
    {
      id: 26,
      category: "Delta Lake",
      question: "A data engineer has configured a Structured Streaming job to read from a table, manipulate the data, and then perform a streaming write into a new table. The code block used by the data engineer is below: (spark.table('sales').withColumn('avg_price', col('sales') / col('units')).writeStream.option('checkpointLocation', checkpointPath).outputMode('complete')._____.table('new_sales')) If the data engineer only wants the query to execute a single micro-batch to process all of the available data, which of the following lines of code should the data engineer use to fill in the blank?",
      options: [
        "trigger(once=True)",
        "trigger(continuous='once')",
        "processingTime('once')",
        "trigger(processingTime='once')",
        "processingTime(1)"
      ],
      correctAnswer: 0,
      explanation: "trigger(once=True) is the correct option to execute a single micro-batch and then stop."
    },
    {
      id: 27,
      category: "Delta Lake",
      question: "A data engineer is designing a data pipeline. The source system generates files in a shared directory that is also used by other processes. As a result, the files should be kept as is and will accumulate in the directory. The data engineer needs to identify which files are new since the previous run in the pipeline, and set up the pipeline to only ingest those new files with each run. Which of the following tools can the data engineer use to solve this problem?",
      options: [
        "Databricks SQL",
        "Delta Lake",
        "Unity Catalog",
        "Data Explorer",
        "Auto Loader"
      ],
      correctAnswer: 4,
      explanation: "Auto Loader is designed to incrementally process new files while keeping existing files intact."
    },
    {
      id: 28,
      category: "Delta Lake",
      question: "A data engineering team is in the process of converting their existing data pipeline to utilize Auto Loader for incremental processing in the ingestion of JSON files. One data engineer comes across the following code block in the Auto Loader documentation: (streaming_df = spark.readStream.format('cloudFiles').option('cloudFiles.format', 'json').option('cloudFiles.schemaLocation', schemaLocation).load(sourcePath)) Assuming that schemaLocation and sourcePath have been set correctly, which of the following changes does the data engineer need to make to convert this code block to use Auto Loader to ingest the data?",
      options: [
        "The data engineer needs to change the format('cloudFiles') line to format('autoLoader').",
        "There is no change required. Databricks automatically uses Auto Loader for streaming reads.",
        "There is no change required. The inclusion of format('cloudFiles') enables the use of Auto Loader.",
        "The data engineer needs to add the .autoLoader line before the .load(sourcePath) line.",
        "There is no change required. The data engineer needs to ask their administrator to turn on Auto Loader."
      ],
      correctAnswer: 2,
      explanation: "The format('cloudFiles') option is what enables Auto Loader functionality."
    },
    {
      id: 29,
      category: "Delta Lake",
      question: "Which of the following data workloads will utilize a Bronze table as its source?",
      options: [
        "A job that aggregates cleaned data to create standard summary statistics",
        "A job that queries aggregated data to publish key insights into a dashboard",
        "A job that ingests raw data from a streaming source into the Lakehouse",
        "A job that develops a feature set for a machine learning application",
        "A job that enriches data by parsing its timestamps into a human-readable format"
      ],
      correctAnswer: 4,
      explanation: "A job that enriches data by parsing timestamps would use a Bronze table as its source, as Bronze tables contain raw, unprocessed data."
    },
    {
      id: 30,
      category: "Delta Lake",
      question: "Which of the following data workloads will utilize a Silver table as its source?",
      options: [
        "A job that enriches data by parsing its timestamps into a human-readable format",
        "A job that queries aggregated data that already feeds into a dashboard",
        "A job that ingests raw data from a streaming source into the Lakehouse",
        "A job that aggregates cleaned data to create standard summary statistics",
        "A job that cleans data by removing malformatted records"
      ],
      correctAnswer: 3,
      explanation: "A job that aggregates cleaned data would use a Silver table as its source, as Silver tables contain cleaned and validated data."
    },
    {
      id: 31,
      category: "Delta Lake",
      question: "Which of the following Structured Streaming queries is performing a hop from a Bronze table to a Silver table?",
      options: [
        "(spark.table('sales').groupBy('store').agg(sum('sales')).writeStream.option('checkpointLocation', checkpointPath).outputMode('complete').table('aggregatedSales'))",
        "(spark.table('sales').agg(sum('sales'), sum('units')).writeStream.option('checkpointLocation', checkpointPath).outputMode('complete').table('aggregatedSales'))",
        "(spark.table('sales').withColumn('avgPrice', col('sales') / col('units')).writeStream.option('checkpointLocation', checkpointPath).outputMode('append').table('cleanedSales'))",
        "(spark.readStream.load(rawSalesLocation).writeStream.option('checkpointLocation', checkpointPath).outputMode('append').table('uncleanedSales'))",
        "(spark.read.load(rawSalesLocation).writeStream.option('checkpointLocation', checkpointPath).outputMode('append').table('uncleanedSales'))"
      ],
      correctAnswer: 2,
      explanation: "The query that transforms data from 'sales' to 'cleanedSales' with a new calculated column represents a Bronze to Silver transformation."
    },
    {
      id: 32,
      category: "Delta Lake",
      question: "Which of the following benefits does Delta Live Tables provide for ELT pipelines over standard data pipelines that utilize Spark and Delta Lake on Databricks?",
      options: [
        "The ability to declare and maintain data table dependencies",
        "The ability to write pipelines in Python and/or SQL",
        "The ability to access previous versions of data tables",
        "The ability to automatically scale compute resources",
        "The ability to perform batch and streaming queries"
      ],
      correctAnswer: 0,
      explanation: "Delta Live Tables provides the ability to declare and maintain data table dependencies, which is not available in standard pipelines."
    },
    {
      id: 33,
      category: "Delta Lake",
      question: "A data engineer has three notebooks in an ELT pipeline. The notebooks need to be executed in a specific order for the pipeline to complete successfully. The data engineer would like to use Delta Live Tables to manage this process. Which of the following steps must the data engineer take as part of implementing this pipeline using Delta Live Tables?",
      options: [
        "They need to create a Delta Live Tables pipeline from the Data page.",
        "They need to create a Delta Live Tables pipeline from the Jobs page.",
        "They need to create a Delta Live tables pipeline from the Compute page.",
        "They need to refactor their notebook to use Python and the dlt library.",
        "They need to refactor their notebook to use SQL and CREATE LIVE TABLE keyword."
      ],
      correctAnswer: 1,
      explanation: "Delta Live Tables pipelines must be created from the Jobs page to manage notebook execution order."
    },
    {
      id: 34,
      category: "Delta Lake",
      question: "A data engineer has written the following query: SELECT * FROM json.`/path/to/json/file.json`; The data engineer asks a colleague for help to convert this query for use in a Delta Live Tables (DLT) pipeline. The query should create the first table in the DLT pipeline. Which of the following describes the change the colleague needs to make to the query?",
      options: [
        "They need to add a COMMENT line at the beginning of the query.",
        "They need to add a CREATE LIVE TABLE table_name AS line at the beginning of the query.",
        "They need to add a live. prefix prior to json. in the FROM line.",
        "They need to add a CREATE DELTA LIVE TABLE table_name AS line at the beginning of the query.",
        "They need to add the cloud_files(...) wrapper to the JSON file path."
      ],
      correctAnswer: 1,
      explanation: "Adding CREATE LIVE TABLE table_name AS at the beginning of the query is required for DLT pipelines."
    },
    {
      id: 35,
      category: "Delta Lake",
      question: "A dataset has been defined using Delta Live Tables and includes an expectations clause: CONSTRAINT valid_timestamp EXPECT (timestamp > '2020-01-01') What is the expected behavior when a batch of data containing data that violates these constraints is processed?",
      options: [
        "Records that violate the expectation are added to the target dataset and recorded as invalid in the event log.",
        "Records that violate the expectation are dropped from the target dataset and recorded as invalid in the event log.",
        "Records that violate the expectation cause the job to fail.",
        "Records that violate the expectation are added to the target dataset and flagged as invalid in a field added to the target dataset.",
        "Records that violate the expectation are dropped from the target dataset and loaded into a quarantine table."
      ],
      correctAnswer: 0,
      explanation: "In Delta Live Tables, records that violate expectations are added to the target dataset and recorded as invalid in the event log."
    },
    {
      id: 36,
      category: "Delta Lake",
      question: "A Delta Live Table pipeline includes two datasets defined using STREAMING LIVE TABLE. Three datasets are defined against Delta Lake table sources using LIVE TABLE. The table is configured to run in Development mode using the Triggered Pipeline Mode. Assuming previously unprocessed data exists and all definitions are valid, what is the expected outcome after clicking Start to update the pipeline?",
      options: [
        "All datasets will be updated once and the pipeline will shut down. The compute resources will be terminated.",
        "All datasets will be updated at set intervals until the pipeline is shut down. The compute resources will be deployed for the update and terminated when the pipeline is stopped.",
        "All datasets will be updated at set intervals until the pipeline is shut down. The compute resources will persist after the pipeline is stopped to allow for additional testing.",
        "All datasets will be updated once and the pipeline will shut down. The compute resources will persist to allow for additional testing.",
        "All datasets will be updated continuously and the pipeline will not shut down. The compute resources will persist with the pipeline."
      ],
      correctAnswer: 3,
      explanation: "In Development mode with Triggered Pipeline Mode, datasets are updated once and compute resources persist for testing."
    },
    {
      id: 37,
      category: "Delta Lake",
      question: "A data engineer has a Job with multiple tasks that runs nightly. One of the tasks unexpectedly fails during 10 percent of the runs. Which of the following actions can the data engineer perform to ensure the Job completes each night while minimizing compute costs?",
      options: [
        "They can institute a retry policy for the entire Job",
        "They can observe the task as it runs to try and determine why it is failing",
        "They can set up the Job to run multiple times ensuring that at least one will complete",
        "They can institute a retry policy for the task that periodically fails",
        "They can utilize a Jobs cluster for each of the tasks in the Job"
      ],
      correctAnswer: 3,
      explanation: "Setting up a retry policy for the specific failing task is the most cost-effective solution."
    },
    {
      id: 38,
      category: "Delta Lake",
      question: "A data engineer has set up two Jobs that each run nightly. The first Job starts at 12:00 AM, and it usually completes in about 20 minutes. The second Job depends on the first Job, and it starts at 12:30 AM. Sometimes, the second Job fails when the first Job does not complete by 12:30 AM. Which of the following approaches can the data engineer use to avoid this problem?",
      options: [
        "They can utilize multiple tasks in a single job with a linear dependency",
        "They can use cluster pools to help the Jobs run more efficiently",
        "They can set up a retry policy on the first Job to help it run more quickly",
        "They can limit the size of the output in the second Job so that it will not fail as easily",
        "They can set up the data to stream from the first Job to the second Job"
      ],
      correctAnswer: 0,
      explanation: "Using multiple tasks in a single job with linear dependencies ensures proper sequencing."
    },
    {
      id: 39,
      category: "Delta Lake",
      question: "A data engineer has set up a notebook to automatically process using a Job. The data engineer's manager wants to version control the schedule due to its complexity. Which of the following approaches can the data engineer use to obtain a version-controllable configuration of the Job's schedule?",
      options: [
        "They can link the Job to notebooks that are a part of a Databricks Repo.",
        "They can submit the Job once on a Job cluster.",
        "They can download the JSON description of the Job from the Job's page.",
        "They can submit the Job once on an all-purpose cluster.",
        "They can download the XML description of the Job from the Job's page."
      ],
      correctAnswer: 2,
      explanation: "Downloading the JSON description of the Job provides a version-controllable configuration."
    },
    {
      id: 40,
      category: "Delta Lake",
      question: "A data analyst has noticed that their Databricks SQL queries are running too slowly. They claim that this issue is affecting all of their sequentially run queries. They ask the data engineering team for help. The data engineering team notices that each of the queries uses the same SQL endpoint, but the SQL endpoint is not used by any other user. Which of the following approaches can the data engineering team use to improve the latency of the data analyst's queries?",
      options: [
        "They can turn on the Serverless feature for the SQL endpoint.",
        "They can increase the maximum bound of the SQL endpoint's scaling range.",
        "They can increase the cluster size of the SQL endpoint.",
        "They can turn on the Auto Stop feature for the SQL endpoint.",
        "They can turn on the Serverless feature for the SQL endpoint and change the Spot Instance Policy to 'Reliability Optimized.'"
      ],
      correctAnswer: 2,
      explanation: "Increasing the cluster size of the SQL endpoint will improve query performance."
    },
    {
      id: 41,
      category: "Delta Lake",
      question: "An engineering manager uses a Databricks SQL query to monitor their team's progress on fixes related to customer-reported bugs. The manager checks the results of the query every day, but they are manually rerunning the query each day and waiting for the results. Which of the following approaches can the manager use to ensure the results of the query are updated each day?",
      options: [
        "They can schedule the query to run every 1 day from the Jobs UI.",
        "They can schedule the query to refresh every 1 day from the query's page in Databricks SQL.",
        "They can schedule the query to run every 12 hours from the Jobs UI.",
        "They can schedule the query to refresh every 1 day from the SQL endpoint's page in Databricks SQL.",
        "They can schedule the query to refresh every 12 hours from the SQL endpoint's page in Databricks SQL."
      ],
      correctAnswer: 1,
      explanation: "Scheduling the query to refresh from the query's page in Databricks SQL is the correct approach."
    },
    {
      id: 42,
      category: "Delta Lake",
      question: "A data engineering team has been using a Databricks SQL query to monitor the performance of an ELT job. The ELT job is triggered by a specific number of input records being ready to process. The Databricks SQL query returns the number of minutes since the job's most recent runtime. Which of the following approaches can enable the data engineering team to be notified if the ELT job has not been run in an hour?",
      options: [
        "They can set up an Alert for the accompanying dashboard to notify them if the returned value is greater than 60.",
        "They can set up an Alert for the query to notify when the ELT job fails.",
        "They can set up an Alert for the accompanying dashboard to notify when it has not refreshed in 60 minutes.",
        "They can set up an Alert for the query to notify them if the returned value is greater than 60.",
        "This type of alerting is not possible in Databricks."
      ],
      correctAnswer: 3,
      explanation: "Setting up an Alert on the query to notify when the returned value is greater than 60 minutes is the correct approach."
    },
    {
      id: 43,
      category: "Delta Lake",
      question: "A data engineering manager has noticed that each of the queries in a Databricks SQL dashboard takes a few minutes to update when they manually click the 'Refresh' button. They are curious why this might be occurring, so a team member provides a variety of reasons on why the delay might be occurring. Which of the following reasons fails to explain why the dashboard might be taking a few minutes to update?",
      options: [
        "The SQL endpoint being used by each of the queries might need a few minutes to start up.",
        "The queries attached to the dashboard might take a few minutes to run under normal circumstances.",
        "The queries attached to the dashboard might first be checking to determine if new data is available.",
        "The Job associated with updating the dashboard might be using a non-pooled endpoint.",
        "The queries attached to the dashboard might all be connected to their own, unstarted Databricks clusters."
      ],
      correctAnswer: 3,
      explanation: "Using a non-pooled endpoint is not a reason for dashboard update delays."
    },
    {
      id: 44,
      category: "Delta Lake",
      question: "A new data engineer has started at a company. The data engineer has recently been added to the company's Databricks workspace as new.engineer@company.com. The data engineer needs to be able to query the table sales in the database retail. The new data engineer already has been granted USAGE on the database retail. Which of the following commands can be used to grant the appropriate permissions to the new data engineer?",
      options: [
        "GRANT USAGE ON TABLE sales TO new.engineer@company.com;",
        "GRANT CREATE ON TABLE sales TO new.engineer@company.com;",
        "GRANT SELECT ON TABLE sales TO new.engineer@company.com;",
        "GRANT USAGE ON TABLE new.engineer@company.com TO sales;",
        "GRANT SELECT ON TABLE new.engineer@company.com TO sales;"
      ],
      correctAnswer: 2,
      explanation: "GRANT SELECT ON TABLE is the correct command to allow querying a table."
    },
    {
      id: 45,
      category: "Delta Lake",
      question: "A new data engineer new.engineer@company.com has been assigned to an ELT project. The new data engineer will need full privileges on the table sales to fully manage the project. Which of the following commands can be used to grant full permissions on the table to the new data engineer?",
      options: [
        "GRANT ALL PRIVILEGES ON TABLE sales TO new.engineer@company.com;",
        "GRANT USAGE ON TABLE sales TO new.engineer@company.com;",
        "GRANT ALL PRIVILEGES ON TABLE new.engineer@company.com TO sales;",
        "GRANT SELECT ON TABLE sales TO new.engineer@company.com;",
        "GRANT SELECT CREATE MODIFY ON TABLE sales TO new.engineer@company.com;"
      ],
      correctAnswer: 0,
      explanation: "GRANT ALL PRIVILEGES ON TABLE is the correct command to grant full permissions on a table."
    }
  ]
};

const mockExam = {
  questions: [
    {
      id: 1,
      category: "Databricks Lakehouse Platform",
      question: "What is the primary advantage of using a data lakehouse architecture?",
      options: [
        "Lower storage costs compared to data warehouses",
        "Combines the best features of data lakes and data warehouses",
        "Faster query performance than traditional databases",
        "Simplified data management without schema enforcement"
      ],
      correctAnswer: 1,
      explanation: "A data lakehouse architecture combines the flexibility and cost-effectiveness of data lakes with the data management and ACID transaction support of data warehouses."
    },
    {
      id: 2,
      category: "Delta Lake Operations",
      question: "Which Delta Lake feature enables point-in-time queries of historical data?",
      options: [
        "VACUUM command",
        "OPTIMIZE command",
        "Time Travel",
        "MERGE operation"
      ],
      correctAnswer: 2,
      explanation: "Delta Lake's Time Travel feature allows you to query historical versions of your data using timestamps or version numbers."
    },
    {
      id: 3,
      category: "Production Pipelines",
      question: "What is the purpose of Auto Loader in Delta Live Tables?",
      options: [
        "To automatically scale cluster resources",
        "To incrementally process new data files",
        "To load data from external databases",
        "To optimize table performance"
      ],
      correctAnswer: 1,
      explanation: "Auto Loader is used to incrementally and efficiently process new data files as they arrive in cloud storage."
    },
    {
      id: 4,
      category: "Data Governance",
      question: "How does Unity Catalog enhance data governance in Databricks?",
      options: [
        "By providing a unified security model across workspaces",
        "By automating data backup processes",
        "By compressing stored data",
        "By limiting access to specific clusters"
      ],
      correctAnswer: 0,
      explanation: "Unity Catalog provides a unified security model that enables consistent data access control across multiple Databricks workspaces."
    },
    {
      id: 5,
      category: "Apache Spark",
      question: "What is the advantage of using Delta Lake's MERGE operation?",
      options: [
        "It only performs updates",
        "It only performs inserts",
        "It performs atomic upserts",
        "It performs data validation"
      ],
      correctAnswer: 2,
      explanation: "Delta Lake's MERGE operation enables atomic upserts, allowing you to simultaneously update existing records and insert new ones in a single transaction."
    }
  ]
};

const MockTest = () => {
  const navigate = useNavigate();
  const { examType } = useParams();
  const { userProfile, updateUserProfile } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [selectedExam, setSelectedExam] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [examHistory, setExamHistory] = useState(() => {
    const saved = localStorage.getItem('mock_exam_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [showExamInfo, setShowExamInfo] = useState(false);
  const [examInfoType, setExamInfoType] = useState(null);

  useEffect(() => {
    if (examType && (examType === 'custom' || examType === 'official')) {
      setSelectedExam(examType);
      setIsStarted(true);
    }
  }, [examType]);

  useEffect(() => {
    if (selectedExam) {
      setTimeLeft(EXAM_CONFIGS[selectedExam].duration);
    }
  }, [selectedExam]);

  useEffect(() => {
    let timer;
    if (isStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished, timeLeft]);

  useEffect(() => {
    localStorage.setItem('mock_exam_history', JSON.stringify(examHistory));
  }, [examHistory]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (examType) => {
    const newExam = {
      type: examType,
      startTime: new Date().toISOString(),
      config: EXAM_CONFIGS[examType]
    };
    localStorage.setItem('current_exam', JSON.stringify(newExam));
    navigate(`/mock-exam/${examType}`);
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleFlagQuestion = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleTimeUp = () => {
    setIsFinished(true);
    calculateResults();
  };

  const getExamQuestions = () => {
    return selectedExam === 'official' ? officialMockExam.questions : mockExam.questions;
  };

  const calculateResults = () => {
    let correct = 0;
    let categoryScores = {};
    const questions = getExamQuestions();

    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
        categoryScores[question.category] = (categoryScores[question.category] || 0) + 1;
      }
    });

    const result = {
      totalQuestions: questions.length,
      correctAnswers: correct,
      score: (correct / questions.length) * 100,
      timeSpent: EXAM_CONFIGS[selectedExam].duration - timeLeft,
      categoryScores
    };

    setExamResult(result);
    
    const updatedProfile = {
      ...userProfile,
      mockTestsTaken: (userProfile.mockTestsTaken || 0) + 1,
      lastMockTestScore: result.score
    };
    updateUserProfile(updatedProfile);

    const newHistory = {
      date: new Date().toISOString(),
      type: selectedExam,
      score: result.score,
      timeTaken: result.timeSpent,
      examType: selectedExam
    };
    setExamHistory(prev => [...prev, newHistory]);
  };

  const handleSubmit = () => {
    setShowConfirmSubmit(true);
  };

  const confirmSubmit = () => {
    setShowConfirmSubmit(false);
    setIsFinished(true);
    calculateResults();
  };

  const handleExit = () => {
    setShowConfirmExit(true);
  };

  const confirmExit = () => {
    navigate('/dashboard');
  };

  const handleReviewExam = () => {
    setShowReview(true);
  };

  const handleShowExamInfo = (type) => {
    setExamInfoType(type);
    setShowExamInfo(true);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : `${minutes} minutes`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!selectedExam) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">Choose Your Practice Exam</Typography>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => setShowHistory(true)}
          >
            View History
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': { boxShadow: 6 }
              }}
              onClick={() => handleShowExamInfo('custom')}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Custom Mock Exam
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Our carefully crafted mock exam that simulates the actual Databricks Data Engineer certification:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <TimerIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Duration: ${formatDuration(EXAM_CONFIGS.custom.duration)}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <QuizIcon />
                    </ListItemIcon>
                    <ListItemText primary={`${EXAM_CONFIGS.custom.totalQuestions} multiple choice questions`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <GradeIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Passing score: ${EXAM_CONFIGS.custom.passingScore}%`} />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartExam('custom');
                  }}
                >
                  Start Custom Mock
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': { boxShadow: 6 }
              }}
              onClick={() => handleShowExamInfo('official')}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Official Practice Exam
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Take the official Databricks practice exam directly in our platform:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <TimerIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Duration: ${formatDuration(EXAM_CONFIGS.official.duration)}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <QuizIcon />
                    </ListItemIcon>
                    <ListItemText primary={`${EXAM_CONFIGS.official.totalQuestions} multiple choice questions`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <GradeIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Passing score: ${EXAM_CONFIGS.official.passingScore}%`} />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/mock-exam/official')}
                  startIcon={<PlayArrowIcon />}
                >
                  Start Official Practice
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Exam History Dialog */}
        <Dialog
          open={showHistory}
          onClose={() => setShowHistory(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HistoryIcon sx={{ mr: 1 }} />
              Exam History
            </Box>
          </DialogTitle>
          <DialogContent>
            {examHistory.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 2 }}>
                No exam history available yet. Take your first exam to start tracking your progress!
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Exam Type</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Result</TableCell>
                      <TableCell>Time Taken</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {examHistory.map((exam, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(exam.date)}</TableCell>
                        <TableCell>{exam.type}</TableCell>
                        <TableCell>{exam.score}%</TableCell>
                        <TableCell>
                          {exam.score >= EXAM_CONFIGS[exam.examType].passingScore ? (
                            <Typography color="success.main">PASS</Typography>
                          ) : (
                            <Typography color="error.main">FAIL</Typography>
                          )}
                        </TableCell>
                        <TableCell>{formatDuration(exam.timeTaken)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowHistory(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Exam Info Dialog */}
        <Dialog
          open={showExamInfo}
          onClose={() => setShowExamInfo(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} />
              {examInfoType && EXAM_CONFIGS[examInfoType].name} Details
            </Box>
          </DialogTitle>
          <DialogContent>
            {examInfoType === 'custom' ? (
              <>
                <Typography variant="body1" paragraph>
                  This custom mock exam is designed to closely simulate the actual Databricks Data Engineer certification exam experience. It includes:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><TimerIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Extended Duration" 
                      secondary="2 hours to complete 60 questions, giving you more practice time than the actual exam"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><QuizIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Comprehensive Coverage" 
                      secondary="Questions covering all exam topics with varying difficulty levels"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><GradeIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Detailed Explanations" 
                      secondary="Learn from each question with thorough explanations and references"
                    />
                  </ListItem>
                </List>
              </>
            ) : (
              <>
                <Typography variant="body1" paragraph>
                  This is the official Databricks practice exam, matching the exact format and timing of the actual certification exam:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><TimerIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Standard Duration" 
                      secondary="90 minutes to complete 45 questions, exactly like the real exam"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><QuizIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Official Format" 
                      secondary="Questions directly from Databricks, representing the actual exam style"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><GradeIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Real Experience" 
                      secondary="Get a true feel for the certification exam environment"
                    />
                  </ListItem>
                </List>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowExamInfo(false)}>Close</Button>
            <Button 
              variant="contained" 
              onClick={() => {
                setShowExamInfo(false);
                handleStartExam(examInfoType);
              }}
            >
              Start Exam
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  if (!isStarted) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>Mock Certification Exam</Typography>
          <Typography variant="body1" gutterBottom>
            This mock test simulates the official Databricks Data Engineer Associate practice exam:
          </Typography>
          
          <List sx={{ mt: 2 }}>
            <ListItem>
              <ListItemIcon>
                <TimerIcon />
              </ListItemIcon>
              <ListItemText primary="Duration: 90 minutes" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <QuizIcon />
              </ListItemIcon>
              <ListItemText primary="Questions: 45 multiple choice" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <GradeIcon />
              </ListItemIcon>
              <ListItemText primary="Passing score: 70%" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BlockIcon />
              </ListItemIcon>
              <ListItemText primary="No access to external resources" />
            </ListItem>
          </List>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={() => navigate('/mock-exam/start')}
            >
              Start Mock Exam
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  if (isFinished && examResult) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Exam Results
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Score: {examResult.score.toFixed(1)}%
              {examResult.score >= EXAM_CONFIGS[selectedExam].passingScore ? (
                <Chip
                  label="PASSED"
                  color="success"
                  icon={<CheckIcon />}
                  sx={{ ml: 2 }}
                />
              ) : (
                <Chip
                  label="NOT PASSED"
                  color="error"
                  icon={<WarningIcon />}
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
            <Typography variant="body1">
              Time spent: {formatTime(examResult.timeSpent)}
            </Typography>
            <Typography variant="body1">
              Correct answers: {examResult.correctAnswers} out of {examResult.totalQuestions}
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Performance by Category
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {Object.entries(examResult.categoryScores).map(([category, score]) => (
              <Grid item xs={12} key={category}>
                <Typography variant="body2" gutterBottom>
                  {category}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(score / getExamQuestions().filter(q => q.category === category).length) * 100}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <Box>
              <Button
                variant="outlined"
                onClick={handleReviewExam}
                sx={{ mr: 2 }}
              >
                Review Answers
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/study-plan')}
              >
                Review Study Plan
              </Button>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  if (showReview) {
    const questions = getExamQuestions();
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Exam Review
          </Typography>
          {questions.map((question, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Question {index + 1}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {question.question}
              </Typography>
              <Box sx={{ ml: 2, mb: 2 }}>
                {question.options.map((option, optIndex) => (
                  <Typography
                    key={optIndex}
                    variant="body2"
                    sx={{
                      color: answers[question.id] === optIndex
                        ? (optIndex === question.correctAnswer ? 'success.main' : 'error.main')
                        : optIndex === question.correctAnswer
                          ? 'success.main'
                          : 'text.primary',
                      fontWeight: optIndex === question.correctAnswer ? 'bold' : 'normal',
                      mb: 1
                    }}
                  >
                    {String.fromCharCode(65 + optIndex)}. {option}
                  </Typography>
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Explanation: {question.explanation}
              </Typography>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            fullWidth
          >
            Return to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Exam Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">
            Question {currentQuestion + 1} of {getExamQuestions().length}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<TimerIcon />}
              label={formatTime(timeLeft)}
              color={timeLeft < 300 ? 'error' : 'default'}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={handleExit}
            >
              Exit
            </Button>
          </Box>
        </Box>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={(currentQuestion / getExamQuestions().length) * 100}
          sx={{ mb: 3, height: 8, borderRadius: 4 }}
        />

        {/* Question */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" gutterBottom>
            {getExamQuestions()[currentQuestion].question}
          </Typography>
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={answers[getExamQuestions()[currentQuestion].id] ?? ''}
              onChange={(e) => handleAnswer(getExamQuestions()[currentQuestion].id, parseInt(e.target.value))}
            >
              {getExamQuestions()[currentQuestion].options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={option}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(prev => prev - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            color={flaggedQuestions.has(getExamQuestions()[currentQuestion].id) ? 'warning' : 'primary'}
            onClick={() => handleFlagQuestion(getExamQuestions()[currentQuestion].id)}
          >
            {flaggedQuestions.has(getExamQuestions()[currentQuestion].id) ? 'Unflag' : 'Flag'} Question
          </Button>
          {currentQuestion === getExamQuestions().length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit Exam
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => setCurrentQuestion(prev => prev + 1)}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={showConfirmSubmit}
        onClose={() => setShowConfirmSubmit(false)}
      >
        <DialogTitle>Submit Exam?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit your exam? You still have {formatTime(timeLeft)} remaining.
          </Typography>
          {Object.keys(answers).length < getExamQuestions().length && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              You have {getExamQuestions().length - Object.keys(answers).length} unanswered questions.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmSubmit(false)}>
            Continue Exam
          </Button>
          <Button onClick={confirmSubmit} color="primary" variant="contained">
            Submit Exam
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog
        open={showConfirmExit}
        onClose={() => setShowConfirmExit(false)}
      >
        <DialogTitle>Exit Exam?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to exit? Your progress will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmExit(false)}>
            Continue Exam
          </Button>
          <Button onClick={confirmExit} color="error">
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MockTest; 