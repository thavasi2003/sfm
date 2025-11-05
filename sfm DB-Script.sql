
CREATE TABLE parts (
    partId INT AUTO_INCREMENT PRIMARY KEY,
    partname VARCHAR(255) NOT NULL,
    partsType VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unitOfMeasure VARCHAR(50) NOT NULL,
    linkToAssetId INT NOT NULL,
    locationZone VARCHAR(50) NOT NULL,
    locationSchoolId INT NOT NULL,
    locationSchoolName VARCHAR(255) NOT NULL,
    locationBlock VARCHAR(50) NOT NULL,
    locationLevel VARCHAR(50) NOT NULL,
    locationRoomNo VARCHAR(50) NOT NULL,
    locationRoomName VARCHAR(255) NOT NULL,
    locQRID VARCHAR(100) NOT NULL,
    partsImage LONGTEXT NOT NULL,
    storeName VARCHAR(255) NOT NULL,
    lastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updateBy INT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy INT NULL
);

CREATE TABLE account(
	userId INT PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(255) NOT NULL,
    displayName VARCHAR(255) NOT NULL,
    companyName VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    emailId VARCHAR(255) NOT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO account(userName,displayName,companyName,role,password,emailId,createdBy) Values('mkv001','Sudhan','MKV Engg & Trading Services Pte Ltd','Admin','1234','admin@gmail.com',1);

CREATE TABLE m_req_tag (
    reqId INT PRIMARY KEY AUTO_INCREMENT,
    reqName VARCHAR(255) NOT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO m_req_tag (reqName, createdBy)VALUES ('Tenant', 1);

CREATE TABLE checklist_token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    checklistId INT NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    used BOOLEAN DEFAULT FALSE,
    expiration DATETIME NOT NULL
);

CREATE TABLE m_flow (
    flowId INT PRIMARY KEY AUTO_INCREMENT,
    flowName VARCHAR(255) UNIQUE NOT NULL,
    createdBy INT,
    updatedBy INT, 
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE m_flow_details (
    flowId INT NOT NULL,
    stepNo INT NOT NULL,
    statusName TEXT NOT NULL,
    declaration TEXT NOT NULL,
    userId INT,
    createdBy INT,
    updatedBy INT,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES account(userId),
    FOREIGN KEY (flowId) REFERENCES m_flow(flowId) ON DELETE CASCADE,
    UNIQUE KEY(flowId,stepNo)
);

CREATE TABLE m_checklist (
    checklistId INT PRIMARY KEY AUTO_INCREMENT,
    cName VARCHAR(255) NOT NULL,
    frequency VARCHAR(255) NOT NULL,
    assignTo INT,
    signOff INT,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO m_checklist (cName, frequency, assignTo, signOff, createdBy) VALUES ('Standard Checklist', 'yearly', 1, 1, 1);


CREATE TABLE m_checklist_details (
    checklistId INT NOT NULL,
    serialNo INT NOT NULL,
    description TEXT NOT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (checklistId, serialNo),
    FOREIGN KEY (checklistId) REFERENCES m_checklist(checklistId)
);

INSERT INTO m_checklist_details (checklistId, serialNo, description)
VALUES 
(1, 1, 'Check and replace air filters if necessary'),
(1, 2, 'Inspect fan belts for wear and tear'),
(1, 3, 'Clean and lubricate fan motor'),
(1, 4, 'Inspect electrical connections'),
(1, 5, 'Test system operation and performance');

CREATE TABLE m_permit_type (
    ptId INT PRIMARY KEY AUTO_INCREMENT,
    ptName VARCHAR(255) NOT NULL,
    checklistId INT NOT NULL,
    flowId INT NOT NULL,
    reqId INT NOT NULL,
    remarks TEXT NOT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active VARCHAR(255) NOT NULL,
    FOREIGN KEY (checklistId) REFERENCES m_checklist(checklistId),
    FOREIGN KEY (flowId) REFERENCES m_flow(flowId),
    FOREIGN KEY (reqId) REFERENCES m_req_tag(reqId)
);

CREATE TABLE m_permit_to_work(
	appId INT PRIMARY KEY AUTO_INCREMENT,
    ptId INT NOT NULL,
    activeStatus VARCHAR(10),
    current_step_no INT DEFAULT 1,
    workStatus INT,
    appStatus VARCHAR(50),
    email VARCHAR(50),
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
	updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (ptId) REFERENCES m_permit_type(ptId) ON DELETE CASCADE
   );

CREATE TABLE app_sign_off(
    appId INT NOT NULL,
    statusName VARCHAR(255),
    signOff_remarks TEXT,
    userId INT,
    signature LONGTEXT ,
    processedAt TIMESTAMP,
    email VARCHAR(50),
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appId) REFERENCES m_permit_to_work(appId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES account(userId)
);

CREATE TABLE m_ptw_response(
	appId INT NOT NULL,
	serialNo INT NOT NULL,
    checkOptions VARCHAR(50) NOT NULL,
    remarks TEXT NOT NULL,
    email VARCHAR(50),
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (appId) REFERENCES m_permit_to_work(appId) ON DELETE CASCADE
);

CREATE TABLE asset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO asset (id,name) VALUES
(1, 'Asset 1'),
(2, 'Asset 2'),
(3, 'Asset 3');

CREATE TABLE meter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meter_name VARCHAR(100) NOT NULL,
    meter_unit VARCHAR(30) ,
    zone VARCHAR(255),
    school VARCHAR(255),
    warranty_till DATE,
    install_on DATE,
    asset_id VARCHAR(50),
    asset_location VARCHAR(255),
    block VARCHAR(50),
    level VARCHAR(50),
    image LONGTEXT
  );

CREATE TABLE mreading (
    reading_id INT AUTO_INCREMENT PRIMARY KEY,
    meter_name VARCHAR(100),
    meter_reading INT NOT NULL,
    meter_unit VARCHAR(100),
    update_on DATETIME NOT NULL,
    update_by VARCHAR(30),
    image LONGTEXT,
    meter_id INT NOT NULL,
    FOREIGN KEY (meter_id) REFERENCES meter(id)
  );

 CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zone VARCHAR(255) NOT NULL,
    school VARCHAR(255) NOT NULL,
    tech_name VARCHAR(100) NOT NULL,
    date DATE not null,
    checkin time NOT NULL,
    checkout time NOT NULL,
    image LONGTEXT
);

CREATE TABLE school (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zone VARCHAR(50) NOT NULL,
    school_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL
);

INSERT INTO school (id, zone, school_name, address) VALUES
(1, 'EAST-G1', 'Haig Girls School', '51, Koon Seng Rd,S(427072)'),
(2, 'EAST-G1', 'Canossa Catholic Primary School', '1, Salim Rd,S(387621)'),
(3, 'EAST-G1', 'CHIJ (Katong) Primary', '17,Martia Rd,S(424821)'),
(4, 'EAST-G1', 'Geylang Methodist School (Primary)', '4, Geylang East Central,S(389706)'),
(5, 'EAST-G1', 'Kong Hwa School', '350,Guillemard Rd,S(399772)'),
(6, 'EAST-G1', 'Maha Bodhi School', '10, Ubi Ave 1,S(408931)'),
(7, 'EAST-G1', 'St Margaret''s Primary School (Holding @ Former Macpherson Primary School', '2, Mattar Road,S(387724)'),
(8, 'EAST-G1', 'Tao Nan School', '49, Marine Crescent,S(449761)'),
(9, 'EAST-G1', 'Broadrick Secondary School', '61, Dakota Crescent,S(399935)'),
(10, 'EAST-G1', 'Dunman High School', '10, Tanjong Rhu Rd,S(436895)'),
(11, 'EAST-G1', 'Tanjong Katong Primary School', '10 Seraya Road,S(437259)'),
(12, 'EAST-G1', 'Tanjong Katong Girls'' School', '20 Dunman Lane,S(439272)'),
(13, 'EAST-G1', 'Tanjong Katong Secondary School', '130, Haig Rd,S(438796)'),
(14, 'EAST-G1', 'Geylang Methodist School (Secondary)', '2, Geylang East Central,S(389705)'),
(15, 'EAST-G1', 'Manjusri Secondary School', '20, Ubi Ave 1,S(408940)'),
(16, 'EAST-G1', 'Dunman High School Hostel', '61, Kampong Arang Rd,S(438181)'),
(17, 'EAST-G2', 'Victoria School Hostel', '4, Siglap Link,S(448879)'),
(18, 'EAST-G2', 'St Hilda''s Secondary School', '2, Tampines St 82,S(528986)'),
(19, 'EAST-G2', 'St Patrick''s School', '490, East Coast Rd,S(429058)'),
(20, 'EAST-G2', 'Tampines Primary School - [inclusive MOE Kindergarten & Kindergarten Care]', '250, Tampines St 12,S(529426)'),
(21, 'EAST-G2', 'Temasek Secondary School', '600, Upper East Coast Rd,S(465561)'),
(22, 'EAST-G2', 'Victoria School', '2, Siglap Link,S(448880)'),
(23, 'EAST-G2', 'CHIJ Katong Convent', '346, Marine Terrace,S(449150)'),
(24, 'EAST-G2', 'Temasek Primary School', '501, Bedok South Ave 3,S(469300)'),
(25, 'EAST-G2', 'Springfield Secondary School', '30, Tampines Ave 8,S(529593)'),
(26, 'EAST-G2', 'Tampines Secondary School', '252, Tampines St 12,S(529427)'),
(27, 'EAST-G2', 'Ngee Ann Primary School', '344, Marine Terrace,S(449149)'),
(28, 'EAST-G2', 'Poi Ching School', '21, Tampines St 71,S(529067)'),
(29, 'EAST-G2', 'St Hilda''s Primary School', '2, Tampines Ave 3,S(529706)'),
(30, 'EAST-G2', 'St Stephen''s School', '20, Siglap View,S(455789)'),
(31, 'EAST-G2', 'Junyuan Primary School [inclusive MOE Kindergarten & Kindergarten Care]', '2, Tampines St 91,S(528906)'),
(32, 'EAST-G2', 'Angsana Primary School - [inclusive MOE Kindergarten & Kindergarten Care]', '51, Tampines Street 61,S(528565)'),
(33, 'EAST-G3', 'Casuarina Primary School', '30, Pasir Ris St 41,S(518935)'),
(34, 'EAST-G3', 'East Spring Primary School', '31, Tampines St 33,S(529258)'),
(35, 'EAST-G3', 'Elias Park Primary School', '11, Pasir Ris St 52,S(518866)'),
(36, 'EAST-G3', 'Gongshang Primary School [inclusive MOE Kindergarten & Kindergarten Care]', '1, Tampines St 42,S(529176)'),
(37, 'EAST-G3', 'Meridian Primary School [inclusive MOE Kindergarten & Kindergarten Care]', '20, Pasir Ris St 71,S(518798)'),
(38, 'EAST-G3', 'Pasir Ris Primary School', '5, Pasir Ris St 21,S(518968)'),
(39, 'EAST-G3', 'Tampines North Primary School', '30, Tampines Ave 9,S(529565)'),
(40, 'EAST-G3', 'Loyang View Secondary School', '12, Pasir Ris St 11,S(519073)'),
(41, 'EAST-G3', 'Meridian Secondary School', '31, Pasir Ris St 51,S(518901)'),
(42, 'EAST-G3', 'Pasir Ris Crest Secondary School', '11, Pasir Ris St 41,S(518934)'),
(43, 'EAST-G3', 'Pasir Ris Secondary School', '390, Tampines St 21,S(529400)'),
(44, 'EAST-G3', 'Dunman Secondary School', '21, Tampines St 45,S(529093)'),
(45, 'EAST-G3', 'East Spring Secondary School', '30, Tampines St 34,S(529231)'),
(46, 'EAST-G3', 'White Sands Primary School', '2, Pasir Ris St 11,S(519075)'),
(47, 'EAST-G3', 'Tampines Meridian Junior College', '21, Pasir Ris St 71,S(518799)'),
(48, 'EAST-G3', 'Ngee Ann Secondary School', '1, Tampines St 32,S(529283)'),
(49, 'EAST-G3', 'Hai Sing Catholic School (Holding @ Former Greenview Secondary School)', '15, Pasir Ris St 21,S(518969)'),
(50, 'EAST-G3', 'Temasek Junior College', '2 Tampines Avenue 9, S(529564)');

CREATE TABLE fault_report (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fault_type VARCHAR(255) NOT NULL,
    priority  VARCHAR(255) NOT NULL,
    zone VARCHAR(255) NOT NULL,
    school VARCHAR(255) NOT NULL,
    block VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    room_name VARCHAR(255) NOT NULL,
    droup_down VARCHAR(255) NOT NULL,
    requestor_name VARCHAR(255) NOT NULL,
    requestor_contact VARCHAR(255) NOT NULL,
    description  VARCHAR(255),
    image LONGTEXT,
    report_said VARCHAR(255),
    created_at DATE NOT NULL
);

CREATE TABLE iaq_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id INT,
  co2 INT,
  humidity FLOAT,
  `location` VARCHAR(100),
  pm10 INT,
  pm25 INT,
  temperature FLOAT,
  user_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE location (
  id INT AUTO_INCREMENT PRIMARY KEY,
  locQRID VARCHAR(55) NOT NULL,
  block VARCHAR(25) NOT NULL,
  level VARCHAR(50) NOT NULL,
  room_no VARCHAR(55) NOT NULL,
  room_name VARCHAR(155) NOT NULL,
  school_name VARCHAR(155) NOT NULL,
  school_id INT,
  FOREIGN KEY (school_id) REFERENCES school(id)
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zone VARCHAR(255),
    schoolName VARCHAR(255),
    block VARCHAR(255),
    level VARCHAR(255),
    roomNo VARCHAR(255),
    roomName VARCHAR(255),
    date DATE,
    timeStart TIME,
    timeEnd TIME,
    remarks TEXT,
    equipment JSON,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled ') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE licenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `description` VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    linked_to VARCHAR(255) null,
    assigned_to VARCHAR(255) null,
    renewal_status ENUM('pending', 'processing', 'completed') DEFAULT 'pending',
    renewal_date DATE null,
    reminder VARCHAR(255) null,
    email VARCHAR(255) null,
    reminder_days INT null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE visitor_management (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requestor_name VARCHAR(100) NOT NULL,
    visitor_name VARCHAR(100) NOT NULL,
    visitor_email VARCHAR(100) NOT NULL,
    expected_arrival_time DATETIME,
    visitor_code VARCHAR(8) NOT NULL,
    visiting_purpose VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE visitor_entry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_code VARCHAR(20) NOT NULL,
    visitor_name VARCHAR(100) NOT NULL,
    expected_arrival_time DATETIME,
    from_organization VARCHAR(100),
    check_in DATETIME,
    check_out datetime, 
    image LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `zone` VARCHAR(255),
    schoolName VARCHAR(255),
    team VARCHAR(20),
    maintenanceType VARCHAR(50),
    `priority` varchar(50),
	dateStart DATE,
    dateEnd DATE,  
    reschedulestart DATE,  
    rescheduleend DATE,
    remarks TEXT,    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE renewal_status_history(
    id INT AUTO_INCREMENT PRIMARY KEY,
    license_id INT, 
    `status` ENUM('pending','processing','completed','cancelled'), 
    remarks TEXT, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);