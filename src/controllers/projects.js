import { getUpcomingProjects, getProjectDetails, updateProject, updateProjectCategories } from '../models/projects.js';
import { getCategoriesByProjectId, getAllCategories } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

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
    res.render('project', { title, projectDetails, categories });
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
    
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${projectId}`);
    }

    const { title, description, location, date, organizationId } = req.body;
    await updateProject(projectId, title, description, location, date, organizationId);
    
    req.flash('success', 'Service Project updated successfully!');
    res.redirect(`/project/${projectId}`);
};

// NEW: Show the checkbox form to assign categories
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const allCategories = await getAllCategories();
    const currentCategories = await getCategoriesByProjectId(projectId);
    
    // Extract just the IDs of the currently assigned categories to check the boxes
    const currentCategoryIds = currentCategories.map(c => c.category_id);
    
    const title = 'Assign Categories to Project';
    res.render('assign-categories', { title, projectDetails, allCategories, currentCategoryIds });
};

// NEW: Process the form submission
const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;
    const selectedCategories = req.body.categories; 
    
    await updateProjectCategories(projectId, selectedCategories);
    
    req.flash('success', 'Project categories updated successfully!');
    res.redirect(`/project/${projectId}`);
};

export { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showEditProjectForm, 
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};