window.jsPDF = window.jspdf.jsPDF; // Correctly initialize jsPDF

let currentStep = 0;
const formSteps = document.querySelectorAll('.form-step');
const stepIndicators = document.querySelectorAll('.step-indicator .step');
const nextButtons = document.querySelectorAll('.next-btn');
const prevButtons = document.querySelectorAll('.prev-btn');
const admissionForm = document.getElementById('admissionForm');

const courseRadios = document.querySelectorAll('input[name="course"]');
const yearSelection = document.getElementById('yearSelection');
const yearDropdown = document.getElementById('yearDropdown');
const bscOptions = document.getElementById('bscOptions');
const bcaSemesters = document.getElementById('bcaSemesters');
const bcaSemesterDropdown = document.getElementById('bcaSemesterDropdown');

const baSelection = document.getElementById('baSelection');
const bcomSelection = document.getElementById('bcomSelection');
const bscSelection = document.getElementById('bscSelection');
const bcaSelection = document.getElementById('bcaSelection');

const baCheckboxesContainer = document.getElementById('baCheckboxes');
const bcomCheckboxesContainer = document.getElementById('bcomCheckboxes');
const bscCheckboxesContainer = document.getElementById('bscCheckboxes');
const bcaCheckboxesContainer = document.getElementById('bcaCheckboxes');

// Image previews
const passportPhotoInput = document.getElementById('passportPhoto');
const passportPhotoPreview = document.getElementById('passportPhotoPreview');
const aadhaarCardInput = document.getElementById('aadhaarCard');
const aadhaarCardPreview = document.getElementById('aadhaarCardPreview');


// Define subjects for dynamic loading
const BA_SUBJECTS = {
    '1st Year': ['English', 'Hindi', 'History', 'Political Science', 'Economics', 'Sociology', 'Public Administration', 'Mathematics', 'Sanskrit'],
    '2nd Year': ['English', 'Hindi', 'History', 'Political Science', 'Economics', 'Sociology', 'Public Administration', 'Mathematics', 'Sanskrit'],
    '3rd Year': ['English', 'Hindi', 'History', 'Political Science', 'Economics', 'Sociology', 'Public Administration', 'Mathematics', 'Sanskrit']
};

const BCOM_SUBJECTS = {
    '1st Year': ['Financial Accounting', 'Business Law', 'Business Economics', 'Business Statistics', 'Environmental Studies (Compulsory)'],
    '2nd Year': ['Corporate Accounting', 'Income Tax Law & Practice', 'Cost Accounting', 'E-Commerce', 'Company Law'],
    '3rd Year': ['Auditing', 'Goods & Services Tax (GST)', 'Financial Management', 'Banking & Insurance', 'Entrepreneurship']
};

const BSC_MEDICAL_SUBJECTS = {
    '1st Year': ['Botany', 'Zoology', 'Chemistry', 'English (Compulsory)'],
    '2nd Year': ['Botany', 'Zoology', 'Chemistry'],
    '3rd Year': ['Botany', 'Zoology', 'Chemistry']
};

const BSC_NON_MEDICAL_SUBJECTS = {
    '1st Year': ['Physics', 'Chemistry', 'Mathematics', 'English (Compulsory)'],
    '2nd Year': ['Physics', 'Chemistry', 'Mathematics'],
    '3rd Year': ['Physics', 'Chemistry', 'Mathematics']
};

const BCA_SUBJECTS = {
    '1': ['Fundamentals of Computers', 'Programming in C', 'Mathematics', 'Digital Electronics'],
    '2': ['Data Structures', 'Object-Oriented Programming with C++', 'Discrete Mathematics', 'Operating System Concepts'],
    '3': ['Database Management Systems', 'Java Programming', 'Computer Networks', 'Software Engineering'],
    '4': ['Web Technologies (HTML, CSS, JS)', 'Python Programming', 'Theory of Computation', 'Artificial Intelligence Concepts'],
    '5': ['Computer Graphics', 'Cloud Computing', 'Cyber Security', 'Mobile Application Development'],
    '6': ['Project Work', 'Minor Project', 'Elective Subject 1', 'Elective Subject 2']
};


// --- Step Navigation Functions ---
function showStep(stepIndex) {
    formSteps.forEach((step, index) => {
        step.classList.toggle('active', index === stepIndex);
    });
    stepIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === stepIndex);
    });
    currentStep = stepIndex;
    updateVisibilityOfCourseSections(); // Update visibility whenever step changes
}

function nextStep() {
    // Basic validation for the current step before moving next
    if (!validateCurrentStep()) {
        return; // Stop if validation fails
    }

    if (currentStep < formSteps.length - 1) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

// --- Validation Function ---
function validateCurrentStep() {
    const currentFormStep = formSteps[currentStep];
    const inputs = currentFormStep.querySelectorAll('[required]');
    let isValid = true;

    // Reset custom validation messages
    inputs.forEach(input => {
        input.setCustomValidity('');
    });

    for (let i = 0; i < inputs.length; i++) {
        if (!inputs[i].checkValidity()) {
            inputs[i].reportValidity();
            isValid = false;
            return false; // Stop at the first invalid input
        }

        // Specific validation for Step 2 (Course & Year/Semester)
        if (currentStep === 1) {
            const selectedCourse = document.querySelector('input[name="course"]:checked');
            if (!selectedCourse) {
                alert('Please select a course.');
                return false;
            }

            if (selectedCourse.value !== 'BCA') { // For BA, BCom, BSc, check year dropdown
                if (yearDropdown.value === "") {
                    alert('Please select a year.');
                    return false;
                }
            } else { // For BCA, check semester dropdown
                if (bcaSemesterDropdown.value === "") {
                    alert('Please select a semester.');
                    return false;
                }
            }

            // Subject selection validation for BA
            if (selectedCourse.value === 'BA' && yearDropdown.value === '1st Year') {
                const selectedBASubjects = baCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked').length;
                if (selectedBASubjects !== 3) {
                    alert('For BA 1st Year, please select exactly 3 elective subjects.');
                    return false;
                }
            }

            // Subject selection validation for BSc
            if (selectedCourse.value === 'BSc') {
                const selectedBscType = document.querySelector('input[name="bscType"]:checked');
                if (!selectedBscType) {
                    alert('Please select a BSc Type (Medical/Non-Medical).');
                    return false;
                }
            }
        }
    }
    return isValid;
}

// --- Event Listeners for Navigation ---
nextButtons.forEach(button => {
    button.addEventListener('click', nextStep);
});

prevButtons.forEach(button => {
    button.addEventListener('click', prevStep);
});

stepIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        // Allow clicking on previous steps, but not future steps unless current step is valid
        if (index < currentStep || validateCurrentStep()) {
             showStep(index);
        } else {
             alert('Please complete the current step before jumping ahead.');
        }
    });
});

// --- Step 1 Reset Button ---
function resetPersonalInfo() {
    // Get the current form step element
    const currentFormStep = formSteps[0]; // Assuming reset button is only for step 1

    // Find all input and select elements within this step
    const inputs = currentFormStep.querySelectorAll('input[type="text"], input[type="email"], input[type="date"], select');

    inputs.forEach(input => {
        if (input.type === 'text' || input.type === 'email' || input.type === 'date') {
            input.value = ''; // Clear text, email, date inputs
        } else if (input.tagName === 'SELECT') {
            input.selectedIndex = 0; // Reset dropdowns to the first option
        }
    });

    // Clear the qualification table inputs separately
    const qualInputs = currentFormStep.querySelectorAll('.qualification-table input[type="text"]');
    qualInputs.forEach(input => {
        input.value = '';
    });
}


// --- Step 2: Course & Year/Semester Logic ---

// Function to reset all course-related sections
function resetCourseSelections() {
    yearSelection.style.display = 'none';
    bscOptions.style.display = 'none';
    bcaSemesters.style.display = 'none';

    baSelection.style.display = 'none';
    bcomSelection.style.display = 'none';
    bscSelection.style.display = 'none';
    bcaSelection.style.display = 'none';

    yearDropdown.value = "";
    bcaSemesterDropdown.value = "";

    baCheckboxesContainer.innerHTML = '';
    bcomCheckboxesContainer.innerHTML = '';
    bscCheckboxesContainer.innerHTML = '';
    bcaCheckboxesContainer.innerHTML = '';

    document.querySelectorAll('input[name="bscType"]').forEach(radio => radio.checked = false);
}

function handleCourseChange() {
    resetCourseSelections();
    const selectedCourse = document.querySelector('input[name="course"]:checked')?.value;

    if (selectedCourse === 'BA' || selectedCourse === 'BCom' || selectedCourse === 'BSc') {
        yearSelection.style.display = 'block';
    }

    if (selectedCourse === 'BCA') {
        bcaSemesters.style.display = 'block';
        bcaSelection.style.display = 'block';
        populateSubjects(BCA_SUBJECTS, bcaSemesterDropdown.value, bcaCheckboxesContainer);
    }
}

function handleYearChange() {
    const selectedCourse = document.querySelector('input[name="course"]:checked')?.value;
    const selectedYear = yearDropdown.value;

    baSelection.style.display = 'none';
    bcomSelection.style.display = 'none';
    bscSelection.style.display = 'none';
    bscOptions.style.display = 'none';

    baCheckboxesContainer.innerHTML = '';
    bcomCheckboxesContainer.innerHTML = '';
    bscCheckboxesContainer.innerHTML = '';

    if (selectedCourse === 'BA' && selectedYear) {
        baSelection.style.display = 'block';
        populateSubjects(BA_SUBJECTS, selectedYear, baCheckboxesContainer, 'BA');
    } else if (selectedCourse === 'BCom' && selectedYear) {
        bcomSelection.style.display = 'block';
        populateSubjects(BCOM_SUBJECTS, selectedYear, bcomCheckboxesContainer, 'BCom');
    } else if (selectedCourse === 'BSc' && selectedYear) {
        bscOptions.style.display = 'block';
        bscSelection.style.display = 'block';
        document.querySelectorAll('input[name="bscType"]').forEach(radio => radio.checked = false); // Clear previous selection
        // Subjects will be populated when BSC type is selected
    }
}

function handleBScTypeChange() {
    const selectedBscType = document.querySelector('input[name="bscType"]:checked')?.value;
    const selectedYear = yearDropdown.value;
    bscCheckboxesContainer.innerHTML = '';

    if (selectedBscType === 'Medical' && selectedYear) {
        populateSubjects(BSC_MEDICAL_SUBJECTS, selectedYear, bscCheckboxesContainer);
    } else if (selectedBscType === 'Non-Medical' && selectedYear) {
        populateSubjects(BSC_NON_MEDICAL_SUBJECTS, selectedYear, bscCheckboxesContainer);
    }
}

function handleBCASemesterChange() {
    const selectedSemester = bcaSemesterDropdown.value;
    bcaCheckboxesContainer.innerHTML = '';
    if (selectedSemester) {
        populateSubjects(BCA_SUBJECTS, selectedSemester, bcaCheckboxesContainer);
    }
}

function populateSubjects(subjectMap, key, container, courseType = '') {
    container.innerHTML = ''; // Clear previous subjects
    const subjects = subjectMap[key];
    if (subjects) {
        subjects.forEach(subject => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.classList.add('checkbox-item'); // Optional: for finer styling
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'subject';
            checkbox.value = subject;
            checkbox.id = `subject-${subject.replace(/\s/g, '-')}`; // Create a valid ID

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = subject;

            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            container.appendChild(checkboxDiv);
        });

        // Add event listener for BA 1st Year subject limit
        if (courseType === 'BA' && key === '1st Year') {
            const baSubjectCheckboxes = container.querySelectorAll('input[type="checkbox"]');
            baSubjectCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const selectedCount = container.querySelectorAll('input[type="checkbox"]:checked').length;
                    if (selectedCount > 3) {
                        checkbox.checked = false; // Uncheck the last selected one
                        alert('You can select a maximum of 3 elective subjects for BA 1st Year.');
                    }
                });
            });
        }
    }
}

// Initial setup for course change listeners
courseRadios.forEach(radio => {
    radio.addEventListener('change', handleCourseChange);
});
yearDropdown.addEventListener('change', handleYearChange);
document.querySelectorAll('input[name="bscType"]').forEach(radio => {
    radio.addEventListener('change', handleBScTypeChange);
});
bcaSemesterDropdown.addEventListener('change', handleBCASemesterChange);

// Function to update visibility of course selection sections on step change
function updateVisibilityOfCourseSections() {
    // Hide all subject selection containers
    baSelection.style.display = 'none';
    bcomSelection.style.display = 'none';
    bscSelection.style.display = 'none';
    bcaSelection.style.display = 'none';
    yearSelection.style.display = 'none';
    bscOptions.style.display = 'none';
    bcaSemesters.style.display = 'none';

    if (currentStep === 1) { // Only show these if we are on step 2
        const selectedCourse = document.querySelector('input[name="course"]:checked')?.value;
        if (selectedCourse) {
            if (selectedCourse === 'BA' || selectedCourse === 'BCom' || selectedCourse === 'BSc') {
                yearSelection.style.display = 'block';
                const selectedYear = yearDropdown.value;
                if (selectedYear) {
                    if (selectedCourse === 'BA') {
                        baSelection.style.display = 'block';
                        populateSubjects(BA_SUBJECTS, selectedYear, baCheckboxesContainer, 'BA');
                    } else if (selectedCourse === 'BCom') {
                        bcomSelection.style.display = 'block';
                        populateSubjects(BCOM_SUBJECTS, selectedYear, bcomCheckboxesContainer, 'BCom');
                    } else if (selectedCourse === 'BSc') {
                        bscOptions.style.display = 'block';
                        bscSelection.style.display = 'block';
                        const selectedBscType = document.querySelector('input[name="bscType"]:checked')?.value;
                        if (selectedBscType) {
                            if (selectedBscType === 'Medical') {
                                populateSubjects(BSC_MEDICAL_SUBJECTS, selectedYear, bscCheckboxesContainer);
                            } else if (selectedBscType === 'Non-Medical') {
                                populateSubjects(BSC_NON_MEDICAL_SUBJECTS, selectedYear, bscCheckboxesContainer);
                            }
                        }
                    }
                }
            } else if (selectedCourse === 'BCA') {
                bcaSemesters.style.display = 'block';
                bcaSelection.style.display = 'block';
                const selectedSemester = bcaSemesterDropdown.value;
                if (selectedSemester) {
                    populateSubjects(BCA_SUBJECTS, selectedSemester, bcaCheckboxesContainer);
                }
            }
        }
    }
}


// --- Image Preview Logic ---
passportPhotoInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            passportPhotoPreview.src = e.target.result;
            passportPhotoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        passportPhotoPreview.src = '';
        passportPhotoPreview.style.display = 'none';
    }
});

aadhaarCardInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            aadhaarCardPreview.src = e.target.result;
            aadhaarCardPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        aadhaarCardPreview.src = '';
        aadhaarCardPreview.style.display = 'none';
    }
});


// --- PDF Generation Logic ---
admissionForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    if (!validateCurrentStep()) {
        alert('Please complete all required fields and declarations before submitting.');
        return;
    }

    const doc = new jsPDF();
    let y = 10;
    const margin = 10;
    const lineHeight = 7;
    const sectionSpacing = 10;
    const headerFontSize = 14;
    const labelFontSize = 10;
    const valueFontSize = 10;
    const checkboxFontSize = 10;
    const listMargin = 5;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("GOVT. DEGREE COLLEGE, NAGROTA SURIAN", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += lineHeight;
    doc.setFontSize(12);
    doc.text("DISTT. KANGRA, H.P. 176027", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += lineHeight + 5;
    doc.setFontSize(14);
    doc.text("ADMISSION FORM 2025-26", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += lineHeight;
    doc.text("BA/B.Com/B.Sc/BCA - 1st/2nd/3rd Year/Semester", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += sectionSpacing * 2;


    // --- Personal Information (Step 1) ---
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("1. Personal Information", margin, y);
    y += lineHeight;
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y); // Underline
    y += lineHeight / 2;
    doc.setFontSize(labelFontSize);
    doc.setFont("helvetica", "normal");

    const personalInfoFields = [
        { label: "Class & Year/Sem:", id: "classYearSem" },
        { label: "Name of Candidate:", id: "candidateName" },
        { label: "Gender:", id: "gender" },
        { label: "Mother's Name:", id: "motherName" },
        { label: "Student Mobile No.:", id: "studentMobile" },
        { label: "Student Bank Account No.:", id: "studentBankAccount" },
        { label: "Aadhaar No.:", id: "aadhaarNo" },
        { label: "Category:", id: "category" },
        { label: "Permanent Address:", id: "permanentAddress" },
        { label: "State:", id: "state" },
        { label: "Last Year College Roll No.:", id: "lastYearCollegeRollNo" },
        { label: "ABC ID:", id: "abcId" },
        { label: "Date of Birth:", id: "dob" },
        { label: "Father's Name:", id: "fatherName" },
        { label: "Parent Contact No.:", id: "parentContact" },
        { label: "Student Email ID:", id: "studentEmail" },
        { label: "Annual Family Income:", id: "annualFamilyIncome" },
        { label: "Religion:", id: "religion" },
        { label: "Sub-category:", id: "subCategory" },
        { label: "Address for Correspondence:", id: "correspondenceAddress" },
        { label: "Pin code:", id: "pinCode" },
        { label: "Last Year University Roll No.:", id: "lastYearUniversityRollNo" }
    ];

    let startXLeft = margin;
    let startXRight = doc.internal.pageSize.getWidth() / 2 + 10;
    let currentY = y;

    personalInfoFields.forEach((field, index) => {
        const labelText = field.label;
        const value = document.getElementById(field.id)?.value || 'N/A';

        let xPos = (index % 2 === 0) ? startXLeft : startXRight;
        if (index % 2 === 0 && index !== 0) { // Move to next line for left column
            currentY += lineHeight;
        }

        if (currentY + lineHeight > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            currentY = margin;
            doc.setFontSize(headerFontSize);
            doc.setFont("helvetica", "bold");
            doc.text("1. Personal Information (Continued)", margin, currentY);
            currentY += lineHeight;
            doc.line(margin, currentY, doc.internal.pageSize.getWidth() - margin, currentY); // Underline
            currentY += lineHeight / 2;
            doc.setFontSize(labelFontSize);
            doc.setFont("helvetica", "normal");
        }

        doc.text(`${labelText} ${value}`, xPos, currentY);
    });
    y = currentY + lineHeight + sectionSpacing;

    // Educational Qualification Table
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("Educational Qualification", margin, y);
    y += lineHeight;
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y); // Underline
    y += lineHeight;
    doc.setFontSize(labelFontSize);
    doc.setFont("helvetica", "normal");

    const tableHeaders = ["Qualification", "Board/University", "Year of Passing", "Percentage/CGPA"];
    const tableData = [
        ["10th", "qual10thBoard", "qual10thYear", "qual10thPercentage"],
        ["12th", "qual12thBoard", "qual12thYear", "qual12thPercentage"],
        ["BA/BSc/BCom/BCA-I", "qualUG1Board", "qualUG1Year", "qualUG1Percentage"],
        ["BA/BSc/BCom/BCA-II", "qualUG2Board", "qualUG2Year", "qualUG2Percentage"]
    ];

    const columnWidths = [40, 60, 40, 40]; // Adjust widths as needed
    const startTableY = y;
    let currentTableY = startTableY;

    // Draw table headers
    let currentX = margin;
    tableHeaders.forEach((header, i) => {
        doc.setFont("helvetica", "bold");
        doc.text(header, currentX + 2, currentTableY + 4);
        currentX += columnWidths[i];
    });
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, currentTableY, columnWidths.reduce((a, b) => a + b) + 2, lineHeight + 2); // Header border
    currentTableY += lineHeight + 2;


    // Draw table rows
    tableData.forEach(rowData => {
        currentX = margin;
        doc.setFont("helvetica", "normal");
        doc.rect(margin, currentTableY, columnWidths.reduce((a, b) => a + b) + 2, lineHeight + 2); // Row border
        doc.text(rowData[0], currentX + 2, currentTableY + 4);
        currentX += columnWidths[0];
        doc.text(document.getElementById(rowData[1])?.value || 'N/A', currentX + 2, currentTableY + 4);
        currentX += columnWidths[1];
        doc.text(document.getElementById(rowData[2])?.value || 'N/A', currentX + 2, currentTableY + 4);
        currentX += columnWidths[2];
        doc.text(document.getElementById(rowData[3])?.value || 'N/A', currentX + 2, currentTableY + 4);
        currentTableY += lineHeight + 2;
    });
    y = currentTableY + sectionSpacing;


    // --- Course & Year/Semester (Step 2) ---
    doc.addPage();
    y = margin;
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("2. Course & Year/Semester Information", margin, y);
    y += lineHeight;
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y); // Underline
    y += lineHeight / 2;
    doc.setFontSize(labelFontSize);
    doc.setFont("helvetica", "normal");

    const selectedCourse = document.querySelector('input[name="course"]:checked')?.value || 'N/A';
    doc.text(`Selected Course: ${selectedCourse}`, margin, y);
    y += lineHeight;

    let selectedYearOrSemester = 'N/A';
    let selectedSubjects = [];

    if (selectedCourse === 'BA' || selectedCourse === 'BCom' || selectedCourse === 'BSc') {
        selectedYearOrSemester = yearDropdown.value || 'N/A';
        doc.text(`Selected Year: ${selectedYearOrSemester}`, margin, y);
        y += lineHeight;

        if (selectedCourse === 'BA') {
            selectedSubjects = Array.from(baCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked'))
                                 .map(cb => cb.value);
        } else if (selectedCourse === 'BCom') {
            selectedSubjects = Array.from(bcomCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked'))
                                 .map(cb => cb.value);
        } else if (selectedCourse === 'BSc') {
            const bscType = document.querySelector('input[name="bscType"]:checked')?.value || 'N/A';
            doc.text(`BSc Type: ${bscType}`, margin, y);
            y += lineHeight;
            selectedSubjects = Array.from(bscCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked'))
                                 .map(cb => cb.value);
        }
    } else if (selectedCourse === 'BCA') {
        selectedYearOrSemester = bcaSemesterDropdown.value ? `${bcaSemesterDropdown.value}th Sem` : 'N/A';
        doc.text(`Selected Semester: ${selectedYearOrSemester}`, margin, y);
        y += lineHeight;
        selectedSubjects = Array.from(bcaCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked'))
                             .map(cb => cb.value);
    }

    doc.text("Selected Subjects:", margin, y);
    y += lineHeight;
    if (selectedSubjects.length > 0) {
        selectedSubjects.forEach(subject => {
            doc.text(`- ${subject}`, margin + listMargin, y);
            y += lineHeight;
        });
    } else {
        doc.text("- None selected or not applicable", margin + listMargin, y);
        y += lineHeight;
    }
    y += sectionSpacing;


    // --- Document Upload (Step 3) - Just indicate presence ---
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("3. Document Upload (Indication)", margin, y);
    y += lineHeight;
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y); // Underline
    y += lineHeight / 2;
    doc.setFontSize(labelFontSize);
    doc.setFont("helvetica", "normal");

    const documentInputs = [
        { label: "10th Marksheet:", id: "marksheet10th" },
        { label: "12th Marksheet:", id: "marksheet12th" },
        { label: "Bonafide Certificate:", id: "bonafideCert" },
        { label: "Category Certificate:", id: "categoryCert" },
        { label: "Passport Size Photo:", id: "passportPhoto" },
        { label: "Aadhaar Card:", id: "aadhaarCard" }
    ];

    documentInputs.forEach(input => {
        const fileInput = document.getElementById(input.id);
        const fileName = fileInput?.files[0]?.name || 'Not uploaded';
        doc.text(`${input.label} ${fileName}`, margin, y);
        y += lineHeight;
    });
    y += sectionSpacing;


    // --- Anti-Ragging Pledge (Step 4) ---
    doc.addPage();
    y = margin;
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("4. Anti-Ragging Pledge", margin, y);
    y += lineHeight;
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y); // Underline
    y += lineHeight / 2;
    doc.setFontSize(valueFontSize);
    doc.setFont("helvetica", "normal");
    doc.text("I voluntarily pledge:", margin, y);
    y += lineHeight;
    const antiRaggingPoints = [
        "That I will not indulge in ragging in any form.",
        "That I will report any act of ragging that comes to my notice directly or indirectly to the Anti-Ragging Committee forthwith.",
        "That my objective is to make Govt. Degree College, Nagrota Surian a ZERO RAGGING CAMPUS.",
        "I understand that ragging is a serious crime and strict action will be taken against me if I am found guilty."
    ];
    antiRaggingPoints.forEach(point => {
        doc.text(`• ${point}`, margin + listMargin, y);
        y += lineHeight;
    });

    const pledgeChecked = document.getElementById('pledgeCheck').checked ? 'Agreed' : 'Not Agreed';
    doc.text(`Student's Agreement: ${pledgeChecked}`, margin, y + sectionSpacing);
    y += sectionSpacing * 2;


    // --- Self-Declaration (Step 5) ---
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("5. Self-Declaration", margin, y);
    y += lineHeight;
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y); // Underline
    y += lineHeight / 2;
    doc.setFontSize(valueFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("Undertaking by the Applicant:", margin, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");
    const studentUndertakingPoints = [
        "I am applying for admission at the wish of my parent/guardian.",
        "I will abide by college rules and anti-ragging regulations.",
        "I will pay all dues on time and maintain 75% attendance.",
        "I will take part in required exams and avoid political activity.",
        "I agree to anti-tobacco and anti-drug policies and understand consequences."
    ];
    studentUndertakingPoints.forEach((point, index) => {
        doc.text(`${index + 1}. ${point}`, margin + listMargin, y);
        y += lineHeight;
    });

    const studentDeclChecked = document.getElementById('studentDeclaration').checked ? 'Agreed' : 'Not Agreed';
    doc.text(`Student's Agreement: ${studentDeclChecked}`, margin, y + sectionSpacing);
    y += sectionSpacing * 2;

    doc.setFont("helvetica", "bold");
    doc.text("Declaration by Parent/Guardian:", margin, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");
    const parentDeclText = "I declare that my ward seeks admission with my consent. I will ensure fee payment, monitor attendance and behavior, and accept college actions in case of misconduct.";
    doc.text(parentDeclText, margin + listMargin, y, { maxWidth: doc.internal.pageSize.getWidth() - 2 * margin - listMargin });
    y += lineHeight * 2;

    const parentDeclChecked = document.getElementById('parentDeclaration').checked ? 'Agreed' : 'Not Agreed';
    doc.text(`Parent/Guardian's Agreement: ${parentDeclChecked}`, margin, y + sectionSpacing);
    y += sectionSpacing * 2;


    // Add images if they exist and are valid Base64
    const addImageToPdf = async (imgElement, title) => {
        if (imgElement.src && imgElement.src.startsWith('data:image')) {
            try {
                const imgData = imgElement.src;
                const imgWidth = 50; // Set a fixed width for consistency
                const imgHeight = (imgElement.naturalHeight / imgElement.naturalWidth) * imgWidth;

                if (y + imgHeight + lineHeight > doc.internal.pageSize.getHeight() - margin) {
                    doc.addPage();
                    y = margin;
                }
                doc.setFontSize(labelFontSize);
                doc.setFont("helvetica", "bold");
                doc.text(title, margin, y);
                y += lineHeight;
                doc.addImage(imgData, 'JPEG', margin, y, imgWidth, imgHeight); // Try JPEG first
                y += imgHeight + sectionSpacing;
            } catch (e) {
                console.error(`Failed to add image ${title}:`, e);
                doc.setFontSize(labelFontSize);
                doc.setFont("helvetica", "normal");
                doc.text(`${title} (Error loading image)`, margin, y);
                y += lineHeight;
            }
        } else {
            doc.setFontSize(labelFontSize);
            doc.setFont("helvetica", "normal");
            doc.text(`${title} (Not uploaded)`, margin, y);
            y += lineHeight;
        }
    };

    await addImageToPdf(passportPhotoPreview, "Passport Size Photo:");
    await addImageToPdf(aadhaarCardPreview, "Aadhaar Card:");


    // Save the PDF
    doc.save("College_Admission_Form.pdf");
    alert('Form submitted and PDF generated successfully!');
});


// Initial display
showStep(0);