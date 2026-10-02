import { 
    getUpcomingProjects, 
    getProjectDetails, 
    createProject, 
    updateProject, 
    updateProjectCategories,
    addVolunteerToProject,         // NEW
    removeVolunteerFromProject,    // NEW
    checkIfUserIsVolunteering      // NEW
} from '../models/projects.js';
import { getCategoriesByProjectId, getAllCategories } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const validateProjectRules = [
    body('title').trim().notEmpty().withMessage('Title is required.').isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters.'),
    body('description').trim().notEmpty().withMessage('Description is required.').isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters.'),
    body('location').trim().notEmpty().withMessage('Location is required.').isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters.'),
    body('date').notEmpty().withMessage('Project date is required.').isISO8601().withMessage('Must be a valid date format.'),
    body('organizationId').notEmpty().withMessage('Organization is required.').isInt().withMessage('Organization ID must be a valid integer.')
];

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);
    const title = 'Service Project Details';
    
    // NEW: Check if user is logged in and if they are volunteering
    let isVolunteering = false;
    if (req.session && req.session.user) {
        isVolunteering = await checkIfUserIsVolunteering(req.session.user.user_id, projectId);
    }
    
    // Pass isVolunteering to the view
    res.render('project', { title, projectDetails, categories, isVolunteering });
};

const showAddProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';
    res.render('add-project', { title, organizations });
};

const processAddProjectForm = async (req, res) => {
    const { title, description, location, date, organizationId } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => { req.flash('error', error.msg); });
        const organizations = await getAllOrganizations();
        return res.render('add-project', { title: 'Add New Service Project', organizations, projTitle: title, description, location, date, organizationId });
    }

    const newProjectId = await createProject(title, description, location, date, organizationId);
    req.flash('success', 'Project added successfully!');
    res.redirect(`/project/${newProjectId}`);
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    const title = 'Edit Service Project';
    res.render('edit-project', { title, projectDetails, organizations });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => { req.flash('error', error.msg); });
        const organizations = await getAllOrganizations();
        const projectDetails = { project_id: projectId, title, description, location, project_date: date, organization_id: organizationId };
        return res.render('edit-project', { title: 'Edit Service Project', projectDetails, organizations });
    }

    await updateProject(projectId, title, description, location, date, organizationId);
    req.flash('success', 'Service Project updated successfully!');
    res.redirect(`/project/${projectId}`);
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const allCategories = await getAllCategories();
    const currentCategories = await getCategoriesByProjectId(projectId);
    const currentCategoryIds = currentCategories.map(c => c.category_id);
    const title = 'Assign Categories to Project';
    res.render('assign-categories', { title, projectDetails, allCategories, currentCategoryIds });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;
    const selectedCategories = req.body.categories; 
    await updateProjectCategories(projectId, selectedCategories);
    req.flash('success', 'Project categories updated successfully!');
    res.redirect(`/project/${projectId}`);
};

// --- NEW: Volunteering Form Controllers ---

const volunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id; // Safe because of requireLogin middleware
    
    await addVolunteerToProject(userId, projectId);
    req.flash('success', 'You are now volunteering for this project!');
    res.redirect(`/project/${projectId}`);
};

const unvolunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id; 
    
    await removeVolunteerFromProject(userId, projectId);
    req.flash('success', 'You have been removed as a volunteer for this project.');
    res.redirect(`/project/${projectId}`);
};

export { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showAddProjectForm,
    processAddProjectForm,
    showEditProjectForm, 
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    validateProjectRules,
    volunteerForProject,       // NEW
    unvolunteerForProject      // NEW
};