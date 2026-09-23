import { 
    getAllOrganizations, 
    getOrganizationDetails,
    createOrganization,
    updateOrganization 
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// ----------------------------------------------------
// Reusable Validation Logic for Organizations (Criteria 4 & 5)
// ----------------------------------------------------
const validateOrganizationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required.')
        .isLength({ min: 3, max: 150 }).withMessage('Organization name must be between 3 and 150 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),
    body('contact_email')
        .trim()
        .normalizeEmail()
        .notEmpty().withMessage('Contact email is required.')
        .isEmail().withMessage('Must be a valid email address.')
];

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';
    res.render('organization', { title, organizationDetails, projects });
};

// --- NEW FORM CONTROLLERS ---

const showAddOrganizationForm = (req, res) => {
    const title = 'Add New Organization';
    res.render('add-organization', { title });
};

const processAddOrganizationForm = async (req, res) => {
    const { name, description, contact_email } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        const title = 'Add New Organization';
        // Render sticky form
        return res.render('add-organization', { title, name, description, contact_email });
    }

    // Pass the required placeholder logo string to the model
    const logo_filename = 'placeholder-logo.png'; 

    const newOrgId = await createOrganization(name, description, contact_email, logo_filename);
    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${newOrgId}`);
};

const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const title = 'Edit Organization';
    res.render('edit-organization', { title, organizationDetails });
};

const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const { name, description, contact_email } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        // Rebuild details object for sticky form
        const organizationDetails = { organization_id: organizationId, name, description, contact_email };
        const title = 'Edit Organization';
        return res.render('edit-organization', { title, organizationDetails });
    }

    // Safely fetch existing logo so it isn't overwritten during an update
    const existingOrg = await getOrganizationDetails(organizationId);
    const logo_filename = req.body.logo_filename || existingOrg.logo_filename || 'placeholder-logo.png';

    await updateOrganization(organizationId, name, description, contact_email, logo_filename);
    req.flash('success', 'Organization updated successfully!');
    res.redirect(`/organization/${organizationId}`);
};

export { 
    showOrganizationsPage, 
    showOrganizationDetailsPage,
    showAddOrganizationForm,
    processAddOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    validateOrganizationRules
};