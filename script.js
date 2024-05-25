let studentsData = [];

document.addEventListener('DOMContentLoaded', () => {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';
    fetch('students.json')
        .then(response => response.json())
        .then(data => {
            studentsData = data;
            populateFilters(data);
            displayStudents(data);
            loadingElement.style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching student data:', error);
            loadingElement.textContent = 'Failed to load data. Please try again later.';
        });

    // Add event listeners for filters and search
    document.getElementById('genderFilter').addEventListener('change', applyFilters);
    document.getElementById('programTypeFilter').addEventListener('change', applyFilters);
    document.getElementById('programFilter').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
    document.getElementById('downloadBtn').addEventListener('click', downloadFilteredData);
});

function populateFilters(data) {
    const genderFilter = document.getElementById('genderFilter');
    const programTypeFilter = document.getElementById('programTypeFilter');
    const programFilter = document.getElementById('programFilter');
    
    const genders = new Set();
    const programTypes = new Set();
    const programs = new Set();
    
    data.forEach(student => {
        genders.add(student["Gender"]);
        programTypes.add(student["ProgramType"]);
        programs.add(student["Program"]);
    });

    genders.forEach(gender => {
        const option = document.createElement('option');
        option.value = gender;
        option.textContent = gender;
        genderFilter.appendChild(option);
    });

    programTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        programTypeFilter.appendChild(option);
    });

    programs.forEach(program => {
        const option = document.createElement('option');
        option.value = program;
        option.textContent = program;
        programFilter.appendChild(option);
    });
}

function displayStudents(data) {
    const studentContainer = document.getElementById('student-container');
    studentContainer.innerHTML = ''; // Clear previous data
    
    if (data.length === 0) {
        studentContainer.innerHTML = '<p>No students found matching the criteria.</p>';
        return;
    }

    data.forEach(student => {
        const studentDiv = document.createElement('div');
        studentDiv.classList.add('student');
        studentDiv.innerHTML = `
            <h2>${student["Name"]}</h2>
            <p>Regd No.: ${student["Regd No."]}</p>
            <p>Mobile: ${student["Mobile"]}</p>
            <p>Email: ${student["E-mail"]}</p>
            <p>Father Name: ${student["Father Name"]}</p>
            <p>Mother Name: ${student["Mother Name"]}</p>
            <p>Program: ${student["Program"]}</p>
            <p>Program Type: ${student["ProgramType"]}</p>
            <p>Batch Year: ${student["BatchYear"]}</p>
            <p>Program Duration: ${student["Program Duration"]} years</p>
            <p>Gender: ${student["Gender"]}</p>
        `;
        studentContainer.appendChild(studentDiv);
    });
}

function applyFilters() {
    const genderFilter = document.getElementById('genderFilter').value;
    const programTypeFilter = document.getElementById('programTypeFilter').value;
    const programFilter = document.getElementById('programFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    let filteredData = studentsData;
    
    if (genderFilter) {
        filteredData = filteredData.filter(student => student["Gender"] === genderFilter);
    }
    
    if (programTypeFilter) {
        filteredData = filteredData.filter(student => student["ProgramType"] === programTypeFilter);
    }
    
    if (programFilter) {
        filteredData = filteredData.filter(student => student["Program"] === programFilter);
    }

    if (searchInput) {
        filteredData = filteredData.filter(student => {
            const name = student["Name"].toLowerCase();
            const regdNo = student["Regd No."].toLowerCase();
            const mobile = student["Mobile"].toLowerCase();
            return name.includes(searchInput) || regdNo.includes(searchInput) || mobile.includes(searchInput);
        });
    }

    displayStudents(filteredData);
}

function clearFilters() {
    document.getElementById('genderFilter').value = '';
    document.getElementById('programTypeFilter').value = '';
    document.getElementById('programFilter').value = '';
    document.getElementById('searchInput').value = '';
    displayStudents(studentsData);
}

function getFilteredData() {
    const genderFilter = document.getElementById('genderFilter').value;
    const programTypeFilter = document.getElementById('programTypeFilter').value;
    const programFilter = document.getElementById('programFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    let filteredData = studentsData;

    if (genderFilter) {
        filteredData = filteredData.filter(student => student["Gender"] === genderFilter);
    }

    if (programTypeFilter) {
        filteredData = filteredData.filter(student => student["ProgramType"] === programTypeFilter);
    }

    if (programFilter) {
        filteredData = filteredData.filter(student => student["Program"] === programFilter);
    }

    if (searchInput) {
        filteredData = filteredData.filter(student => {
            const name = student["Name"].toLowerCase();
            const regdNo = student["Regd No."].toLowerCase();
            const mobile = student["Mobile"].toLowerCase();
            return name.includes(searchInput) || regdNo.includes(searchInput) || mobile.includes(searchInput);
        });
    }

    return filteredData;
}

function downloadFilteredData() {
    const filteredData = getFilteredData();

    if (filteredData.length === 0) {
        alert("No data to download!");
        return;
    }

    const csvContent = generateCSV(filteredData);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'filtered_student_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert("Your browser does not support downloading files. Please try again with a different browser.");
    }
}

function generateCSV(data) {
    let csvContent = "";
    csvContent += "Regd No.,Name,Mobile,E-mail,Father Name,Mother Name,Program,ProgramType,BatchYear,Program Duration,Gender\n";
    data.forEach(student => {
        csvContent += `${student["Regd No."]},${student["Name"]},${student["Mobile"]},${student["E-mail"]},${student["Father Name"]},${student["Mother Name"]},${student["Program"]},${student["ProgramType"]},${student["BatchYear"]},${student["Program Duration"]},${student["Gender"]}\n`;
    });
    return csvContent;
}
