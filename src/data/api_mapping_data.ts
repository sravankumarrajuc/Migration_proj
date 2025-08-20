let mapping_data_api = {
  "email": "string",
  "definitions": {
    "db2": [
      {
        "DB2_CLAIMS": [
          {
            "id": "col-db2-claims-1",
            "name": "CLM_ID",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": false,
            "description": "Unique identifier for each insurance claim. This column serves as the primary key to uniquely distinguish each claim record in the claims table."
          },
          {
            "id": "col-db2-claims-2",
            "name": "POLICY_REF",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": false,
            "isForeignKey": true,
            "references": {
              "table": "DB2_POLICIES",
              "column": "POLICY_ID"
            },
            "description": "Reference to the insurance policy associated with the claim. This foreign key links the claim to a specific policy in the policies table."
          },
          {
            "id": "col-db2-claims-3",
            "name": "CUSTOMER_REF",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": false,
            "isForeignKey": true,
            "references": {
              "table": "DB2_CUSTOMERS",
              "column": "CUST_ID"
            },
            "description": "Reference to the customer who filed the claim. This foreign key connects the claim to a customer record in the customers table."
          },
          {
            "id": "col-db2-claims-4",
            "name": "CLM_DT",
            "dataType": "DATE",
            "nullable": false,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date on which the claim was filed or recorded. This helps track when the claim event occurred."
          },
          {
            "id": "col-db2-claims-5",
            "name": "CLM_STATUS",
            "dataType": "CHAR(1)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Status code representing the current state of the claim. Typically used to indicate if the claim is open, closed, pending, or denied."
          },
          {
            "id": "col-db2-claims-6",
            "name": "CLM_AMT",
            "dataType": "DECIMAL(15,2)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The monetary amount claimed by the customer. This represents the value of the claim submitted for reimbursement or payment."
          },
          {
            "id": "col-db2-claims-7",
            "name": "ADJ_AMT",
            "dataType": "DECIMAL(15,2)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The adjusted amount after review or negotiation. This may differ from the original claim amount based on assessments or policy limits."
          },
          {
            "id": "col-db2-claims-8",
            "name": "SETTLE_DT",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date on which the claim was settled or resolved. This marks the completion of the claim process."
          },
          {
            "id": "col-db2-claims-9",
            "name": "CLAIM_JSON",
            "dataType": "CLOB",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A large text field storing detailed claim information in JSON format. This may include additional metadata or complex claim details not captured in other columns."
          },
          {
            "id": "col-db2-claims-10",
            "name": "LOSS_TYPE",
            "dataType": "VARCHAR(20)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Type or category of loss reported in the claim. Examples include theft, accident, fire, or natural disaster."
          },
          {
            "id": "col-db2-claims-11",
            "name": "REPORTED_BY",
            "dataType": "VARCHAR(50)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Name or identifier of the person who reported the claim. This could be the customer, an agent, or a third party."
          },
          {
            "id": "col-db2-claims-12",
            "name": "INCIDENT_LOC",
            "dataType": "VARCHAR(100)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Location where the incident causing the claim occurred. This helps in assessing the claim and verifying details."
          },
          {
            "id": "col-db2-claims-13",
            "name": "INCIDENT_DT",
            "dataType": "TIMESTAMP",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Exact date and time when the incident happened. This timestamp is critical for claim validation and processing timelines."
          },
          {
            "id": "col-db2-claims-14",
            "name": "DAYS_OPEN",
            "dataType": "INTEGER",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Number of days the claim has been open or active. This metric is useful for tracking claim processing duration and efficiency."
          },
          {
            "id": "col-db2-claims-15",
            "name": "PRIORITY_CD",
            "dataType": "CHAR(2)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Priority code assigned to the claim indicating its urgency or importance. This helps in managing claim workflows and resource allocation."
          }
        ]
      },
      {
        "DB2_CUSTOMERS": [
          {
            "id": "col-db2-customers-1",
            "name": "CUST_ID",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": false,
            "description": "This column uniquely identifies each customer in the database. It is a string of up to 36 characters, typically used as a unique identifier such as a UUID. Being the primary key, it ensures that each record in the customers table is distinct and can be referenced by other tables."
          },
          {
            "id": "col-db2-customers-2",
            "name": "NAME_JSON",
            "dataType": "CLOB",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column stores the customer's name information in JSON format. It is stored as a Character Large Object (CLOB) to accommodate potentially large or complex name data structures, such as first name, last name, middle name, and titles. This flexible format allows for easy extension and parsing of name components."
          },
          {
            "id": "col-db2-customers-3",
            "name": "REGION_CD",
            "dataType": "CHAR(3)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column contains a three-character code representing the geographic region associated with the customer. It is used to categorize customers by location for reporting, analysis, or regional marketing purposes. The fixed length ensures consistent formatting of region codes."
          },
          {
            "id": "col-db2-customers-4",
            "name": "SEGMENT",
            "dataType": "VARCHAR(20)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column indicates the market segment or customer category to which the customer belongs. It helps in classifying customers based on criteria such as demographics, purchasing behavior, or risk profile. The variable length allows for descriptive segment names."
          },
          {
            "id": "col-db2-customers-5",
            "name": "DOB",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column stores the date of birth of the customer. It is used for age verification, eligibility checks, and demographic analysis. The date format allows for easy calculation of age and other time-based metrics."
          },
          {
            "id": "col-db2-customers-6",
            "name": "EMAIL",
            "dataType": "VARCHAR(100)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column holds the customer's email address. It is used for communication, notifications, and marketing purposes. The length accommodates most standard email addresses."
          },
          {
            "id": "col-db2-customers-7",
            "name": "PHONE",
            "dataType": "VARCHAR(20)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column contains the customer's phone number. It is used for contact and verification purposes. The variable length supports different phone number formats, including country codes and extensions."
          },
          {
            "id": "col-db2-customers-8",
            "name": "ADDR_JSON",
            "dataType": "CLOB",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column stores the customer's address information in JSON format. It allows for flexible representation of complex address components such as street, city, state, postal code, and country. The CLOB data type supports large and detailed address data."
          },
          {
            "id": "col-db2-customers-9",
            "name": "JOIN_DT",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column records the date when the customer joined or was registered in the system. It is useful for tracking customer tenure, loyalty programs, and historical analysis."
          },
          {
            "id": "col-db2-customers-10",
            "name": "STATUS",
            "dataType": "CHAR(1)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column indicates the current status of the customer using a single character code. It may represent states such as active, inactive, suspended, or closed. The fixed length ensures consistent status coding."
          },
          {
            "id": "col-db2-customers-11",
            "name": "PREF_CHANNEL",
            "dataType": "VARCHAR(10)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column specifies the customer's preferred communication or service channel. Examples include email, phone, SMS, or in-person. It helps tailor interactions and marketing efforts to customer preferences."
          },
          {
            "id": "col-db2-customers-12",
            "name": "RISK_SCORE",
            "dataType": "DECIMAL(5,2)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column contains a numeric risk score assigned to the customer. The score quantifies the risk level associated with the customer, such as credit risk or fraud risk, on a scale that allows two decimal places. It is used in underwriting, pricing, and risk management decisions."
          }
        ]
      },
      {
        "DB2_PAYMENTS": [
          {
            "id": "col-db2-payments-1",
            "name": "PAY_ID",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": false,
            "description": "Unique identifier for each payment record. This column serves as the primary key to uniquely distinguish each payment entry in the table."
          },
          {
            "id": "col-db2-payments-2",
            "name": "CLM_ID",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": false,
            "isForeignKey": true,
            "references": {
              "table": "DB2_CLAIMS",
              "column": "CLM_ID"
            },
            "description": "Identifier linking the payment to a specific claim. This foreign key references the claim record associated with the payment."
          },
          {
            "id": "col-db2-payments-3",
            "name": "PAY_DT",
            "dataType": "TIMESTAMP",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date and time when the payment was made. This timestamp records the exact moment the payment transaction occurred."
          },
          {
            "id": "col-db2-payments-4",
            "name": "AMT_PAID",
            "dataType": "DECIMAL(15,2)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The amount of money paid in the transaction. This decimal value captures the payment sum with two decimal places for cents."
          },
          {
            "id": "col-db2-payments-5",
            "name": "PAY_INFO_JSON",
            "dataType": "CLOB",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A JSON formatted text field containing additional payment information. This large character object stores extended details about the payment in JSON format."
          },
          {
            "id": "col-db2-payments-6",
            "name": "PAY_METHOD",
            "dataType": "VARCHAR(20)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The method used to make the payment, such as credit card, check, or electronic transfer. This field describes how the payment was processed."
          },
          {
            "id": "col-db2-payments-7",
            "name": "RECEIPT_NO",
            "dataType": "VARCHAR(30)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The receipt number associated with the payment transaction. This identifier helps track and verify the payment receipt."
          },
          {
            "id": "col-db2-payments-8",
            "name": "BANK_CODE",
            "dataType": "CHAR(4)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A code representing the bank involved in the payment process. This fixed-length character field identifies the bank handling the payment."
          },
          {
            "id": "col-db2-payments-9",
            "name": "CHANNEL",
            "dataType": "VARCHAR(10)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The channel through which the payment was made, such as online, in-person, or mobile. This field indicates the payment origination source."
          },
          {
            "id": "col-db2-payments-10",
            "name": "STATUS",
            "dataType": "CHAR(1)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The current status of the payment, represented by a single character code. This field indicates whether the payment is pending, completed, or failed."
          }
        ]
      },
      {
        "DB2_ADJUSTMENTS": [
          {
            "id": "col-db2-adjustments-1",
            "name": "ADJ_ID",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": false,
            "description": "Unique identifier for each adjustment record, used as the primary key to uniquely distinguish adjustments in the system."
          },
          {
            "id": "col-db2-adjustments-2",
            "name": "CLM_ID",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": false,
            "isForeignKey": true,
            "references": {
              "table": "DB2_CLAIMS",
              "column": "CLM_ID"
            },
            "description": "Identifier linking the adjustment to a specific claim, serving as a foreign key to the claims table to maintain referential integrity."
          },
          {
            "id": "col-db2-adjustments-3",
            "name": "ADJ_DT",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date on which the adjustment was made, indicating when the adjustment entry was recorded or became effective."
          },
          {
            "id": "col-db2-adjustments-4",
            "name": "ADJ_AMT_SRC",
            "dataType": "DECIMAL(15,2)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The original amount of the adjustment before any corrections, representing the initial value associated with the adjustment."
          },
          {
            "id": "col-db2-adjustments-5",
            "name": "ADJ_AMT_CORR",
            "dataType": "DECIMAL(15,2)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The corrected amount of the adjustment after revisions, reflecting any changes made to the original adjustment amount."
          },
          {
            "id": "col-db2-adjustments-6",
            "name": "REASON_CD",
            "dataType": "VARCHAR(10)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A code representing the reason for the adjustment, used to categorize or explain why the adjustment was made."
          },
          {
            "id": "col-db2-adjustments-7",
            "name": "COMMENTS",
            "dataType": "VARCHAR(255)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Additional textual information or notes about the adjustment, providing context or explanations related to the adjustment entry."
          },
          {
            "id": "col-db2-adjustments-8",
            "name": "ADJ_JSON",
            "dataType": "CLOB",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A large text field storing JSON formatted data related to the adjustment, potentially containing detailed or structured information."
          }
        ]
      },
      {
        "DB2_POLICIES": [
          {
            "id": "col-db2-policies-1",
            "name": "POLICY_ID",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": false,
            "description": "Unique identifier for each insurance policy, used as the primary key to uniquely distinguish policies in the system."
          },
          {
            "id": "col-db2-policies-2",
            "name": "EFF_DT",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The effective date when the insurance policy coverage begins, indicating the start of the policy's validity period."
          },
          {
            "id": "col-db2-policies-3",
            "name": "EXP_DT",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The expiration date when the insurance policy coverage ends, marking the end of the policy's validity period."
          },
          {
            "id": "col-db2-policies-4",
            "name": "POLICY_JSON",
            "dataType": "CLOB",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A large text field storing detailed policy information in JSON format, allowing flexible representation of policy attributes."
          },
          {
            "id": "col-db2-policies-5",
            "name": "PREMIUM_AMT",
            "dataType": "DECIMAL(15,2)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The monetary amount of the insurance premium, representing the cost to the policyholder for coverage, stored with two decimal places."
          },
          {
            "id": "col-db2-policies-6",
            "name": "POL_TYPE",
            "dataType": "VARCHAR(20)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The type or category of the insurance policy, such as auto, home, or life, stored as a string up to 20 characters."
          },
          {
            "id": "col-db2-policies-7",
            "name": "COVERAGES_JSON",
            "dataType": "CLOB",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A large text field containing coverage details in JSON format, describing the specific coverages included in the policy."
          },
          {
            "id": "col-db2-policies-8",
            "name": "STATUS",
            "dataType": "CHAR(1)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A single character code representing the current status of the policy, such as active, expired, or cancelled."
          },
          {
            "id": "col-db2-policies-9",
            "name": "RIDER_CNT",
            "dataType": "INTEGER",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The count of riders or additional endorsements attached to the policy, indicating the number of supplementary coverages."
          },
          {
            "id": "col-db2-policies-10",
            "name": "RENEWAL_DT",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date when the policy is due for renewal, signaling when the policyholder can renew or update the policy."
          }
        ]
      },
      {
        "DB2_RISK_RATINGS": [
          {
            "id": "col-db2-risk-ratings-1",
            "name": "RATING_KEY",
            "dataType": "VARCHAR(50)",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": false,
            "description": "Unique identifier for each risk rating entry. This key is used to uniquely distinguish each record in the risk ratings table and serves as the primary key."
          },
          {
            "id": "col-db2-risk-ratings-2",
            "name": "ZIP",
            "dataType": "CHAR(5)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The 5-character ZIP code associated with the risk rating. This typically represents the geographic location relevant to the insurance risk assessment."
          },
          {
            "id": "col-db2-risk-ratings-3",
            "name": "POL_TYPE",
            "dataType": "VARCHAR(10)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The type of insurance policy related to the risk rating. This field categorizes the rating by policy type, such as auto, home, or life insurance."
          },
          {
            "id": "col-db2-risk-ratings-4",
            "name": "RATING_JSON",
            "dataType": "CLOB",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A large text field storing detailed rating information in JSON format. This allows for flexible and complex rating data to be stored in a structured way."
          },
          {
            "id": "col-db2-risk-ratings-5",
            "name": "SCORE",
            "dataType": "DECIMAL(5,2)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Numerical score representing the risk rating value. This score quantifies the risk level associated with the insurance policy or geographic area."
          },
          {
            "id": "col-db2-risk-ratings-6",
            "name": "EFFECTIVE_DT",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date when the risk rating becomes effective. This marks the start date from which the rating is valid."
          },
          {
            "id": "col-db2-risk-ratings-7",
            "name": "EXPIRATION_DT",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date when the risk rating expires. This indicates the end date after which the rating is no longer valid."
          }
        ]
      },
      {
        "DB2_CLAIM_EVENTS": [
          {
            "id": "col-db2-claim-events-1",
            "name": "CLM_ID",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": true,
            "references": {
              "table": "DB2_CLAIMS",
              "column": "CLM_ID"
            },
            "description": "Unique identifier for the insurance claim associated with this event. This column links the event to a specific claim record in the claims table. It is a required field and part of the composite primary key, ensuring each event is uniquely tied to a claim. Also serves as a foreign key to maintain referential integrity with the claims table."
          },
          {
            "id": "col-db2-claim-events-2",
            "name": "EVENT_SEQ",
            "dataType": "INTEGER",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": false,
            "description": "Sequence number of the event within the claim, used to order multiple events related to the same claim. This field is mandatory and forms part of the composite primary key, ensuring uniqueness of each event per claim. Helps track the chronological order or versioning of claim events."
          },
          {
            "id": "col-db2-claim-events-3",
            "name": "EVENT_DT",
            "dataType": "TIMESTAMP",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Date and time when the event occurred. This timestamp provides temporal context for the event, allowing for tracking and analysis of claim event timelines. It is optional and may be null if the event date is unknown or not recorded."
          },
          {
            "id": "col-db2-claim-events-4",
            "name": "EVENT_TYPE",
            "dataType": "VARCHAR(30)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Type or category of the claim event, such as 'submission', 'adjustment', or 'payment'. This field helps classify the nature of the event for reporting and processing purposes. It is optional and can be null if the event type is not specified."
          },
          {
            "id": "col-db2-claim-events-5",
            "name": "DETAILS_JSON",
            "dataType": "CLOB",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Detailed information about the claim event stored in JSON format. This large object field allows for flexible storage of event-specific data that may vary in structure. It is optional and can be null if no additional details are provided."
          },
          {
            "id": "col-db2-claim-events-6",
            "name": "USER_ID",
            "dataType": "VARCHAR(36)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Identifier of the user who created or modified the claim event. This field helps track accountability and user activity related to the event. It is optional and may be null if the user information is not recorded."
          }
        ]
      },
      {
        "DB2_POLICY_HISTORY": [
          {
            "id": "col-db2-policy-history-1",
            "name": "POLICY_ID",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": true,
            "references": {
              "table": "DB2_POLICIES",
              "column": "POLICY_ID"
            },
            "description": "This column stores the unique identifier for an insurance policy. It is a string of up to 36 characters, typically used to uniquely identify each policy record. It serves as a primary key component in this table, ensuring each record is uniquely identifiable. Additionally, it acts as a foreign key linking to the main policies table, establishing a relationship between the policy history and the policy itself. This linkage allows tracking of changes over time for each specific policy. The identifier is critical for maintaining data integrity and enabling efficient querying of policy history records."
          },
          {
            "id": "col-db2-policy-history-2",
            "name": "HIST_SEQ",
            "dataType": "INTEGER",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": false,
            "description": "This column represents the sequence number of the history record for a given policy. It is an integer that increments to uniquely identify each change event related to the same policy. As part of the composite primary key, it ensures that each history entry is uniquely distinguishable within the context of a single policy. This sequencing allows the system to maintain the chronological order of changes made to the policy over time. It is essential for tracking the evolution of policy data and for auditing purposes."
          },
          {
            "id": "col-db2-policy-history-3",
            "name": "CHANGE_DT",
            "dataType": "TIMESTAMP",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column records the date and time when a change was made to the policy. It uses a timestamp data type to capture precise moments of modifications. This information is crucial for auditing and historical tracking, allowing users to see exactly when each change occurred. It helps in understanding the timeline of policy updates and supports compliance with regulatory requirements. The timestamp can also be used to filter or sort history records based on change dates."
          },
          {
            "id": "col-db2-policy-history-4",
            "name": "FIELD_NAME",
            "dataType": "VARCHAR(50)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column stores the name of the field within the policy that was changed. It is a string of up to 50 characters, representing the specific attribute or property of the policy that was updated. This allows users to identify which part of the policy data was modified in each history record. It is useful for detailed auditing and understanding the nature of changes made over time. The field name helps in generating reports and tracking specific data elements within the policy."
          },
          {
            "id": "col-db2-policy-history-5",
            "name": "OLD_VALUE",
            "dataType": "VARCHAR(255)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column contains the previous value of the field before the change was made. It is a string of up to 255 characters, capturing the original data prior to modification. This information is essential for auditing and rollback purposes, allowing users to see what the data was before the update. It supports transparency and accountability by preserving historical values. The old value helps in understanding the impact of changes and in resolving discrepancies."
          },
          {
            "id": "col-db2-policy-history-6",
            "name": "NEW_VALUE",
            "dataType": "VARCHAR(255)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column holds the new value of the field after the change was applied. It is a string of up to 255 characters, representing the updated data. This allows users to see the result of the modification and compare it with the old value. The new value is important for tracking the current state of policy attributes over time. It supports auditing, reporting, and understanding the evolution of policy data."
          },
          {
            "id": "col-db2-policy-history-7",
            "name": "CHANGE_JSON",
            "dataType": "CLOB",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "This column stores a JSON representation of the change details in a character large object format. It may include structured information about the change event, such as metadata, user information, or additional context not captured in other columns. The use of CLOB allows for storing large amounts of text data, accommodating complex JSON structures. This field enhances the audit trail by providing a flexible and extensible way to record change information. It supports advanced querying and analysis of policy history changes."
          }
        ]
      },
      {
        "DB2_AGENTS": [
          {
            "id": "col-db2-agents-1",
            "name": "AGENT_ID",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": false,
            "description": "Unique identifier for each insurance agent. This column serves as the primary key to uniquely distinguish agents in the database."
          },
          {
            "id": "col-db2-agents-2",
            "name": "FIRST_NAME",
            "dataType": "VARCHAR(50)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The first name of the insurance agent. Used for identification and communication purposes."
          },
          {
            "id": "col-db2-agents-3",
            "name": "LAST_NAME",
            "dataType": "VARCHAR(50)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The last name or surname of the insurance agent. Helps in identifying and addressing the agent."
          },
          {
            "id": "col-db2-agents-4",
            "name": "REGION",
            "dataType": "CHAR(3)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The geographic region code where the agent operates. This helps in categorizing agents by their service area."
          },
          {
            "id": "col-db2-agents-5",
            "name": "HIRE_DT",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date when the agent was hired. Useful for tracking tenure and employment history."
          },
          {
            "id": "col-db2-agents-6",
            "name": "TERMINATION_DT",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date when the agent's employment was terminated. Helps in managing active and inactive agents."
          },
          {
            "id": "col-db2-agents-7",
            "name": "AGENT_JSON",
            "dataType": "CLOB",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A large text field storing JSON formatted data related to the agent. This may include additional attributes or metadata not captured in other columns."
          },
          {
            "id": "col-db2-agents-8",
            "name": "STATUS",
            "dataType": "CHAR(1)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A single character code representing the agent's current status, such as active, inactive, or suspended."
          },
          {
            "id": "col-db2-agents-9",
            "name": "RATING_KEY",
            "dataType": "VARCHAR(50)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": true,
            "references": {
              "table": "DB2_RISK_RATINGS",
              "column": "RATING_KEY"
            },
            "description": "Foreign key linking to the risk rating associated with the agent. This key references the RATING_KEY in the DB2_RISK_RATINGS table to classify the agent's risk profile."
          }
        ]
      },
      {
        "DB2_COMMISSIONS": [
          {
            "id": "col-db2-commissions-1",
            "name": "COMM_ID",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": false,
            "description": "Unique identifier for each commission record, used as the primary key to uniquely distinguish commissions."
          },
          {
            "id": "col-db2-commissions-2",
            "name": "AGENT_ID",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": false,
            "isForeignKey": true,
            "references": {
              "table": "DB2_AGENTS",
              "column": "AGENT_ID"
            },
            "description": "Identifier for the insurance agent associated with the commission, linking to the agents table."
          },
          {
            "id": "col-db2-commissions-3",
            "name": "CLM_ID",
            "dataType": "VARCHAR(36)",
            "nullable": false,
            "isPrimaryKey": false,
            "isForeignKey": true,
            "references": {
              "table": "DB2_CLAIMS",
              "column": "CLM_ID"
            },
            "description": "Identifier for the claim related to the commission, linking to the claims table."
          },
          {
            "id": "col-db2-commissions-4",
            "name": "COMM_DT",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Date when the commission was recorded or earned, representing the commission transaction date."
          },
          {
            "id": "col-db2-commissions-5",
            "name": "COMM_PCT",
            "dataType": "DECIMAL(5,2)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Percentage rate of the commission earned, expressed as a decimal value with two decimal places."
          },
          {
            "id": "col-db2-commissions-6",
            "name": "COMM_AMT",
            "dataType": "DECIMAL(15,2)",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Monetary amount of the commission earned, stored as a decimal value with precision for currency."
          },
          {
            "id": "col-db2-commissions-7",
            "name": "COMM_JSON",
            "dataType": "CLOB",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Large text field storing additional commission details in JSON format, allowing flexible data storage."
          }
        ]
      }
    ],
    "bq": [
      {
        "claims_denorm": [
          {
            "id": "col-claims-denorm-1",
            "name": "claim_identifier",
            "dataType": "STRING",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": false,
            "description": "Unique identifier for each claim, used to distinctly identify and track individual claims within the system."
          },
          {
            "id": "col-claims-denorm-2",
            "name": "policy_code",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Code representing the insurance policy associated with the claim, linking the claim to the relevant policy details."
          },
          {
            "id": "col-claims-denorm-3",
            "name": "client_key",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Identifier for the client or customer who filed the claim, used to associate claims with customer records."
          },
          {
            "id": "col-claims-denorm-4",
            "name": "claim_open_date",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date when the claim was initially opened or filed, marking the start of the claim process."
          },
          {
            "id": "col-claims-denorm-5",
            "name": "status_code",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Code indicating the current status of the claim, such as open, closed, pending, or resolved."
          },
          {
            "id": "col-claims-denorm-6",
            "name": "claim_value",
            "dataType": "NUMERIC",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The monetary value or amount claimed by the client, representing the financial aspect of the claim."
          },
          {
            "id": "col-claims-denorm-7",
            "name": "adjustment_value",
            "dataType": "NUMERIC",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The amount adjusted on the original claim value, reflecting any corrections or changes made after initial filing."
          },
          {
            "id": "col-claims-denorm-8",
            "name": "resolution_date",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date when the claim was resolved or settled, indicating the conclusion of the claim process."
          },
          {
            "id": "col-claims-denorm-9",
            "name": "claim_detail_json",
            "dataType": "JSON",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A JSON object containing detailed information about the claim, potentially including nested or complex data."
          },
          {
            "id": "col-claims-denorm-10",
            "name": "loss_category",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Category or type of loss associated with the claim, used to classify the nature of the incident or damage."
          },
          {
            "id": "col-claims-denorm-11",
            "name": "report_owner",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Identifier or name of the person who reported the claim, responsible for submitting the initial claim information."
          },
          {
            "id": "col-claims-denorm-12",
            "name": "incident_address",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The physical location or address where the incident related to the claim occurred."
          },
          {
            "id": "col-claims-denorm-13",
            "name": "incident_timestamp",
            "dataType": "TIMESTAMP",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The exact date and time when the incident happened, providing a timestamp for the event."
          },
          {
            "id": "col-claims-denorm-14",
            "name": "days_to_resolution",
            "dataType": "INT64",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Number of days taken to resolve the claim from the date it was opened, measuring claim processing duration."
          },
          {
            "id": "col-claims-denorm-15",
            "name": "priority_level",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Priority code indicating the urgency or importance level assigned to the claim for handling purposes."
          },
          {
            "id": "col-claims-denorm-16",
            "name": "payments",
            "dataType": "ARRAY<STRUCT<payment_key STRING, processed_on TIMESTAMP, paid_amount NUMERIC, payment_meta JSON, method_used STRING, receipt_reference STRING, bank_identifier STRING, channel_used STRING, payment_status STRING>>",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "An array of payment records related to the claim, each containing details such as payment ID, date, amount, method, and status."
          },
          {
            "id": "col-claims-denorm-17",
            "name": "adjustments",
            "dataType": "ARRAY<STRUCT<adjustment_key STRING, adjustment_date DATE, original_amount NUMERIC, corrected_amount NUMERIC, reason_code STRING, comments_text STRING, adjustment_meta JSON>>",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "An array of adjustment records for the claim, detailing corrections or changes made, including reasons and comments."
          },
          {
            "id": "col-claims-denorm-18",
            "name": "events",
            "dataType": "ARRAY<STRUCT<sequence_number INT64, occurred_on TIMESTAMP, event_type STRING, event_details STRING, user_identifier STRING>>",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "An array of event records associated with the claim, capturing a sequence of actions or updates with timestamps and user info."
          }
        ]
      },
      {
        "customers_denorm": [
          {
            "id": "col-customers-denorm-1",
            "name": "customer_id",
            "dataType": "STRING",
            "nullable": false,
            "isPrimaryKey": true,
            "isForeignKey": false,
            "description": "Unique identifier for each customer. This column serves as the primary key to uniquely distinguish customers in the dataset."
          },
          {
            "id": "col-customers-denorm-2",
            "name": "name_first",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The first name of the customer. This field stores the given name extracted from the customer's full name."
          },
          {
            "id": "col-customers-denorm-3",
            "name": "name_last",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The last name or family name of the customer. Used to identify the customer along with the first name."
          },
          {
            "id": "col-customers-denorm-4",
            "name": "name_prefixes",
            "dataType": "ARRAY<STRING>",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "An array of prefixes associated with the customer's name, such as titles or honorifics (e.g., Mr., Dr., Ms.)."
          },
          {
            "id": "col-customers-denorm-5",
            "name": "region_code",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Code representing the geographic region or area where the customer is located. Useful for regional segmentation and analysis."
          },
          {
            "id": "col-customers-denorm-6",
            "name": "customer_segment",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Segment classification of the customer based on behavior, demographics, or other criteria. Helps in targeted marketing and service."
          },
          {
            "id": "col-customers-denorm-7",
            "name": "date_of_birth",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The birth date of the customer. Used for age verification, demographic analysis, and personalized services."
          },
          {
            "id": "col-customers-denorm-8",
            "name": "email_address",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The customer's email address. Used for communication, notifications, and marketing campaigns."
          },
          {
            "id": "col-customers-denorm-9",
            "name": "phone_number",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The customer's phone number. Used for contact, verification, and customer support purposes."
          },
          {
            "id": "col-customers-denorm-10",
            "name": "address_street",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Street address of the customer. Part of the full mailing address used for deliveries and location identification."
          },
          {
            "id": "col-customers-denorm-11",
            "name": "address_city",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "City component of the customer's address. Helps in geographic segmentation and service area determination."
          },
          {
            "id": "col-customers-denorm-12",
            "name": "address_state",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "State or province part of the customer's address. Useful for regional analysis and regulatory compliance."
          },
          {
            "id": "col-customers-denorm-13",
            "name": "address_postcode",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Postal or ZIP code of the customer's address. Important for mail delivery and geographic classification."
          },
          {
            "id": "col-customers-denorm-14",
            "name": "joined_on",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date when the customer joined or was registered in the system. Useful for tracking customer lifecycle and tenure."
          },
          {
            "id": "col-customers-denorm-15",
            "name": "active_flag",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Indicator flag showing whether the customer is currently active or inactive. Helps in filtering and status reporting."
          },
          {
            "id": "col-customers-denorm-16",
            "name": "preferred_contact",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The customer's preferred method or channel of contact, such as email, phone, or mail. Used to tailor communications."
          },
          {
            "id": "col-customers-denorm-17",
            "name": "customer_risk_score",
            "dataType": "NUMERIC",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A numeric score representing the risk level associated with the customer. Used for risk assessment and decision making."
          }
        ]
      },
      {
        "policies_denorm": [
          {
            "id": "col-policies-denorm-1",
            "name": "policy_key",
            "dataType": "STRING",
            "nullable": false,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Unique identifier for the policy, serving as the primary reference key for the policy record."
          },
          {
            "id": "col-policies-denorm-2",
            "name": "effective_on",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date on which the policy becomes effective and coverage starts."
          },
          {
            "id": "col-policies-denorm-3",
            "name": "expires_on",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date on which the policy coverage ends or expires."
          },
          {
            "id": "col-policies-denorm-4",
            "name": "policy_document",
            "dataType": "JSON",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A JSON object containing the full policy document details and structure."
          },
          {
            "id": "col-policies-denorm-5",
            "name": "total_premium",
            "dataType": "NUMERIC",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The total premium amount charged for the policy."
          },
          {
            "id": "col-policies-denorm-6",
            "name": "product_type",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The type or category of the insurance product associated with the policy."
          },
          {
            "id": "col-policies-denorm-7",
            "name": "coverages",
            "dataType": "ARRAY<STRUCT<coverage_type STRING, coverage_limit NUMERIC, premium_percentage NUMERIC>>",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "An array of coverage details included in the policy, each specifying the type, limit, and premium percentage."
          },
          {
            "id": "col-policies-denorm-8",
            "name": "status_flag",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A flag indicating the current status of the policy, such as active, expired, or cancelled."
          },
          {
            "id": "col-policies-denorm-9",
            "name": "rider_count",
            "dataType": "INT64",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The number of riders or additional endorsements attached to the policy."
          },
          {
            "id": "col-policies-denorm-10",
            "name": "next_renewal",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date when the policy is scheduled for its next renewal."
          },
          {
            "id": "col-policies-denorm-11",
            "name": "history_log",
            "dataType": "ARRAY<STRUCT<revision_number INT64, changed_on TIMESTAMP, field_changed STRING, old_value_text STRING, new_value_text STRING, change_metadata JSON>>",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "An array capturing the history of changes made to the policy, including revision numbers, timestamps, fields changed, old and new values, and metadata about the changes."
          }
        ]
      },
      {
        "risk_ratings_denorm": [
          {
            "id": "col-risk-ratings-denorm-1",
            "name": "rating_id",
            "dataType": "STRING",
            "nullable": false,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Unique identifier for the rating entry, used as a key to distinguish each rating record."
          },
          {
            "id": "col-risk-ratings-denorm-2",
            "name": "zip_code",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Postal code associated with the rating, indicating the geographic area relevant to the risk assessment."
          },
          {
            "id": "col-risk-ratings-denorm-3",
            "name": "product_category",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Category of the product or policy type for which the risk rating applies."
          },
          {
            "id": "col-risk-ratings-denorm-4",
            "name": "rating_details",
            "dataType": "JSON",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Detailed JSON object containing additional information and attributes related to the risk rating."
          },
          {
            "id": "col-risk-ratings-denorm-5",
            "name": "risk_score_metric",
            "dataType": "NUMERIC",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Numerical score representing the calculated risk level or metric for the rating."
          },
          {
            "id": "col-risk-ratings-denorm-6",
            "name": "valid_from",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Start date from which the risk rating is considered valid and applicable."
          },
          {
            "id": "col-risk-ratings-denorm-7",
            "name": "valid_until",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "End date until which the risk rating remains valid and should be used."
          }
        ]
      },
      {
        "agents_denorm": [
          {
            "id": "col-agents-denorm-1",
            "name": "agent_key",
            "dataType": "STRING",
            "nullable": false,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Unique identifier for each agent, used as a key to distinguish agents in the dataset."
          },
          {
            "id": "col-agents-denorm-2",
            "name": "first_name",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The given name of the agent, used for personal identification and communication."
          },
          {
            "id": "col-agents-denorm-3",
            "name": "last_name",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The family name or surname of the agent, used alongside the first name for full identification."
          },
          {
            "id": "col-agents-denorm-4",
            "name": "sales_region",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The geographic or market region where the agent operates or is assigned to sell products or services."
          },
          {
            "id": "col-agents-denorm-5",
            "name": "hired_on",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date when the agent was officially hired or started employment with the organization."
          },
          {
            "id": "col-agents-denorm-6",
            "name": "left_on",
            "dataType": "DATE",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "The date when the agent ended employment or left the organization, if applicable."
          },
          {
            "id": "col-agents-denorm-7",
            "name": "profile_data",
            "dataType": "JSON",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A JSON object containing detailed profile information about the agent, potentially including attributes not captured in other columns."
          },
          {
            "id": "col-agents-denorm-8",
            "name": "active_status",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "Indicates whether the agent is currently active or inactive within the organization."
          },
          {
            "id": "col-agents-denorm-9",
            "name": "performance_rating",
            "dataType": "STRING",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "A rating key representing the agent's performance level, used for evaluation and comparison."
          },
          {
            "id": "col-agents-denorm-10",
            "name": "commission_records",
            "dataType": "ARRAY<STRUCT<commission_id STRING, claim_key STRING, commission_date DATE, commission_pct NUMERIC, commission_amount NUMERIC, commission_meta JSON>>",
            "nullable": true,
            "isPrimaryKey": false,
            "isForeignKey": false,
            "description": "An array of commission records associated with the agent, each containing details such as commission ID, claim key, date, percentage, amount, and additional metadata in JSON format."
          }
        ]
      }
    ]
  },
  "relations": [
    {
      "id": "rel-1",
      "sourceTable": "DB2_CLAIMS",
      "sourceColumn": "POLICY_REF",
      "targetTable": "DB2_POLICIES",
      "targetColumn": "POLICY_ID",
      "relationshipType": "one-to-many",
      "confidence": 0.9
    },
    {
      "id": "rel-2",
      "sourceTable": "DB2_CLAIMS",
      "sourceColumn": "CUSTOMER_REF",
      "targetTable": "DB2_CUSTOMERS",
      "targetColumn": "CUST_ID",
      "relationshipType": "one-to-many",
      "confidence": 0.9
    },
    {
      "id": "rel-3",
      "sourceTable": "DB2_PAYMENTS",
      "sourceColumn": "CLM_ID",
      "targetTable": "DB2_CLAIMS",
      "targetColumn": "CLM_ID",
      "relationshipType": "one-to-many",
      "confidence": 0.9
    },
    {
      "id": "rel-4",
      "sourceTable": "DB2_ADJUSTMENTS",
      "sourceColumn": "CLM_ID",
      "targetTable": "DB2_CLAIMS",
      "targetColumn": "CLM_ID",
      "relationshipType": "one-to-many",
      "confidence": 0.9
    },
    {
      "id": "rel-5",
      "sourceTable": "DB2_CLAIM_EVENTS",
      "sourceColumn": "CLM_ID",
      "targetTable": "DB2_CLAIMS",
      "targetColumn": "CLM_ID",
      "relationshipType": "one-to-many",
      "confidence": 0.9
    },
    {
      "id": "rel-6",
      "sourceTable": "DB2_POLICY_HISTORY",
      "sourceColumn": "POLICY_ID",
      "targetTable": "DB2_POLICIES",
      "targetColumn": "POLICY_ID",
      "relationshipType": "one-to-many",
      "confidence": 0.9
    },
    {
      "id": "rel-7",
      "sourceTable": "DB2_AGENTS",
      "sourceColumn": "RATING_KEY",
      "targetTable": "DB2_RISK_RATINGS",
      "targetColumn": "RATING_KEY",
      "relationshipType": "one-to-many",
      "confidence": 0.9
    },
    {
      "id": "rel-8",
      "sourceTable": "DB2_COMMISSIONS",
      "sourceColumn": "AGENT_ID",
      "targetTable": "DB2_AGENTS",
      "targetColumn": "AGENT_ID",
      "relationshipType": "one-to-many",
      "confidence": 0.9
    },
    {
      "id": "rel-9",
      "sourceTable": "DB2_COMMISSIONS",
      "sourceColumn": "CLM_ID",
      "targetTable": "DB2_CLAIMS",
      "targetColumn": "CLM_ID",
      "relationshipType": "one-to-many",
      "confidence": 0.9
    }
  ],
  "s2s_mappings": [
    {
      "id": "s2s-map-1",
      "sourceTable": "DB2_CLAIMS",
      "targetTable": "DB2_POLICIES",
      "confidence": 0.9,
      "description": "Claims reference Policies by POLICY_REF to POLICY_ID"
    },
    {
      "id": "s2s-map-2",
      "sourceTable": "DB2_CLAIMS",
      "targetTable": "DB2_CUSTOMERS",
      "confidence": 0.9,
      "description": "Claims reference Customers by CUSTOMER_REF to CUST_ID"
    },
    {
      "id": "s2s-map-3",
      "sourceTable": "DB2_PAYMENTS",
      "targetTable": "DB2_CLAIMS",
      "confidence": 0.9,
      "description": "Payments reference Claims by CLM_ID"
    },
    {
      "id": "s2s-map-4",
      "sourceTable": "DB2_ADJUSTMENTS",
      "targetTable": "DB2_CLAIMS",
      "confidence": 0.9,
      "description": "Adjustments reference Claims by CLM_ID"
    },
    {
      "id": "s2s-map-5",
      "sourceTable": "DB2_CLAIM_EVENTS",
      "targetTable": "DB2_CLAIMS",
      "confidence": 0.9,
      "description": "Claim Events reference Claims by CLM_ID"
    },
    {
      "id": "s2s-map-6",
      "sourceTable": "DB2_POLICY_HISTORY",
      "targetTable": "DB2_POLICIES",
      "confidence": 0.9,
      "description": "Policy History reference Policies by POLICY_ID"
    },
    {
      "id": "s2s-map-7",
      "sourceTable": "DB2_AGENTS",
      "targetTable": "DB2_RISK_RATINGS",
      "confidence": 0.9,
      "description": "Agents reference Risk Ratings by RATING_KEY"
    },
    {
      "id": "s2s-map-8",
      "sourceTable": "DB2_COMMISSIONS",
      "targetTable": "DB2_AGENTS",
      "confidence": 0.9,
      "description": "Commissions reference Agents by AGENT_ID"
    },
    {
      "id": "s2s-map-9",
      "sourceTable": "DB2_COMMISSIONS",
      "targetTable": "DB2_CLAIMS",
      "confidence": 0.9,
      "description": "Commissions reference Claims by CLM_ID"
    }
  ],
  "pk_fk_mappings": [
    {
      "id": "pk-fk-s2s-1",
      "sourceTable": "DB2_CLAIMS",
      "targetTable": "DB2_POLICIES",
      "confidence": 0.9,
      "description": "PK/FK: DB2_CLAIMS.POLICY_REF -> DB2_POLICIES.POLICY_ID"
    },
    {
      "id": "pk-fk-s2s-2",
      "sourceTable": "DB2_CLAIMS",
      "targetTable": "DB2_CUSTOMERS",
      "confidence": 0.9,
      "description": "PK/FK: DB2_CLAIMS.CUSTOMER_REF -> DB2_CUSTOMERS.CUST_ID"
    },
    {
      "id": "pk-fk-s2s-3",
      "sourceTable": "DB2_PAYMENTS",
      "targetTable": "DB2_CLAIMS",
      "confidence": 0.9,
      "description": "PK/FK: DB2_PAYMENTS.CLM_ID -> DB2_CLAIMS.CLM_ID"
    },
    {
      "id": "pk-fk-s2s-4",
      "sourceTable": "DB2_ADJUSTMENTS",
      "targetTable": "DB2_CLAIMS",
      "confidence": 0.9,
      "description": "PK/FK: DB2_ADJUSTMENTS.CLM_ID -> DB2_CLAIMS.CLM_ID"
    },
    {
      "id": "pk-fk-s2s-5",
      "sourceTable": "DB2_CLAIM_EVENTS",
      "targetTable": "DB2_CLAIMS",
      "confidence": 0.9,
      "description": "PK/FK: DB2_CLAIM_EVENTS.CLM_ID -> DB2_CLAIMS.CLM_ID"
    },
    {
      "id": "pk-fk-s2s-6",
      "sourceTable": "DB2_POLICY_HISTORY",
      "targetTable": "DB2_POLICIES",
      "confidence": 0.9,
      "description": "PK/FK: DB2_POLICY_HISTORY.POLICY_ID -> DB2_POLICIES.POLICY_ID"
    },
    {
      "id": "pk-fk-s2s-7",
      "sourceTable": "DB2_AGENTS",
      "targetTable": "DB2_RISK_RATINGS",
      "confidence": 0.9,
      "description": "PK/FK: DB2_AGENTS.RATING_KEY -> DB2_RISK_RATINGS.RATING_KEY"
    },
    {
      "id": "pk-fk-s2s-8",
      "sourceTable": "DB2_COMMISSIONS",
      "targetTable": "DB2_AGENTS",
      "confidence": 0.9,
      "description": "PK/FK: DB2_COMMISSIONS.AGENT_ID -> DB2_AGENTS.AGENT_ID"
    },
    {
      "id": "pk-fk-s2s-9",
      "sourceTable": "DB2_COMMISSIONS",
      "targetTable": "DB2_CLAIMS",
      "confidence": 0.9,
      "description": "PK/FK: DB2_COMMISSIONS.CLM_ID -> DB2_CLAIMS.CLM_ID"
    }
  ]
}