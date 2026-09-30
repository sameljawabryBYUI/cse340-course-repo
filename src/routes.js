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
import { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole
} from './controllers/users.js';
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
router.get('/new-organization', requireRole('admin'), showAddOrganizationForm);
router.post('/new-organization', requireRole('admin'), validateOrganizationRules, processAddOrganizationForm);

// Edit Organization
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), validateOrganizationRules, processEditOrganizationForm);


// ==========================================
// PROJECT ROUTES
// ==========================================
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Create Project
router.get('/new-project', requireRole('admin'), showAddProjectForm);
router.post('/new-project', requireRole('admin'), validateProjectRules, processAddProjectForm);

// Edit Project
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), validateProjectRules, processEditProjectForm);

// Assign Categories to Project
router.get('/project/:id/assign-categories', requireRole('admin'), showAssignCategoriesForm);
router.post('/project/:id/assign-categories', requireRole('admin'), processAssignCategoriesForm);


// ==========================================
// CATEGORY ROUTES
// ==========================================
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Create Category
router.get('/new-category', requireRole('admin'), showAddCategoryForm);
router.post('/new-category', requireRole('admin'), validateCategoryRules, processAddCategoryForm); 

// Edit Category
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), validateCategoryRules, processEditCategoryForm); 


// ==========================================
// REGISTRATION, AUTHENTICATION & DASHBOARD
// ==========================================
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);


// Error testing route
router.get('/test-error', testErrorPage);

export default router;