import express from 'express';
import { showHomePage } from './controllers/index.js';
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage,
    showAddOrganizationForm,
    processAddOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    validateOrganizationRules
} from './controllers/organizations.js';
import { 
    showProjectsPage, 
    showProjectDetailsPage,
    showAddProjectForm,
    processAddProjectForm,
    showEditProjectForm, 
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    validateProjectRules
} from './controllers/projects.js';
import { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAddCategoryForm,
    processAddCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    validateCategoryRules
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Home route
router.get('/', showHomePage);

// ==========================================
// ORGANIZATION ROUTES
// ==========================================
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Create Organization
router.get('/new-organization', showAddOrganizationForm);
router.post('/new-organization', validateOrganizationRules, processAddOrganizationForm);

// Edit Organization
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', validateOrganizationRules, processEditOrganizationForm);


// ==========================================
// PROJECT ROUTES
// ==========================================
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Create Project
router.get('/new-project', showAddProjectForm);
router.post('/new-project', validateProjectRules, processAddProjectForm);

// Edit Project
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', validateProjectRules, processEditProjectForm);

// Assign Categories to Project
router.get('/project/:id/assign-categories', showAssignCategoriesForm);
router.post('/project/:id/assign-categories', processAssignCategoriesForm);


// ==========================================
// CATEGORY ROUTES
// ==========================================
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Create Category
router.get('/new-category', showAddCategoryForm);
router.post('/new-category', validateCategoryRules, processAddCategoryForm); 

// Edit Category
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', validateCategoryRules, processEditCategoryForm); 


// Error testing route
router.get('/test-error', testErrorPage);

export default router;