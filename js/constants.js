const [
    layout,
    nav, footer,
    about, 
    experience, experienceRecord,
    education, edu, eduTab,
    skills, skill,
    projects, project,
    login, register, contact
] = [
    './templates/layout.hbs',
    './templates/common/nav.hbs', './templates/common/footer.hbs',
    './templates/main/about.hbs', 
    './templates/main/experience.hbs', './templates/partials/experienceRecord.hbs',
    './templates/main/education.hbs', './templates/partials/edu.hbs', './templates/partials/eduTab.hbs',
    './templates/main/skills.hbs', './templates/partials/skill.hbs',
    './templates/main/projects.hbs', './templates/partials/project.hbs',
    './templates/forms/login.hbs', './templates/forms/register.hbs', './templates/forms/contact.hbs'
];

const ROUTES = {
    index: 'index.html',
    login: '#/login',
    register: '#/register',
    about: '#/about',
    experience: "#/experience",
    skills: "#/skills",
    education: "#/education",
    projects: "#/projects",
    contact: "#/contact",
};

function getLang() {
    return "content/" + (sessionStorage.getItem('currentLanguage') || "en") + ".json";
}


