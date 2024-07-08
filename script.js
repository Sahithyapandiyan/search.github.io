document.getElementById('upload').addEventListener('change', handleFile, false);
document.getElementById('search').addEventListener('input', handleSearch, false);

let excelData = [];

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(excelData);  // For debugging
    };
    reader.readAsArrayBuffer(file);
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const results = excelData.filter(row => row.some(cell => cell && cell.toString().toLowerCase().includes(query)));
    displayResults(results);
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>No results found</p>';
        return;
    }
    const table = document.createElement('table');
    results.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    resultsDiv.appendChild(table);
}
