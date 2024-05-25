let studentsData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('students.json')
        .then(response => response.json())
        .then(data => {
            studentsData = data;
            populateFilters(data);
            displayStudents(data);
        })
        .catch(error => console.error('Error fetching student data:', error));
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
    
    displayStudents(filteredData);
}


function search() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    const filteredData = studentsData.filter(student => {
        const name = student["Name"].toLowerCase();
        const regdNo = student["Regd No."].toLowerCase();
        const mobile = student["Mobile"].toLowerCase();
        return name.includes(searchInput) || regdNo.includes(searchInput) || mobile.includes(searchInput);
    });

    displayStudents(filteredData);
}
