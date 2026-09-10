-- Drop tables in reverse order of dependencies to prevent errors if re-running
DROP TABLE IF EXISTS project_category CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS organization CASCADE;

-- 1. Create Organization Table
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- 2. Create Project Table (Team Activity Requirement)
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL
);

-- 3. Create Category Table (W02 Assignment Requirement)
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- 4. Create Junction Table to link Projects and Categories (Many-to-Many)
CREATE TABLE project_category (
    project_id INTEGER NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- 5. Insert Sample Organizations
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'env-org.jpg'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'edu-org.jpg'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'community-org.jpg');

-- 6. Insert 15 Projects (Strictly 5 per organization as required by the Team Activity)
INSERT INTO project (organization_id, title, description, location, project_date) VALUES
(1, 'Playground Build', 'Building a new community playground.', 'City Park', '2026-10-15'),
(1, 'School Repair', 'Fixing the roof at the local elementary school.', 'Local School', '2026-10-22'),
(1, 'Community Center Paint', 'Repainting the interior of the community center.', 'Community Center', '2026-11-05'),
(1, 'Sidewalk Ramp Installation', 'Installing ADA compliant ramps.', 'Downtown', '2026-11-12'),
(1, 'Library Shelving', 'Building new shelves for the local library.', 'Public Library', '2026-11-19'),
(2, 'Community Garden Prep', 'Preparing soil for spring planting.', 'Eastside Garden', '2026-10-10'),
(2, 'Tree Planting', 'Planting 50 saplings.', 'Riverside Park', '2026-10-24'),
(2, 'Urban Foraging Tour', 'Teaching locals about edible plants.', 'City Trails', '2026-11-07'),
(2, 'Compost Bin Build', 'Building community compost bins.', 'Southside Garden', '2026-11-14'),
(2, 'Winter Crop Harvesting', 'Harvesting late-season crops.', 'Northside Garden', '2026-11-21'),
(3, 'Food Drive Sorting', 'Sorting donated canned goods.', 'Food Bank', '2026-10-17'),
(3, 'Elderly Care Visits', 'Spending time with seniors.', 'Sunrise Care Home', '2026-10-31'),
(3, 'After School Tutoring', 'Math and reading help for kids.', 'Community Center', '2026-11-04'),
(3, 'Winter Coat Drive', 'Collecting and distributing coats.', 'City Hall', '2026-11-11'),
(3, 'Holiday Meal Delivery', 'Delivering hot meals to those in need.', 'Downtown', '2026-11-26');

-- 7. Insert Categories (W02 Assignment Requirement)
INSERT INTO category (category_name) VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- 8. Link Projects to Categories
INSERT INTO project_category (project_id, category_id) VALUES
(1, 3), (2, 2), (3, 3), (4, 3), (5, 2),
(6, 1), (7, 1), (8, 1), (8, 2), (9, 1), (10, 1),
(11, 3), (12, 4), (13, 2), (14, 3), (15, 4), (15, 3);